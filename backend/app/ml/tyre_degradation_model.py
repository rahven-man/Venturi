import joblib
from pathlib import Path

MODEL_DIR = Path(__file__).parent.parent.parent.parent / "models" / "tyre_degradation"


_model = None
_feature_cols = None
_encoders = None

def load_tyre_deg_artifacts():
    global _model, _feature_cols, _encoders
    if _model is None:
        _model = joblib.load(MODEL_DIR / "tyre_deg_xgb_model.pkl")
        _encoders = joblib.load(MODEL_DIR / "label_encoders.pkl")
        # model ki apni training-time list use karna - safest, pichli baar wale bug se seekha
        _feature_cols = _model.get_booster().feature_names
    return _model, _feature_cols, _encoders