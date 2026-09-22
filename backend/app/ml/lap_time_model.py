import joblib
from pathlib import Path

MODEL_DIR = Path(__file__).parent.parent.parent.parent / "models" / "lap_time_prediction"


_model = None
_feature_cols = None
_encoders = None

def load_lap_time_artifacts():
    global _model, _feature_cols, _encoders
    if _model is None:
        _model = joblib.load(MODEL_DIR / "lap_time_model_v2.pkl")
        _encoders = joblib.load(MODEL_DIR / "label_encoders.pkl")
        # feature_cols.pkl corrupted hai (v3 wali extra list save ho gayi thi galti se)
        # isliye model ki apni training-time feature list use kar rahe hain - ye hamesha authoritative hai
        _feature_cols = _model.get_booster().feature_names
    return _model, _feature_cols, _encoders