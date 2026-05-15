from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TemplateCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    preview_url: Optional[str] = None

class TemplateResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    category: Optional[str]
    preview_url: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
