from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from routes.prediction_routes import router as prediction_router
from utils.logger import logger
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    logger.info(f"Response: {response.status_code} | Duration: {duration}ms")
    return response

app.include_router(prediction_router)