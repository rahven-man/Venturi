from fastapi import APIRouter, HTTPException
from app.schemas.prediction_schemas import LapTimePredictionInput
from app.services import lap_time_prediction_service

router = APIRouter(prefix="/predictions", tags=["Predictions"])

@router.get("/lap-time/options")
def lap_time_options():
    return lap_time_prediction_service.get_valid_options()

@router.post("/lap-time")
def predict_lap_time(input: LapTimePredictionInput):
    try:
        return lap_time_prediction_service.predict_lap_time(input.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid value: {str(e)}")

from app.schemas.prediction_schemas import PitStopPredictionInput
from app.services import pit_stop_prediction_service
from app.ml.pit_stop_model import load_pit_stop_artifacts

@router.get("/pit-stop/options")
def pit_stop_options():
    _, feature_names, _ = load_pit_stop_artifacts()
    return pit_stop_prediction_service.get_valid_options(feature_names)

@router.post("/pit-stop")
def predict_pit_stop(input: PitStopPredictionInput):
    try:
        return pit_stop_prediction_service.predict_pit_stop(input.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

from app.schemas.prediction_schemas import TyreDegradationPredictionInput
from app.services import tyre_degradation_prediction_service

@router.get("/tyre-degradation/options")
def tyre_degradation_options():
    return tyre_degradation_prediction_service.get_valid_options()

@router.post("/tyre-degradation")
def predict_tyre_degradation(input: TyreDegradationPredictionInput):
    try:
        return tyre_degradation_prediction_service.predict_tyre_degradation(input.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))