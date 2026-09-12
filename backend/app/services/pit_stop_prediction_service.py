import numpy as np
import pandas as pd
from app.db import get_connection
from app.ml.pit_stop_model import load_pit_stop_artifacts


def _get_circuit_avg_telemetry(con, event_name):
    result = con.execute(f"""
        SELECT AVG(avg_speed), AVG(max_speed), AVG(avg_throttle), AVG(full_throttle_pct),
               AVG(max_rpm), AVG(brake_sample_pct), AVG(drs_active_pct)
        FROM fastf1
        WHERE EventName = '{event_name}' AND SessionName = 'Race'
    """).fetchone()
    keys = ["avg_speed", "max_speed", "avg_throttle", "full_throttle_pct", "max_rpm", "brake_sample_pct", "drs_active_pct"]
    # koi bhi None aaye to 0.0 fallback - kabhi crash nahi hona chahiye
    return {k: (float(v) if v is not None else 0.0) for k, v in zip(keys, result)}


def _get_circuit_avg_weather(con, event_name):
    result = con.execute(f"""
        SELECT AVG(Pressure), AVG(WindDirection), AVG(WindSpeed),
               AVG(Rainfall), AVG(AirTemp), AVG(TrackTemp), AVG(Humidity)
        FROM fastf1
        WHERE EventName = '{event_name}' AND SessionName = 'Race'
    """).fetchone()
    keys = ["Pressure", "WindDirection", "WindSpeed", "Rainfall", "AirTemp", "TrackTemp", "Humidity"]
    return {k: (float(v) if v is not None else 0.0) for k, v in zip(keys, result)}


def _get_driver_pace(con, driver, event_name):
    result = con.execute(f"""
        SELECT AVG(LapTime_seconds)
        FROM fastf1
        WHERE Driver = '{driver}' AND EventName = '{event_name}' AND SessionName = 'Race'
          AND status_green = true AND status_red_flag = false AND PitOutTime IS NULL
          AND LapTime_seconds IS NOT NULL
    """).fetchone()
    if result[0] is not None:
        return float(result[0])
    result = con.execute(f"""
        SELECT AVG(LapTime_seconds)
        FROM fastf1
        WHERE Driver = '{driver}' AND SessionName = 'Race'
          AND status_green = true AND status_red_flag = false AND PitOutTime IS NULL
          AND LapTime_seconds IS NOT NULL
    """).fetchone()
    return float(result[0]) if result[0] is not None else 90.0


def _get_total_laps_est(con, event_name):
    result = con.execute(f"""
        SELECT MAX(LapNumber) FROM fastf1
        WHERE EventName = '{event_name}' AND SessionName = 'Race'
    """).fetchone()
    return int(result[0]) if result and result[0] else 60


def _get_typical_stint_length(con, event_name, compound_category):
    result = con.execute(f"""
        SELECT QUANTILE_CONT(TyreLife, 0.75)
        FROM fastf1
        WHERE EventName = '{event_name}' AND Compound_category = '{compound_category}'
          AND PitInTime IS NOT NULL
    """).fetchone()
    if result[0] is not None:
        return float(result[0])
    result = con.execute(f"""
        SELECT QUANTILE_CONT(TyreLife, 0.75)
        FROM fastf1
        WHERE Compound_category = '{compound_category}' AND PitInTime IS NOT NULL
    """).fetchone()
    # koi data hi na mile to hard default - kabhi 0/None nahi jaane denge (division-by-zero se bachne ke liye)
    return float(result[0]) if result[0] is not None else 20.0


