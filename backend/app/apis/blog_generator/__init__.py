import databutton as db
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import asyncpg
from openai import OpenAI
import json

router = APIRouter()
client = OpenAI(api_key=db.secrets.get("OPENAI_API_KEY"))

class BlogGenerationRequest(BaseModel):
    strain_id: int

class BlogPost(BaseModel):
    id: int
    strain_id: int
    title: str
    content: str
    tags: list[str]

async def get_db_connection():
    conn = await asyncpg.connect(db.secrets.get("DATABASE_URL_DEV"))
    try:
        yield conn
    finally:
        await conn.close()

@router.post("/blog/generate", response_model=BlogPost)
async def generate_blog_post(
    request: BlogGenerationRequest,
    conn: asyncpg.Connection = Depends(get_db_connection)
):
    strain_data = await conn.fetchrow(
        "SELECT * FROM strains WHERE id = $1", request.strain_id
    )
    if not strain_data:
        raise HTTPException(status_code=404, detail="Strain not found")

    cannabinoids = json.loads(strain_data['cannabinoids'])

    prompt = f"""
    Generate an SEO-friendly blog post for the cannabis strain '{strain_data['strain_name']}'.
    Structure the output with a title and content, separated by '---'.
    For example:
    The Ultimate Guide to {strain_data['strain_name']}
    ---
    Here is the full blog post content...

    Use the following lab data:
    - THCa: {cannabinoids.get('THCa', 'N/A')}%
    - Delta-9 THC: {cannabinoids.get('Delta-9 THC', 'N/A')}%
    - Terpenes: {strain_data['terpenes']}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a cannabis content writer, skilled in creating engaging, SEO-friendly articles."},
            {"role": "user", "content": prompt}
        ],
    )
    generated_text = response.choices[0].message.content or ""

    parts = generated_text.split('---', 1)
    if len(parts) == 2:
        title = parts[0].strip()
        content = parts[1].strip()
    else:
        title = f"An Essential Guide to {strain_data['strain_name']}"
        content = generated_text.strip()

    tags = ["cannabis", "thca", strain_data['strain_name'].lower().replace(" ", "-")]

    new_post_record = await conn.fetchrow(
        """
        INSERT INTO blog_posts (strain_id, title, content, tags)
        VALUES ($1, $2, $3, $4)
        RETURNING id, strain_id, title, content, tags
        """,
        request.strain_id,
        title,
        content,
        tags
    )

    if not new_post_record:
        raise HTTPException(status_code=500, detail="Failed to save the blog post.")

    return new_post_record



