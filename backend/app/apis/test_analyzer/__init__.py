from fastapi import APIRouter, UploadFile, File, HTTPException
import PyPDF2
import io

# It's better to use print() for logging in the Databutton environment
# as the standard logging can cause issues.
router = APIRouter(prefix="/test", tags=["Test"])

@router.post("/analyze_pdf")
async def analyze_pdf_test(file: UploadFile = File(...)):
    """
    A simplified endpoint to test PDF text extraction in isolation.
    """
    if file.content_type != 'application/pdf':
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")

    print("Starting PDF processing in test_analyzer.")
    try:
        # Read file content into memory
        pdf_content = await file.read()
        
        # Use BytesIO to handle the in-memory binary data
        pdf_stream = io.BytesIO(pdf_content)
        
        # Process with PyPDF2
        pdf_reader = PyPDF2.PdfReader(pdf_stream)
        text_parts = [page.extract_text() for page in pdf_reader.pages]
        text_content = "\\n".join(filter(None, text_parts))
        
        print("PDF processing successful in test_analyzer.")
        
        if not text_content:
            return {"text": "No text could be extracted from the PDF."}
            
        return {"text": text_content}

    except Exception as e:
        print(f"Error processing PDF in test_analyzer: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")

