from fastapi import APIRouter
from schemas.validation import ACRequest
from services.prediction_service import predict_price
from utils.logger import logger

router = APIRouter()

@router.get("/")
def home():
    logger.info("Health check hit")
    return {"message": "AC prediction API running"}


@router.post("/predict")
def predict(data: ACRequest):
    try:
        logger.info(f"Prediction request received: {data}")
        result = predict_price(data.model_dump())
        return result

    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise