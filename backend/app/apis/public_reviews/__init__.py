from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import databutton as db
import asyncpg
from uuid import UUID
from app.libs.database import get_db_connection
import json
from app.auth import AuthorizedUser

class CoaData(BaseModel):
    strain_name: str
    thca: float
    delta_9_thc: float
    cbd: float
    pesticides_passed: bool
    heavy_metals_passed: bool
    residual_solvents_passed: bool

class PublicAnalysisResult(BaseModel):
    id: UUID
    data: CoaData
    summary: str
    total_thc: float
    created_at: str

class StrainAnalysisReview(BaseModel):
    id: UUID
    strain_name: str
    thca_percentage: float
    status: str
    created_at: str

router = APIRouter(prefix="/public/reviews", tags=["Public Reviews"])

@router.get("/", response_model=list[PublicAnalysisResult])
async def list_published_reviews():
    """Lists all published strain reviews."""
    conn = await get_db_connection()
    try:
        query = "SELECT id, data, summary, total_thc, created_at FROM strain_analysis_reviews WHERE status = 'published' ORDER BY created_at DESC"
        rows = await conn.fetch(query)
        
        results = []
        for row in rows:
            try:
                data = json.loads(row['data'])
                results.append(
                    PublicAnalysisResult(
                        id=row['id'],
                        data=data,
                        summary=row['summary'],
                        total_thc=row['total_thc'],
                        created_at=row['created_at'].isoformat()
                    )
                )
            except (json.JSONDecodeError, TypeError):
                # Skip records with invalid JSON
                continue
        return results
    finally:
        await conn.close()

@router.get("/all", response_model=list[StrainAnalysisReview])
async def list_all_reviews(user: AuthorizedUser):
    """Lists all strain reviews for admins."""
    # Add admin role check here in a real application
    conn = await get_db_connection()
    try:
        query = "SELECT id, data, status, created_at FROM strain_analysis_reviews ORDER BY created_at DESC"
        rows = await conn.fetch(query)
        
        results = []
        for row in rows:
            try:
                data = json.loads(row['data'])
                results.append(
                    StrainAnalysisReview(
                        id=row['id'],
                        strain_name=data.get('strain_name', 'N/A'),
                        thca_percentage=data.get('thca', 0.0),
                        status=row['status'],
                        created_at=row['created_at'].isoformat()
                    )
                )
            except (json.JSONDecodeError, TypeError):
                # Skip records with invalid JSON
                continue
        return results
    finally:
        await conn.close()

@router.get("/{review_id}", response_model=PublicAnalysisResult)
async def get_published_review(review_id: UUID):
    """Fetches a single published strain review."""
    conn = await get_db_connection()
    try:
        query = "SELECT id, data, summary, total_thc, created_at FROM strain_analysis_reviews WHERE id = $1 AND status = 'published'"
        row = await conn.fetchrow(query, review_id)
        if row:
            return PublicAnalysisResult(
                id=row['id'],
                data=json.loads(row['data']),
                summary=row['summary'],
                total_thc=row['total_thc'],
                created_at=row['created_at'].isoformat()
            )
        else:
            raise HTTPException(status_code=404, detail="Published review not found")
    finally:
        await conn.close()
"""
@router.get("/details/{review_id}") #, response_model=PublicAnalysisResult)
async def get_published_review2(review_id: str):
    return {"message": "This endpoint is temporarily disabled for maintenance."}
"""
# @router.get("/details/{review_id}", response_model=PublicAnalysisResult)
# async def get_published_review2(review_id: str):
#     """Fetches a single published strain review by ID, returning the full analysis."""
#     conn = None
#     try:
#         conn = await get_db_connection()
#         query = "SELECT * FROM strain_analysis_reviews WHERE id = $1 AND status = 'published'"
        
#         # Validate UUID
#         try:
#             validated_uuid = UUID(review_id)
#         except ValueError:
#             raise HTTPException(status_code=400, detail="Invalid review ID format.")

#         record = await conn.fetchrow(query, validated_uuid)
        
#         if not record:
#             raise HTTPException(status_code=404, detail="Published review not found.")

#         return PublicAnalysisResult.model_validate(record)

#     except HTTPException as e:
#         # Re-raise HTTPException to be handled by FastAPI
#         raise e
#     except Exception as e:
#         # Log the error for debugging
#         print(f"Error fetching published review {review_id}: {e}")
#         raise HTTPException(status_code=500, detail="Internal server error.")
#     finally:
#         if conn:
#             await conn.close()

@router.patch("/{review_id}/approve", status_code=204)
async def approve_review(review_id: UUID, user: AuthorizedUser):
    """Approves a strain review."""
    # Add admin role check here
    conn = await get_db_connection()
    try:
        query = "UPDATE strain_analysis_reviews SET status = 'published' WHERE id = $1"
        await conn.execute(query, review_id)
    finally:
        await conn.close()

@router.delete("/{review_id}", status_code=204)
async def delete_review(review_id: UUID, user: AuthorizedUser):
    """Deletes a strain review."""
    # Add admin role check here
    conn = await get_db_connection()
    try:
        query = "DELETE FROM strain_analysis_reviews WHERE id = $1"
        await conn.execute(query, review_id)
    finally:
        await conn.close()





