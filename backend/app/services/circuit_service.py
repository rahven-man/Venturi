import numpy as np
from app.db import get_connection

def get_circuits_list(active_only: bool = True, search: str = None):
    con = get_connection()

    if search:
        query = f"""
            SELECT id AS circuit_id, name, country, locality
            FROM circuit
            WHERE LOWER(name) LIKE LOWER('%{search}%')
            ORDER BY name
        """
    elif active_only:
        query = """
            WITH latest_season AS (SELECT MAX(id) AS max_season_id FROM season)
            SELECT DISTINCT c.id AS circuit_id, c.name, c.country, c.locality
            FROM round r
            JOIN latest_season ls ON r.season_id = ls.max_season_id
            JOIN circuit c ON r.circuit_id = c.id
            ORDER BY c.name
        """
    else:
        query = "SELECT id AS circuit_id, name, country, locality FROM circuit ORDER BY name"

    df = con.execute(query).df()
    df = df.replace({np.nan: None})
    return df.to_dict(orient="records")


def get_circuit_profile(circuit_id: int):
    con = get_connection()
    query = f"""
        SELECT
            c.id AS circuit_id, c.name, c.locality, c.country, c.country_code,
            c.latitude, c.longitude,
            (SELECT MIN(s.year) FROM round r JOIN season s ON r.season_id = s.id
                WHERE r.circuit_id = c.id) AS first_hosted_year,
            (SELECT COUNT(*) FROM round r WHERE r.circuit_id = c.id) AS total_races_hosted
        FROM circuit c
        WHERE c.id = {circuit_id}
    """
    result = con.execute(query).df()
    if result.empty:
        return None
    result = result.replace({np.nan: None})
    return result.to_dict(orient="records")[0]


def get_circuit_lap_record(circuit_id: int):
    con = get_connection()
    query = f"""
        SELECT
            lt.lap_seconds, lt.year,
            d.forename || ' ' || d.surname AS driver_name,
            t.name AS team_name
        FROM lap_times lt
        JOIN driver d ON lt.driver_id = d.id
        JOIN team t ON lt.team_id = t.id
        WHERE lt.circuit_id = {circuit_id}
        ORDER BY lt.lap_seconds ASC
        LIMIT 1
    """
    result = con.execute(query).df()
    if result.empty:
        return None
    return result.to_dict(orient="records")[0]


def get_circuit_winners(circuit_id: int, limit: int = 10):
    con = get_connection()
    query = f"""
        SELECT
            rr.year,
            d.forename || ' ' || d.surname AS driver_name,
            t.name AS team_name
        FROM race_results rr
        JOIN round r ON rr.round_id = r.id
        JOIN driver d ON rr.driver_id = d.id
        JOIN team t ON rr.team_id = t.id
        WHERE r.circuit_id = {circuit_id} AND rr.position = 1
        ORDER BY rr.year DESC
        LIMIT {limit}
    """
    df = con.execute(query).df()
    df = df.replace({np.nan: None})
    return df.to_dict(orient="records")


def get_circuit_all_time_stats(circuit_id: int):
    con = get_connection()

    most_wins_driver = con.execute(f"""
        SELECT d.forename || ' ' || d.surname AS driver_name, COUNT(*) AS wins
        FROM race_results rr
        JOIN round r ON rr.round_id = r.id
        JOIN driver d ON rr.driver_id = d.id
        WHERE r.circuit_id = {circuit_id} AND rr.position = 1
        GROUP BY driver_name
        ORDER BY wins DESC
        LIMIT 1
    """).df()

    most_wins_team = con.execute(f"""
        SELECT t.name AS team_name, COUNT(*) AS wins
        FROM race_results rr
        JOIN round r ON rr.round_id = r.id
        JOIN team t ON rr.team_id = t.id
        WHERE r.circuit_id = {circuit_id} AND rr.position = 1
        GROUP BY team_name
        ORDER BY wins DESC
        LIMIT 1
    """).df()

    return {
        "most_wins_driver": most_wins_driver.to_dict(orient="records")[0] if not most_wins_driver.empty else None,
        "most_wins_team": most_wins_team.to_dict(orient="records")[0] if not most_wins_team.empty else None,
    }