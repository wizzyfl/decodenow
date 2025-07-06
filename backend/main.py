import os
import pathlib
import json
import dotenv
from typing import Optional
from fastapi import FastAPI, APIRouter, Depends

dotenv.load_dotenv()

from databutton_app.mw.auth_mw import AuthConfig, get_authorized_user


def get_router_config() -> Optional[dict]:
    try:
        cfg_path = pathlib.Path(__file__).parent / "routers.json"
        with open(cfg_path) as f:
            cfg = json.load(f)
    except Exception:
        return None
    return cfg


def is_auth_disabled(router_config: dict, name: str) -> bool:
    try:
        return router_config["routers"][name].get("disableAuth", False)
    except KeyError:
        return False


def import_api_routers() -> APIRouter:
    """Create top level router including all user defined endpoints."""
    routes = APIRouter(prefix="/routes")

    router_config = get_router_config() or {}

    src_path = pathlib.Path(__file__).parent

    # Path to your APIs folder
    apis_path = src_path / "app" / "apis"

    # Find all API modules with __init__.py (one level deep)
    api_names = [
        p.parent.name
        for p in apis_path.glob("*/__init__.py")
    ]

    api_module_prefix = "app.apis."

    for name in api_names:
        print(f"Importing API: {name}")
        try:
            api_module = __import__(api_module_prefix + name, fromlist=["router"])
            api_router = getattr(api_module, "router", None)
            if isinstance(api_router, APIRouter):
                routes.include_router(
                    api_router,
                    dependencies=(
                        []
                        if is_auth_disabled(router_config, name)
                        else [Depends(get_authorized_user)]
                    ),
                )
                print(f"Included router: {name}")
            else:
                print(f"No 'router' found in {name}")
        except Exception as e:
            print(f"Failed to import {name}: {e}")

    print(f"Registered routes: {[route.path for route in routes.routes]}")

    return routes


def get_firebase_config() -> Optional[dict]:
    extensions = os.environ.get("DATABUTTON_EXTENSIONS", "[]")
    try:
        extensions = json.loads(extensions)
    except json.JSONDecodeError:
        extensions = []

    for ext in extensions:
        if ext.get("name") == "firebase-auth":
            return ext.get("config", {}).get("firebaseConfig")

    return None


def create_app() -> FastAPI:
    app = FastAPI()

    # Include all API routers
    app.include_router(import_api_routers())

    # Basic root endpoint for health check
    @app.get("/")
    def root():
        return {"status": "ok", "message": "API is running"}

    # Log registered routes
    for route in app.routes:
        if hasattr(route, "methods"):
            for method in route.methods:
                print(f"{method} {route.path}")

    # Set up auth config from environment
    firebase_config = get_firebase_config()

    if firebase_config is None:
        print("No firebase config found")
        app.state.auth_config = None
    else:
        print("Firebase config found")
        auth_config = {
            "jwks_url": "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
            "audience": firebase_config["projectId"],
            "header": "authorization",
        }
        app.state.auth_config = AuthConfig(**auth_config)

    return app


app = create_app()
