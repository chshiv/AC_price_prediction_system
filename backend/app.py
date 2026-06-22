from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import time
from logger import logger


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("ac_price_model.pkl")
logger.info("Model loaded successfully")


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    logger.info(f"Response: {response.status_code} | Duration: {duration}ms")
    return response


@app.get("/")
def home():
    logger.info("Health check hit")
    return {"message": "AC prediction API running"}


@app.post("/predict")
def predict(data: dict):
    try:
        logger.info(f"Prediction request received: {data}")
        df = pd.DataFrame([data])

        def energy(num):
            if num == 1:
                return 0
            elif 1 < num < 4:
                return 1
            else:
                return 2


        df['energy_efficient'] = df['star_rating'].apply(energy)
        df['smart'] = (
            (df['wifi_enabled'] == 1) &
            (df['inverter'] == 1)
        ).astype(int)

        prediction = model.predict(df)

        original_price = round(float(prediction[0][1]), 2)
        discount = round(float(prediction[0][0]), 2)


        def price_after_discount(original_price, discount):
            logger.info(f"Calculating price after discount | original_price={original_price}, discount={discount}%")
            price = round(original_price * (1 - discount / 100), 2)
            logger.info(f"Final price after discount: {price}")
            return price
        
        result = {
            "original_price": original_price,
            "discount": discount,
            "price_after_discount": price_after_discount(original_price, discount) 
        }
        logger.info(f"Prediction result: {result}")
        return result

    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise