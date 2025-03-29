from fastapi import FastAPI
from routes.auth_routes import router as auth_router
from routes.prediction import router as prediction_router
from config import settings
from tortoise.contrib.fastapi import register_tortoise
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Register routes
app.include_router(auth_router, prefix="/auth")
app.include_router(prediction_router, prefix="/pred")

# Register Tortoise ORM
register_tortoise(
    app,
    db_url=settings.DATABASE_URL,
    modules={"models": ["models.user"]},
    generate_schemas=True,
    add_exception_handlers=True,
)

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173",  # Example for React development server
    "http://localhost:3000",  # Example for React development server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],   # Allow all headers
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI MVC Authentication Example!"}
