from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import projects, templates
from app.database import engine, Base
from dotenv import load_dotenv
import os

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Website Builder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(templates.router, prefix="/api/templates", tags=["templates"])

@app.get("/")
async def root():
    return {"message": "Website Builder API"}
