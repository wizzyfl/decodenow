import functools
from http import HTTPStatus
from typing import Annotated, Callable, Optional, Tuple
import jwt
from fastapi import Depends, HTTPException, WebSocket, WebSocketException, status
from fastapi.requests import HTTPConnection
from jwt import PyJWKClient
from pydantic import BaseModel
from starlette.requests import Request


class AuthConfig(BaseModel):
    jwks_url: str
    audience: str
    header: str


class User(BaseModel):
    sub: str
    user_id: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None
    email: Optional[str] = None


def get_auth_config(request: HTTPConnection) -> AuthConfig:
    auth_config: Optional[AuthConfig] = request.app.state.auth_config
    if auth_config is None:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED, detail="No auth config"
        )
    return auth_config


AuthConfigDep = Annotated[AuthConfig, Depends(get_auth_config)]


def get_audit_log(request: HTTPConnection) -> Optional[Callable[[str], None]]:
    return getattr(request.app.state.databutton_app_state, "audit_log", None)


AuditLogDep = Annotated[Optional[Callable[[str], None]], Depends(get_audit_log)]


def get_authorized_user(request: HTTPConnection) -> User:
    auth_config = get_auth_config(request)

    try:
        if isinstance(request, WebSocket):
            user = authorize_websocket(request, auth_config)
        elif isinstance(request, Request):
            user = authorize_request(request, auth_config)
        else:
            raise ValueError("Unexpected request type")

        if user is not None:
            return user
        print("Request authentication returned no user")
    except Exception as e:
        print(f"Request authentication failed: {e}")

    if isinstance(request, WebSocket):
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION, reason="Not authenticated"
        )
    else:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED, detail="Not authenticated"
        )


@functools.cache
def get_jwks_client(url: str):
    return PyJWKClient(url, cache_keys=True)


def get_signing_key(url: str, token: str) -> Tuple[str, str]:
    client = get_jwks_client(url)
    signing_key = client.get_signing_key_from_jwt(token)
    key = signing_key.key
    alg = signing_key.algorithm_name
    if alg != "RS256":
        raise ValueError(f"Unsupported signing algorithm: {alg}")
    return key, alg


def authorize_websocket(request: WebSocket, auth_config: AuthConfig) -> Optional[User]:
    header = "Sec-Websocket-Protocol"
    prefix = "Authorization.Bearer."
    protocols_header = request.headers.get(header)
    protocols = (
        [h.strip() for h in protocols_header.split(",")] if protocols_header else []
    )

    token: Optional[str] = None
    for p in protocols:
        if p.startswith(prefix):
            token = p[len(prefix):]
            break

    if not token:
        print(f"Missing bearer {prefix}.<token> in protocols")
        return None

    return authorize_token(token, auth_config)


def authorize_request(request: Request, auth_config: AuthConfig) -> Optional[User]:
    auth_header = request.headers.get(auth_config.header)
    if not auth_header:
        print(f"Missing header '{auth_config.header}'")
        return None

    token = auth_header[7:] if auth_header.startswith("Bearer ") else None
    if not token:
        print(f"Missing bearer token in '{auth_config.header}'")
        return None

    return authorize_token(token, auth_config)


def authorize_token(token: str, auth_config: AuthConfig) -> Optional[User]:
    jwks_urls = [(auth_config.audience, auth_config.jwks_url)]
    payload = None

    for audience, jwks_url in jwks_urls:
        try:
            key, alg = get_signing_key(jwks_url, token)
        except Exception as e:
            print(f"Failed to get signing key {e}")
            continue

        try:
            payload = jwt.decode(
                token,
                key=key,
                algorithms=[alg],
                audience=audience,
            )
            break
        except jwt.PyJWTError as e:
            print(f"Failed to decode and validate token {e}")

    try:
        user = User.model_validate(payload)
        print(f"User {user.sub} authenticated")
        return user
    except Exception as e:
        print(f"Failed to parse token payload {e}")
        return None
