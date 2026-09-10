from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ok", "message": "Venturi backend is alive"}




from app.db import get_connection
from app.config import FASTF1_PARQUET_PATH

@app.get("/test-data")
def test_data():
    con = get_connection()
    result = con.execute(
        f"SELECT COUNT(*) as total_rows FROM '{FASTF1_PARQUET_PATH}'"
    ).fetchone()
    return {"total_rows": result[0]}