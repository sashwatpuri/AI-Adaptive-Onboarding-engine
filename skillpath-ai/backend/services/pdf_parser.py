import fitz  # PyMuPDF
import pdfplumber
from io import BytesIO
from config import config

def parse_pdf(file_bytes: bytes, filename: str = "") -> str:
    if filename.lower().endswith('.docx'):
        from docx import Document
        doc = Document(BytesIO(file_bytes))
        text = "\n".join(paragraph.text for paragraph in doc.paragraphs)
        return clean_text(text)

    # Primary for PDF: PyMuPDF
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text("text") + "\n"
        text = text.strip()
        if len(text) > 100:
            return clean_text(text)
    except Exception:
        pass
    
    # Fallback for PDF: pdfplumber
    with pdfplumber.open(BytesIO(file_bytes)) as pdf:
        text = "\n".join(
            p.extract_text() or "" for p in pdf.pages
        )
    return clean_text(text)

def clean_text(text: str) -> str:
    import re
    # Remove excessive whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Remove standalone page numbers
    text = re.sub(r'^\d+$', '', text, flags=re.MULTILINE)
    # Truncate to max chars
    return text[:config.MAX_RESUME_CHARS].strip()
