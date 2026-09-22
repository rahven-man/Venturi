from fastapi import FastAPI
from app.routers import drivers,teams,circuits,standings,predictions
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()
app.include_router(drivers.router)
app.include_router(teams.router)
app.include_router(circuits.router)
app.include_router(standings.router)
app.include_router(predictions.router)

# Locally: defaults to localhost:3000.
# Production (Render): set FRONTEND_URL env var to your Vercel domain.
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


@app.get("/test-jolpica")
def test_jolpica():
    con = get_connection()
    result = con.execute("SELECT COUNT(*) as total_drivers FROM driver").fetchone()
    return {"total_drivers": result[0]}