from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    prompt = Column(Text, nullable=False)
    html = Column(Text, nullable=True)
    css = Column(Text, nullable=True)
    js = Column(Text, nullable=True)
    template_id = Column(Integer, ForeignKey("templates.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", backref="projects")
    template = relationship("Template", backref="projects")
