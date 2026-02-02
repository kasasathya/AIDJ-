"""
Upload Router - Supabase Storage Upload API
============================================

This is the ONLY file storage solution for this project.
Firebase Storage has been completely removed.

Architecture:
- Frontend uploads files to backend API
- Backend uploads to Supabase Storage using service_role key
- Backend returns public URL to frontend
- Frontend uses URL to play audio

This keeps Supabase credentials secure on the backend.

Endpoints:
- POST /upload-audio - Upload MP3 file and get public URL
- GET /api/upload/files - List all uploaded files
- DELETE /api/upload/{filename} - Delete a file
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from backend.services.supabase_storage import upload_file, delete_file, list_files

router = APIRouter(tags=["upload"])


# ==================== MODELS ====================

class UploadResponse(BaseModel):
    """Response for file upload"""
    success: bool
    url: str
    filename: str
    message: str


class FileInfo(BaseModel):
    """Info about an uploaded file"""
    name: str
    url: str
    size: int
    created_at: Optional[str] = None


class FileListResponse(BaseModel):
    """Response for file listing"""
    success: bool
    files: List[FileInfo]
    total: int


# ==================== ENDPOINTS ====================

@router.post("/upload-audio", response_model=UploadResponse)
async def upload_audio(file: UploadFile = File(...)):
    """
    Upload an MP3 file to Supabase Storage
    
    Flow:
    1. Client sends file to this endpoint
    2. Backend validates file (MP3 only, max 50MB)
    3. Backend uploads to Supabase Storage (audio-files bucket)
    4. Backend returns public URL
    5. Client can use URL to play audio
    
    No authentication required (client testing mode).
    
    Example usage:
        curl -X POST -F "file=@song.mp3" https://aidj-backend.onrender.com/upload-audio
    
    Returns:
        {
            "success": true,
            "url": "https://xxx.supabase.co/storage/v1/object/public/audio-files/songs/song.mp3",
            "filename": "song.mp3",
            "message": "File uploaded successfully"
        }
    """
    
    # Debug logging
    print(f"🎯 UPLOAD HIT: {file.filename}")
    print(f"   Content-Type: {file.content_type}")
    print(f"   Size: {file.size if hasattr(file, 'size') else 'unknown'} bytes")
    
    # Validate file extension
    if not file.filename or not file.filename.lower().endswith('.mp3'):
        raise HTTPException(
            status_code=400,
            detail="Only MP3 files are allowed. Please upload a .mp3 file."
        )
    
    # Validate content type
    allowed_types = ["audio/mpeg", "audio/mp3", "application/octet-stream"]
    if file.content_type and file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid content type: {file.content_type}. Expected audio/mpeg or audio/mp3."
        )
    
    # Read file content
    try:
        file_data = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to read uploaded file: {str(e)}"
        )
    
    # Check file size (max 50MB)
    max_size = 50 * 1024 * 1024  # 50MB in bytes
    if len(file_data) > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is 50MB. Your file: {len(file_data) / 1024 / 1024:.2f}MB"
        )
    
    if len(file_data) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty"
        )
    
    # Upload to Supabase Storage
    result = upload_file(
        file_data=file_data,
        filename=file.filename,
        content_type=file.content_type or "audio/mpeg"
    )
    
    # Check for errors
    if not result["success"]:
        error_message = result.get("error", "Unknown error occurred")
        
        # Provide helpful error messages
        if "credentials" in error_message.lower() or "not configured" in error_message.lower():
            raise HTTPException(
                status_code=503,
                detail="Storage service not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables."
            )
        
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {error_message}"
        )
    
    return UploadResponse(
        success=True,
        url=result["url"],
        filename=file.filename,
        message="File uploaded successfully to Supabase Storage"
    )


@router.get("/api/upload/files", response_model=FileListResponse)
async def get_uploaded_files():
    """
    List all uploaded audio files in Supabase Storage
    
    Returns:
        List of files with their public URLs, sizes, and creation dates
    """
    result = list_files()
    
    if not result["success"]:
        raise HTTPException(
            status_code=500,
            detail=result.get("error", "Failed to list files")
        )
    
    files = [
        FileInfo(
            name=f["name"],
            url=f["url"],
            size=f.get("size", 0),
            created_at=f.get("created_at")
        )
        for f in result["files"]
    ]
    
    return FileListResponse(
        success=True,
        files=files,
        total=len(files)
    )


@router.delete("/api/upload/{filename}")
async def delete_uploaded_file(filename: str):
    """
    Delete a file from Supabase Storage
    
    Args:
        filename: The name of the file to delete (e.g., "song.mp3")
        
    Returns:
        Success message or error
    """
    if not filename.lower().endswith('.mp3'):
        raise HTTPException(
            status_code=400,
            detail="Invalid filename"
        )
    
    result = delete_file(filename)
    
    if not result["success"]:
        raise HTTPException(
            status_code=500,
            detail=result.get("error", "Delete failed")
        )
    
    return {
        "success": True,
        "message": f"Successfully deleted {filename} from Supabase Storage"
    }
