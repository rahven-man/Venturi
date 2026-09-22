from app.db import get_connection
import numpy as np

def get_drivers_list(active_only: bool = True, search: str = None):
    con = get_connection()

    if search:
        # search bar wala case - sabhi 881 drivers me se naam match karo
        query = f"""
            SELECT
                d.id AS driver_id,
                d.forename || ' ' || d.surname AS full_name,
                d.nationality,
                t.name AS current_team,
                dh.headshot_url
            FROM driver d
            LEFT JOIN (
                SELECT driver_id, team_id, season_id,
                    ROW_NUMBER() OVER (PARTITION BY driver_id ORDER BY season_id DESC) AS rn
                FROM teamdriver
            ) latest ON latest.driver_id = d.id AND latest.rn = 1
            LEFT JOIN team t ON latest.team_id = t.id
            WHERE LOWER(d.forename || ' ' || d.surname) LIKE LOWER('%{search}%')
            LEFT JOIN driver_headshots dh
                ON LOWER(dh.FirstName) = LOWER(d.forename) AND LOWER(dh.LastName) = LOWER(d.surname)
            ORDER BY d.surname
        """
    elif active_only:
        query = """
            WITH latest_season AS (
                SELECT MAX(season_id) AS max_season_id FROM teamdriver
            ),
            deduped AS (
                SELECT
                    td.driver_id,
                    td.team_id,
                    ROW_NUMBER() OVER (
                        PARTITION BY td.driver_id
                        ORDER BY td.team_id
                    ) AS rn
                FROM teamdriver td
                JOIN latest_season ls ON td.season_id = ls.max_season_id
            )
            SELECT
                d.id AS driver_id,
                d.forename || ' ' || d.surname AS full_name,
                d.nationality,
                t.name AS current_team,
                dh.headshot_url
            FROM deduped dd
            JOIN driver d ON dd.driver_id = d.id
            JOIN team t ON dd.team_id = t.id
            LEFT JOIN driver_headshots dh
                ON LOWER(dh.FirstName) = LOWER(d.forename) AND LOWER(dh.LastName) = LOWER(d.surname)
            WHERE dd.rn = 1
            ORDER BY d.surname
        """
    else:
        # full list - poore 881 drivers
        query = """
            SELECT
                d.id AS driver_id,
                d.forename || ' ' || d.surname AS full_name,
                d.nationality,
                t.name AS current_team,
                dh.headshot_url
            FROM driver d
            LEFT JOIN (
                SELECT driver_id, team_id, season_id,
                    ROW_NUMBER() OVER (PARTITION BY driver_id ORDER BY season_id DESC) AS rn
                FROM teamdriver
            ) latest ON latest.driver_id = d.id AND latest.rn = 1
            LEFT JOIN team t ON latest.team_id = t.id
            LEFT JOIN driver_headshots dh
                ON LOWER(dh.FirstName) = LOWER(d.forename) AND LOWER(dh.LastName) = LOWER(d.surname)
            ORDER BY d.surname
        """

    df = con.execute(query).df()
    df = df.replace({np.nan: None})
    return df.to_dict(orient="records")


def get_driver_profile(driver_id: int):
    con = get_connection()
    query = f"""
        SELECT
            d.id AS driver_id,
            d.forename || ' ' || d.surname AS full_name,
            d.nationality,
            d.date_of_birth,
            d.permanent_car_number,
            t.name AS current_team,
            dh.headshot_url
        FROM driver d
        LEFT JOIN (
            SELECT driver_id, team_id, season_id,
                ROW_NUMBER() OVER (PARTITION BY driver_id ORDER BY season_id DESC) AS rn
            FROM teamdriver
        ) latest ON latest.driver_id = d.id AND latest.rn = 1
        LEFT JOIN team t ON latest.team_id = t.id
        LEFT JOIN driver_headshots dh
            ON LOWER(dh.FirstName) = LOWER(d.forename) AND LOWER(dh.LastName) = LOWER(d.surname)
        WHERE d.id = {driver_id}
    """
    result = con.execute(query).df()
    if result.empty:
        return None
    result = result.replace({np.nan: None})
    return result.to_dict(orient="records")[0]


def get_driver_season_stats(driver_id: int, year: int):
    con = get_connection()

    gp = con.execute(f"""
        SELECT
            COUNT(*) AS gp_races,
            COALESCE(SUM(points), 0) AS gp_points,
            SUM(CASE WHEN position = 1 THEN 1 ELSE 0 END) AS gp_wins,
            SUM(CASE WHEN position <= 3 THEN 1 ELSE 0 END) AS gp_podiums,
            SUM(CASE WHEN grid = 1 THEN 1 ELSE 0 END) AS gp_poles,
            SUM(CASE WHEN position <= 10 THEN 1 ELSE 0 END) AS gp_top10s,
            SUM(CASE WHEN fastest_lap_rank = 1 THEN 1 ELSE 0 END) AS gp_fastest_laps,
            SUM(CASE WHEN is_classified = 'f' THEN 1 ELSE 0 END) AS gp_dnfs
        FROM race_results
        WHERE driver_id = {driver_id} AND year = {year}
    """).df().to_dict(orient="records")[0]

    sprint = con.execute(f"""
        SELECT
            COUNT(*) AS sprint_races,
            COALESCE(SUM(points), 0) AS sprint_points,
            SUM(CASE WHEN position = 1 THEN 1 ELSE 0 END) AS sprint_wins,
            SUM(CASE WHEN position <= 3 THEN 1 ELSE 0 END) AS sprint_podiums,
            SUM(CASE WHEN grid = 1 THEN 1 ELSE 0 END) AS sprint_poles,
            SUM(CASE WHEN position <= 10 THEN 1 ELSE 0 END) AS sprint_top10s
        FROM sprint_results
        WHERE driver_id = {driver_id} AND year = {year}
    """).df().to_dict(orient="records")[0]

    return {"year": year, "gp": gp, "sprint": sprint}


