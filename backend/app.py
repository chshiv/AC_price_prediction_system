from fastapi import FastAPI
import joblib
import pandas as pd

app = FastAPI()

model = joblib.load("ac_price_model.pkl")

@app.get("/")
def home():
    return {"message": "AC prediction API running"}

def energy(num):
    if num == 1:
        return 0
    elif 1 < num < 4:
        return 1
    else:
        return 2

@app.post("/predict")
def predict(data: dict):
    df = pd.DataFrame([data])

    df['energy_efficient'] = df['star_rating'].apply(energy)
    df['smart'] = ((df['wifi_enabled'] == 1) & (df['inverter'] == 1)).astype(int)

    prediction = model.predict(df)
    return {
        "original_price": float(prediction[0][1]),
        "discount": float(prediction[0][0])
    }