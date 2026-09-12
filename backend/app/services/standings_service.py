import numpy as np
from app.db import get_connection

def get_available_seasons():
    con = get_connection()
    df = con.execute("SELECT DISTINCT year FROM season ORDER BY year DESC").df()
    return df["year"].tolist()


def get_driver_standings(year: int):
    con = get_connection()
    query = f"""
        SELECT
            sfs.position,
            d.forename || ' ' || d.surname AS driver_name,
            t.name AS team_name,
            sfs.points,
            sfs.win_count AS wins
        FROM season_final_standings sfs
        JOIN driver d ON sfs.driver_id = d.id
        JOIN season s ON sfs.season_id = s.id
        LEFT JOIN (
            SELECT driver_id, team_id, season_id FROM teamdriver
        ) td ON td.driver_id = sfs.driver_id AND td.season_id = sfs.season_id
        LEFT JOIN team t ON td.team_id = t.id
        WHERE s.year = {year}
        ORDER BY sfs.position ASC
    """
    df = con.execute(query).df()
    df = df.replace({np.nan: None})
    return df.to_dict(orient="records")


def get_constructor_standings(year: int):
    con = get_connection()
    query = f"""
        SELECT
            sfst.position,
            t.name AS team_name,
            sfst.points,
            sfst.win_count AS wins
        FROM season_final_standings_team sfst
        JOIN team t ON sfst.team_id = t.id
        JOIN season s ON sfst.season_id = s.id
        WHERE s.year = {year}
        ORDER BY sfst.position ASC
    """
    df = con.execute(query).df()
    df = df.replace({np.nan: None})
    return df.to_dict(orient="records")