def get_driver_career_stats(driver_id: int):
    con = get_connection()

    career_df = con.execute(f"""
        SELECT
            COUNT(*) AS gp_entered,
            COALESCE(SUM(points), 0) AS career_points,
            CAST(COALESCE(SUM(CASE WHEN position = 1 THEN 1 ELSE 0 END), 0) AS INT) AS wins,
            CAST(COALESCE(SUM(CASE WHEN position <= 3 THEN 1 ELSE 0 END), 0) AS INT) AS podiums,
            CAST(COALESCE(SUM(CASE WHEN grid = 1 THEN 1 ELSE 0 END), 0) AS INT) AS poles,
            CAST(COALESCE(SUM(CASE WHEN fastest_lap_rank = 1 THEN 1 ELSE 0 END), 0) AS INT) AS fastest_laps,
            COALESCE(ROUND(COALESCE(SUM(points), 0) * 1.0 / NULLIF(COUNT(*), 0), 2), 0.0) AS pts_per_race,
            MIN(CASE WHEN position IS NOT NULL THEN position END) AS highest_finish,
            MIN(CASE WHEN grid IS NOT NULL AND grid > 0 THEN grid END) AS highest_grid,
            CAST(COALESCE(SUM(CASE WHEN is_classified = 'f' THEN 1 ELSE 0 END), 0) AS INT) AS dnfs
        FROM race_results
        WHERE driver_id = {driver_id}
    """).df().replace({np.nan: None})
    career = career_df.to_dict(orient="records")[0]

    champs = con.execute(f"""
        SELECT COUNT(*) AS world_championships
        FROM season_final_standings
        WHERE driver_id = {driver_id} AND position = 1
    """).df().to_dict(orient="records")[0]["world_championships"]

    career["world_championships"] = int(champs)
    career["gp_won"] = career["wins"]
    return career


def get_driver_season_trend(driver_id: int):
    con = get_connection()

    query = f"""
        SELECT
            year,
            COUNT(*) AS races,
            COALESCE(SUM(points), 0) AS points,
            SUM(CASE WHEN position = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN position <= 3 THEN 1 ELSE 0 END) AS podiums,
            AVG(CASE WHEN position IS NOT NULL THEN position END) AS avg_finish_position
        FROM race_results
        WHERE driver_id = {driver_id}
        GROUP BY year
        ORDER BY year
    """
    df = con.execute(query).df()
    df = df.replace({np.nan: None})
    return df.to_dict(orient="records")


def get_driver_dna_radar(driver_id: int, year: int = None):
    con = get_connection()
    filter_clause = f"AND year = {year}" if year else ""

    stats = con.execute(f"""
        SELECT
            COUNT(*) AS races,
            SUM(CASE WHEN position = 1 THEN 1 ELSE 0 END) AS wins,
            SUM(CASE WHEN grid = 1 THEN 1 ELSE 0 END) AS poles,
            COALESCE(SUM(points), 0) AS points,
            SUM(CASE WHEN is_classified = 'f' THEN 1 ELSE 0 END) AS dnfs,
            AVG(grid) AS avg_grid,
            AVG(CASE WHEN position IS NOT NULL THEN position END) AS avg_finish
        FROM race_results
        WHERE driver_id = {driver_id} {filter_clause}
    """).df().to_dict(orient="records")[0]

    if not stats["races"]:
        return {"year": year if year else "career", "races": 0, "radar": None, "message": "No race data found for this driver_id"}


    races = stats["races"] or 1  # divide-by-zero guard

    pole_rate = (stats["poles"] or 0) / races
    win_rate = (stats["wins"] or 0) / races
    # NOTE: 26 = current-era max points (win + fastest lap). Approximation for normalization,
    # not from any notebook - purely a UI radar-scaling choice, documented here.
    points_rate = min((stats["points"] or 0) / races / 26, 1.0)
    finish_rate = 1 - ((stats["dnfs"] or 0) / races)
    racecraft_raw = (stats["avg_grid"] or 0) - (stats["avg_finish"] or 0)
    racecraft = max(0.0, min(racecraft_raw / 10, 1.0))  # clipped + normalized, documented approximation
    clutch = min((stats["wins"] or 0) / max(stats["poles"] or 0, 1), 1.0)

    return {
        "year": year if year else "career",
        "races": stats["races"],
        "radar": {
            "qualifying_pole_rate": round(pole_rate, 3),
            "race_pace_win_rate": round(win_rate, 3),
            "consistency_points_rate": round(points_rate, 3),
            "reliability_finish_rate": round(finish_rate, 3),
            "racecraft_positions_gained": round(racecraft, 3),
            "clutch_win_conversion": round(clutch, 3),
        }
    }


def get_driver_career_matrix(driver_id: int):
    con = get_connection()
    query = f"""
        SELECT
            rr.year,
            r.number AS round_number,
            c.name AS circuit_name,
            rr.position,
            rr.points,
            rr.grid,
            rr.is_classified
        FROM race_results rr
        JOIN round r ON rr.round_id = r.id
        JOIN circuit c ON r.circuit_id = c.id
        WHERE rr.driver_id = {driver_id}
        ORDER BY rr.year ASC, r.number ASC
    """
    df = con.execute(query).df()
    df = df.replace({np.nan: None})
    rows = df.to_dict(orient="records")

    for row in rows:
        row["is_win"] = row["position"] == 1
        row["is_podium"] = row["position"] is not None and row["position"] <= 3
        row["is_dnf"] = row["is_classified"] == "f"
        del row["is_classified"]

    return rows