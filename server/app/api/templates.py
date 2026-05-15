from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Template
from app.schemas.template import TemplateCreate, TemplateResponse

router = APIRouter()

@router.get("/", response_model=List[TemplateResponse])
async def list_templates(db: Session = Depends(get_db)):
    templates = db.query(Template).all()
    return templates

@router.get("/{template_id}", response_model=TemplateResponse)
async def get_template(template_id: int, db: Session = Depends(get_db)):
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )
    return template

@router.post("/", response_model=TemplateResponse)
async def create_template(
    template: TemplateCreate,
    db: Session = Depends(get_db)
):
    new_template = Template(**template.dict())
    db.add(new_template)
    db.commit()
    db.refresh(new_template)
    return new_template
