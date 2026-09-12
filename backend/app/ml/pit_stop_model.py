import json
from pathlib import Path
from xgboost import XGBClassifier

MODEL_DIR = Path(r"C:\F1-AI\models\pit_stop_prediction")

_model = None
_feature_names = None
_metrics = None

def load_pit_stop_artifacts():
    global _model, _feature_names, _metrics
    if _model is None:
        _model = XGBClassifier()
        _model.load_model(MODEL_DIR / "xgb_pit_stop_model.json")
        # feature_list.json pe bharosa nahi - model se hi uski asli training-time columns poochte hain
        _feature_names = _model.get_booster().feature_names
        with open(MODEL_DIR / "metrics.json") as f:
            _metrics = json.load(f)
    return _model, _feature_names, _metrics