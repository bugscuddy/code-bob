from app.database import SessionLocal, engine
from app.models import Template, Base

def seed_templates():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if templates already exist
    existing = db.query(Template).first()
    if existing:
        print("Templates already seeded")
        return
    
    templates = [
        Template(
            name="Landing Page",
            description="A modern landing page with hero section, features, and call-to-action",
            category="landing",
            preview_url=""
        ),
        Template(
            name="Portfolio",
            description="A professional portfolio template with project showcase and about section",
            category="portfolio",
            preview_url=""
        ),
        Template(
            name="Blog",
            description="A clean blog template with post listings and reading view",
            category="blog",
            preview_url=""
        ),
        Template(
            name="Business",
            description="A corporate business website with services, team, and contact sections",
            category="business",
            preview_url=""
        ),
        Template(
            name="E-commerce",
            description="An e-commerce template with product grid and shopping cart",
            category="ecommerce",
            preview_url=""
        ),
    ]
    
    for template in templates:
        db.add(template)
    
    db.commit()
    print("Templates seeded successfully")

if __name__ == "__main__":
    seed_templates()
