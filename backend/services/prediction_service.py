import joblib
import pandas as pd
from utils.logger import logger

model = joblib.load("models/ac_price_model.pkl")
logger.info("Model loaded successfully")


def energy(num):
    if num == 1:
        return 0
    elif 1 < num < 4:
        return 1
    else:
        return 2


def price_after_discount(original_price, discount):
    logger.info(f"Calculating price after discount | original_price={original_price}, discount={discount}%")
    price = round(original_price * (1 - discount / 100), 2)
    logger.info(f"Final price after discount: {price}")
    return price


def predict_price(data: dict) -> dict:
    df = pd.DataFrame([data])

    df['energy_efficient'] = df['star_rating'].apply(energy)
    df['smart'] = (
        (df['wifi_enabled'] == 1) &
        (df['inverter'] == 1)
    ).astype(int)

    prediction = model.predict(df)

    original_price = round(float(prediction[0][1]), 2)
    discount = round(float(prediction[0][0]), 2)

    result = {
        "original_price": original_price,
        "discount": discount,
        "price_after_discount": price_after_discount(original_price, discount)
    }

    logger.info(f"Prediction result: {result}")
    return result