from fastapi import FastAPI
import joblib
import pandas as pd

app = FastAPI()


# Load model once when container starts
model = joblib.load(
    "ac_predictor.pkl"
)

@app.post("/predict")
def predict(data:dict):

    df = pd.DataFrame([data])


    result = model.predict(df)


    return {
        "discount_percent": float(result[0][0]),
        "original_price": float(result[0][1])
    }