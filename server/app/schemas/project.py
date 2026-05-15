from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectCreate(BaseModel):
    prompt: str
    template_id: Optional[int] = None
    style: Optional[str] = "modern"
    industry: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    user_id: int
    prompt: str
    html: Optional[str]
    css: Optional[str]
    js: Optional[str]
    template_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class WebsiteGenerateResponse(BaseModel):
    html: str
    css: str
    js: str
    content: str
