from pathlib import Path

# Project root = C:\F1-AI\ (locally) or /app/ (on Render)
# Using relative paths so this works on any machine / OS
BASE_DIR = Path(__file__).parent.parent.parent

FASTF1_PARQUET_PATH = BASE_DIR / "data" / "processed" / "fastf1_ml_base.parquet"
JOLPICA_DIR = BASE_DIR / "data" / "processed" / "jolpica"