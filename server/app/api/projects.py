from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Project, User
from app.schemas.project import ProjectCreate, ProjectResponse, WebsiteGenerateResponse
from app.services.ollama_service import ollama_service
import zipfile
import io
from fastapi.responses import Response

router = APIRouter()

@router.post("/generate", response_model=ProjectResponse)
async def generate_website(
    project_data: ProjectCreate,
    db: Session = Depends(get_db)
):
    # Generate website using Ollama
    try:
        generated = await ollama_service.generate_website(
            prompt=project_data.prompt,
            template=str(project_data.template_id) if project_data.template_id else None,
            style=project_data.style,
            industry=project_data.industry
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate website: {str(e)}"
        )
    
    # Create project in database
    new_project = Project(
        prompt=project_data.prompt,
        html=generated["html"],
        css=generated["css"],
        js=generated["js"],
        template_id=project_data.template_id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    return new_project

@router.get("/", response_model=List[ProjectResponse])
async def list_projects(
    db: Session = Depends(get_db)
):
    projects = db.query(Project).all()
    return projects

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project

@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    db.delete(project)
    db.commit()
    
    return {"message": "Project deleted successfully"}

@router.get("/{project_id}/export")
async def export_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Create ZIP file
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # Add HTML file
        zip_file.writestr("index.html", project.html or "")
        # Add CSS file
        zip_file.writestr("styles.css", project.css or "")
        # Add JS file
        zip_file.writestr("script.js", project.js or "")
    
    zip_buffer.seek(0)
    
    return Response(
        content=zip_buffer.getvalue(),
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename=website-{project_id}.zip"}
    )