def predict_pit_stop(payload: dict):
    model, feature_names, metrics = load_pit_stop_artifacts()
    con = get_connection()

    driver = payload["driver"]
    team = payload["team"]
    event_name = payload["event_name"]
    compound_category = payload["compound_category"].upper()
    lap_number = payload["lap_number"]
    stint = payload["stint"]
    tyre_life = payload["tyre_life"]
    fresh_tyre = payload["fresh_tyre"]
    grid_position = payload["grid_position"]

    # sahi team/event chuna gaya hai ya nahi - model ke apne one-hot columns se validate
    team_col = f"Team_{team}"
    event_col = f"EventName_{event_name}"
    if team_col not in feature_names:
        raise ValueError(f"team '{team}' model ke training data me nahi tha (valid team naam check karo)")
    if event_col not in feature_names:
        raise ValueError(f"event_name '{event_name}' model ke training data me nahi tha")

    total_laps_est = _get_total_laps_est(con, event_name)
    telemetry_avg = _get_circuit_avg_telemetry(con, event_name)
    weather_avg = _get_circuit_avg_weather(con, event_name)

    pressure = payload.get("pressure") if payload.get("pressure") is not None else weather_avg["Pressure"]
    wind_speed = payload.get("wind_speed") if payload.get("wind_speed") is not None else weather_avg["WindSpeed"]
    wind_direction = payload.get("wind_direction") if payload.get("wind_direction") is not None else weather_avg["WindDirection"]
    prev_lap_rainfall = payload.get("prev_lap_rainfall") if payload.get("prev_lap_rainfall") is not None else weather_avg["Rainfall"]
    prev_lap_airtemp = payload.get("prev_lap_airtemp") if payload.get("prev_lap_airtemp") is not None else weather_avg["AirTemp"]
    prev_lap_tracktemp = payload.get("prev_lap_tracktemp") if payload.get("prev_lap_tracktemp") is not None else weather_avg["TrackTemp"]
    prev_lap_humidity = payload.get("prev_lap_humidity") if payload.get("prev_lap_humidity") is not None else weather_avg["Humidity"]

    driver_prev_lap_time = payload.get("last_lap_time") if (payload.get("last_lap_time") is not None and payload.get("last_lap_time") > 0) else _get_driver_pace(con, driver, event_name)

    position_prev_lap = payload.get("current_position") if payload.get("current_position") is not None else grid_position
    position_two_laps_ago = payload.get("position_two_laps_ago") if payload.get("position_two_laps_ago") is not None else position_prev_lap

    is_sc = payload.get("is_safety_car_active", False)
    is_vsc = payload.get("is_vsc_active", False)
    is_yellow = payload.get("is_yellow_flag", False)
    is_green = not (is_sc or is_vsc or is_yellow)

    is_clean_green_lap = is_green
    is_restart_lap = payload.get("is_restart_lap", False)

    laps_since_restart = payload.get("laps_since_restart")
    laps_since_green_resumed = laps_since_restart if laps_since_restart is not None else 99  # 99 = "bahut der ho gayi recovery se", notebook ka hi default
    sc_recovery_decay = np.exp(-laps_since_green_resumed / 3)

    fuel_load_pct = 1 - (lap_number - 1) / total_laps_est
    fuel_load_proxy = fuel_load_pct * 110
    race_progress_pct = (lap_number - 1) / total_laps_est
    laps_to_go = total_laps_est - lap_number
    cumulative_green_laps = max(lap_number - 1, 0)

    typical_stint_length = _get_typical_stint_length(con, event_name, compound_category)
    tyre_life_pct_of_typical = tyre_life / typical_stint_length  # typical_stint_length kabhi 0 nahi hota, guard already laga hai upar

    row = {
        "LapNumber": lap_number, "Stint": stint, "TyreLife": tyre_life,
        "FreshTyre": fresh_tyre, "FastF1Generated": True,
        "Pressure": pressure, "WindDirection": wind_direction, "WindSpeed": wind_speed,
        **telemetry_avg,  # avg_speed, max_speed, avg_throttle, full_throttle_pct, max_rpm, brake_sample_pct, drs_active_pct
        "status_green": is_green, "status_yellow": is_yellow, "status_unused3": False,
        "status_safety_car": is_sc, "status_red_flag": False, "status_vsc": is_vsc,
        "status_vsc_ending": False, "status_unknown": False,
        "is_out_lap": payload.get("is_out_lap", False),
        "driver_prev_lap_time": driver_prev_lap_time,
        "position_prev_lap": position_prev_lap,
        "stint_lap_number": tyre_life + 1,
        "tyrelife_sqrt": np.sqrt(tyre_life), "tyrelife_log1p": np.log1p(tyre_life),
        "is_clean_green_lap": is_clean_green_lap, "is_restart_lap": is_restart_lap,
        "laps_since_green_resumed": laps_since_green_resumed, "sc_recovery_decay": sc_recovery_decay,
        "fuel_load_pct": fuel_load_pct, "fuel_load_proxy": fuel_load_proxy,
        "race_progress_pct": race_progress_pct,
        "cumulative_green_laps": cumulative_green_laps, "green_laps_sqrt": np.sqrt(cumulative_green_laps),
        "is_race_leader": position_prev_lap == 1,
        "grid_delta": position_prev_lap - grid_position,
        "prev_lap_rainfall": prev_lap_rainfall, "prev_lap_airtemp": prev_lap_airtemp,
        "prev_lap_tracktemp": prev_lap_tracktemp, "prev_lap_humidity": prev_lap_humidity,
        "track_temp_minus_airtemp": prev_lap_tracktemp - prev_lap_airtemp,
        "laps_to_go": laps_to_go,
        "is_mandatory_two_compound_race": True,  # dry race ka standard F1 rule
        "typical_stint_length": typical_stint_length,
        "tyre_life_pct_of_typical": tyre_life_pct_of_typical,
        "is_rain_increasing": payload.get("is_rain_increasing", False),
        "is_first_lap_after_sc": is_restart_lap,
        "position_two_laps_ago": position_two_laps_ago,
        "position_change_last_lap": position_two_laps_ago - position_prev_lap,
        "leader_pitted_this_lap": payload.get("leader_pitted_this_lap", False),
        "leader_pitted_prev_lap": payload.get("leader_pitted_prev_lap", False),
        "car_ahead_pitted_this_lap": payload.get("car_ahead_pitted_this_lap", False),
        "car_ahead_pitted_prev_lap": payload.get("car_ahead_pitted_prev_lap", False),
    }

    # saare Compound_*, Compound_category_*, Team_*, EventName_* one-hot columns 0 se start
    for col in feature_names:
        if col.startswith("Compound_category_"):
            row[col] = (col == f"Compound_category_{compound_category}")
        elif col.startswith("Compound_") and not col.startswith("Compound_category_"):
            row[col] = (col == f"Compound_{compound_category}")
        elif col.startswith("Team_"):
            row[col] = (col == team_col)
        elif col.startswith("EventName_"):
            row[col] = (col == event_col)

    X = pd.DataFrame([[row[col] for col in feature_names]], columns=feature_names)

    pit_probability = float(model.predict_proba(X)[0][1])

    return {
        "pit_probability_pct": round(pit_probability * 100, 1),
        "recommended_threshold_pct": round(metrics["best_threshold_f1"] * 100, 1),
        "likely_pit_lap": pit_probability >= metrics["best_threshold_f1"],
        "assumptions_used": {
            "total_laps_estimated": total_laps_est,
            "telemetry_source": "circuit_historical_average (live telemetry not user-provided)",
            "driver_pace_source": "user_provided" if payload.get("last_lap_time") else "driver_historical_average_at_circuit",
        }
    }


def get_valid_options(feature_names):
    teams = sorted([c.replace("Team_", "") for c in feature_names if c.startswith("Team_")])
    events = sorted([c.replace("EventName_", "") for c in feature_names if c.startswith("EventName_")])
    compounds = sorted([c.replace("Compound_category_", "") for c in feature_names if c.startswith("Compound_category_")])
    return {"teams": teams, "events": events, "compound_categories": compounds}