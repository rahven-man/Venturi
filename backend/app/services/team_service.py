import numpy as np
from app.db import get_connection

def get_teams_list(active_only: bool = True, search: str = None):
    con = get_connection()

    if search:
        query = f"""
            SELECT id AS team_id, name, nationality
            FROM team
            WHERE LOWER(name) LIKE LOWER('%{search}%')
            ORDER BY name
        """
    elif active_only:
        query = """
            WITH latest_season AS (
                SELECT MAX(season_id) AS max_season_id FROM teamdriver
            )
            SELECT DISTINCT t.id AS team_id, t.name, t.nationality
            FROM teamdriver td
            JOIN latest_season ls ON td.season_id = ls.max_season_id
            JOIN team t ON td.team_id = t.id
            ORDER BY t.name
        """
    else:
        query = "SELECT id AS team_id, name, nationality FROM team ORDER BY name"

    df = con.execute(query).df()
    df = df.replace({np.nan: None})
    return df.to_dict(orient="records")


def get_team_profile(team_id: int):
    con = get_connection()

    query = f"""
        WITH latest_team_season AS (
            SELECT MAX(td.season_id) AS season_id
            FROM teamdriver td
            WHERE td.team_id = {team_id}
        ),
        current_drivers AS (
            SELECT STRING_AGG(d.forename || ' ' || d.surname, ' · ' ORDER BY d.surname) AS driver_names
            FROM teamdriver td
            JOIN driver d ON td.driver_id = d.id
            JOIN latest_team_season lts ON td.season_id = lts.season_id
            WHERE td.team_id = {team_id}
        )
        SELECT
            t.id AS team_id,
            t.name,
            t.nationality,
            t.country_code,
            cd.driver_names AS current_drivers,
            (SELECT MIN(s.year) FROM teamdriver td
                JOIN season s ON td.season_id = s.id
                WHERE td.team_id = t.id) AS first_entry_year
        FROM team t
        CROSS JOIN current_drivers cd
        WHERE t.id = {team_id}
    """
    result = con.execute(query).df()
    if result.empty:
        return None
    result = result.replace({np.nan: None})
    return result.to_dict(orient="records")[0]


def get_team_season_stats(team_id: int, year: int):
    con = get_connection()

    query = f"""
        SELECT
            COUNT(*) AS gp_entries,
            COALESCE(SUM(points), 0) AS team_points,
            SUM(CASE WHEN position = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN position <= 3 THEN 1 ELSE 0 END) AS podiums,
            SUM(CASE WHEN grid = 1 THEN 1 ELSE 0 END) AS poles,
            SUM(CASE WHEN position <= 10 THEN 1 ELSE 0 END) AS top10s,
            SUM(CASE WHEN is_classified = 'f' THEN 1 ELSE 0 END) AS dnfs
        FROM race_results
        WHERE team_id = {team_id} AND year = {year}
    """
    result = con.execute(query).df().to_dict(orient="records")[0]
    return {"year": year, "stats": result}


def get_team_career_stats(team_id: int):
    con = get_connection()

    query = f"""
        SELECT
            COUNT(*) AS gp_entered,
            COALESCE(SUM(points), 0) AS career_points,
            MIN(CASE WHEN position IS NOT NULL THEN position END) AS highest_finish,
            SUM(CASE WHEN position <= 3 THEN 1 ELSE 0 END) AS podiums,
            MIN(CASE WHEN grid IS NOT NULL AND grid > 0 THEN grid END) AS highest_grid,
            SUM(CASE WHEN is_classified = 'f' THEN 1 ELSE 0 END) AS dnfs
        FROM race_results
        WHERE team_id = {team_id}
    """
    result = con.execute(query).df().to_dict(orient="records")[0]

    champs = con.execute(f"""
        SELECT COUNT(*) AS world_championships
        FROM season_final_standings_team
        WHERE team_id = {team_id} AND position = 1
    """).df().to_dict(orient="records")[0]["world_championships"]

    result["world_championships"] = int(champs)
    return result


def get_team_season_trend(team_id: int):
    con = get_connection()
    query = f"""
        SELECT
            year,
            COUNT(*) AS races,
            COALESCE(SUM(points), 0) AS points,
            SUM(CASE WHEN position = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN position <= 3 THEN 1 ELSE 0 END) AS podiums
        FROM race_results
        WHERE team_id = {team_id}
        GROUP BY year
        ORDER BY year
    """
    df = con.execute(query).df()
    df = df.replace({np.nan: None})
    return df.to_dict(orient="records")