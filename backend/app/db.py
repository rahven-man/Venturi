import duckdb
from app.config import FASTF1_PARQUET_PATH

def get_connection():
    # har baar ek naya connection banate hain, halka operation hai isliye problem nahi
    con = duckdb.connect()
    return con