from fastapi import APIRouter, Depends,   Body
from controllers.auth import authenticate_user, create_access_token
from config import settings
from pydantic import BaseModel
from middlewares.auth_middleware import get_current_user
# from controllers.prediction import fetch_crypto_data ,add_technical_indicators
import joblib
from controllers.prediction import predict_next_price, prepare_data_for_prediction
from pydantic import BaseModel
from fastapi import HTTPException
# Load the trained model
# model = joblib.load("BTC-USD_xgboost_model.pkl")


# Define request model
class PredictionRequest(BaseModel):
    symbol: str = 'BTC-USD'  # Default to 'BTC-USD' if no symbol is provided
router = APIRouter()

# For Every timse step Predictions
@router.post("/predict")
async def predict(current_user: dict = Depends(get_current_user) ):
    try:
        result = predict_next_price()
        print(result)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except Exception as e:
        print(str(e))
        return {"error": str(e)}

# Fetches all the predictions for the last 60 days
@router.post("/previous_predictions")
async def predict(current_user: dict = Depends(get_current_user) ):
    try:
        actuals, predictions = prepare_data_for_prediction()
        return {
            "actuals": actuals.tolist(),
            "predictions": predictions.tolist()
        }
    except Exception as e:
        print(str(e))
        return {"error": str(e)}