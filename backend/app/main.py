from fastapi import FastAPI
from app.routes.auth import router as auth_router
from app.database.connection import client, get_database
from app.routes.ewaste import router as ewaste_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="E-Waste Management Platform",
    description="Backend API for an e-waste management platform",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
     allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(ewaste_router)

@app.get("/")
def root():
    return {
        "message": "E-Waste Management Platform API",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/database-test")
def database_test():
    try:
        client.admin.command("ping")

        db = get_database()

        return {
            "status": "success",
            "message": "MongoDB connection successful",
            "database": db.name
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }