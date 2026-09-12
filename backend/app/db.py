import duckdb
from app.config import FASTF1_PARQUET_PATH, JOLPICA_DIR

JOLPICA_TABLES = [
    "baseteam", "championshipadjustment", "championshipsystem", "circuit",
    "driver", "driverchampionship", "lap", "penalty", "pitstop",
    "pointsystem", "round", "roundentry", "season", "session",
    "sessionentry", "team", "teamchampionship", "teamdriver",
]

def get_connection():
    con = duckdb.connect()
    con.execute(f"CREATE VIEW fastf1 AS SELECT * FROM '{FASTF1_PARQUET_PATH}'")

    for table_name in JOLPICA_TABLES:
        file_path = JOLPICA_DIR / f"formula_one_{table_name}.parquet"
        con.execute(f"CREATE VIEW {table_name} AS SELECT * FROM '{file_path}'")

    # race-level results: one row per driver per race (session type 'R')
    con.execute("""
        CREATE VIEW race_results AS
        SELECT
            se.position, se.points, se.grid, se.laps_completed,
            se.is_classified, se.status, se.fastest_lap_rank,
            re.round_id, td.driver_id, td.team_id,
            r.season_id, s.year
        FROM sessionentry se
        JOIN session sess ON se.session_id = sess.id
        JOIN roundentry re ON se.round_entry_id = re.id
        JOIN teamdriver td ON re.team_driver_id = td.id
        JOIN round r ON re.round_id = r.id
        JOIN season s ON r.season_id = s.id
        WHERE sess.type = 'R'
    """)

    # same shape but for sprint races
    con.execute("""
        CREATE VIEW sprint_results AS
        SELECT
            se.position, se.points, se.grid, se.laps_completed,
            se.is_classified, se.status, se.fastest_lap_rank,
            re.round_id, td.driver_id, td.team_id,
            r.season_id, s.year
        FROM sessionentry se
        JOIN session sess ON se.session_id = sess.id
        JOIN roundentry re ON se.round_entry_id = re.id
        JOIN teamdriver td ON re.team_driver_id = td.id
        JOIN round r ON re.round_id = r.id
        JOIN season s ON r.season_id = s.id
        WHERE sess.type = 'SR'
    """)

    # season-end championship standing (last race's cumulative row per driver per season)
    con.execute("""
        CREATE VIEW season_final_standings AS
        WITH race_standings AS (
            SELECT * FROM driverchampionship WHERE round_id IS NOT NULL
        ),
        ranked AS (
            SELECT *,
                ROW_NUMBER() OVER (PARTITION BY driver_id, season_id ORDER BY round_number DESC) AS rn
            FROM race_standings
        )
        SELECT * FROM ranked WHERE rn = 1
    """)

    con.execute("""
        CREATE VIEW season_final_standings_team AS
        WITH race_standings AS (
            SELECT * FROM teamchampionship WHERE round_id IS NOT NULL
        ),
        ranked AS (
            SELECT *,
                ROW_NUMBER() OVER (PARTITION BY team_id, season_id ORDER BY round_number DESC) AS rn
            FROM race_standings
        )
        SELECT * FROM ranked WHERE rn = 1
    """)
    
    # lap-level data joined to circuit, race sessions only, clean (non-deleted) laps
    con.execute("""
        CREATE VIEW lap_times AS
        SELECT
            l.id AS lap_id,
            CAST(split_part(l.time, ':', 1) AS DOUBLE) * 3600
                + CAST(split_part(l.time, ':', 2) AS DOUBLE) * 60
                + CAST(split_part(l.time, ':', 3) AS DOUBLE) AS lap_seconds,
            td.driver_id, td.team_id,
            r.circuit_id, r.id AS round_id,
            s.year
        FROM lap l
        JOIN sessionentry se ON l.session_entry_id = se.id
        JOIN session sess ON se.session_id = sess.id
        JOIN roundentry re ON se.round_entry_id = re.id
        JOIN teamdriver td ON re.team_driver_id = td.id
        JOIN round r ON re.round_id = r.id
        JOIN season s ON r.season_id = s.id
        WHERE sess.type = 'R' AND l.is_deleted = 'f'
    """)

    
    con.execute("""
        CREATE VIEW driver_headshots AS
        SELECT Driver AS fastf1_code, FirstName, LastName, MAX(HeadshotUrl) AS headshot_url
        FROM fastf1
        WHERE HeadshotUrl IS NOT NULL AND HeadshotUrl != ''
        GROUP BY Driver, FirstName, LastName
    """) 

    return con