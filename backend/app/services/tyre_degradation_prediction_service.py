import numpy as np
import pandas as pd
from app.db import get_connection
from app.ml.tyre_degradation_model import load_tyre_deg_artifacts

DRY_COMPOUNDS = {"HARD", "MEDIUM", "SOFT"}


def _get_total_laps_est(con, event_name):
    result = con.execute(f"""
        SELECT MAX(LapNumber) FROM fastf1
        WHERE EventName = '{event_name}' AND SessionName = 'Race'
    """).fetchone()
    return int(result[0]) if result and result[0] else 60


def _get_circuit_avg_weather(con, event_name):
    result = con.execute(f"""
        SELECT AVG(AirTemp), AVG(Humidity), AVG(Pressure), AVG(Rainfall),
               AVG(TrackTemp), AVG(WindDirection), AVG(WindSpeed)
        FROM fastf1
        WHERE EventName = '{event_name}' AND SessionName = 'Race'
    """).fetchone()
    keys = ["AirTemp", "Humidity", "Pressure", "Rainfall", "TrackTemp", "WindDirection", "WindSpeed"]
    return {k: (float(v) if v is not None else 0.0) for k, v in zip(keys, result)}


def _get_driver_pace(con, driver, event_name):
    result = con.execute(f"""
        SELECT AVG(LapTime_seconds), MIN(LapTime_seconds)
        FROM fastf1
        WHERE Driver = '{driver}' AND EventName = '{event_name}' AND SessionName = 'Race'
          AND status_green = true AND status_safety_car = false AND status_vsc = false
          AND status_yellow = false AND PitOutTime IS NULL AND LapTime_seconds IS NOT NULL
    """).fetchone()
    if result[0] is None:
        result = con.execute(f"""
            SELECT AVG(LapTime_seconds), MIN(LapTime_seconds)
            FROM fastf1
            WHERE Driver = '{driver}' AND SessionName = 'Race'
              AND status_green = true AND status_safety_car = false AND status_vsc = false
              AND status_yellow = false AND PitOutTime IS NULL AND LapTime_seconds IS NOT NULL
        """).fetchone()
    avg_pace = float(result[0]) if result[0] is not None else 90.0
    best_lap = float(result[1]) if result[1] is not None else avg_pace
    return avg_pace, best_lap


def predict_tyre_degradation(payload: dict):
    model, feature_cols, encoders = load_tyre_deg_artifacts()
    con = get_connection()

    compound = payload["compound"].upper()
    if compound not in DRY_COMPOUNDS:
        raise ValueError(f"Ye model sirf dry compounds (HARD/MEDIUM/SOFT) ke liye hai, '{compound}' nahi")

    driver = payload["driver"]
    team = payload["team"]
    event_name = payload["event_name"]
    lap_number = payload["lap_number"]
    stint = payload["stint"]
    tyre_life = payload["tyre_life"]
    grid_position = payload["grid_position"]

    total_laps_est = _get_total_laps_est(con, event_name)
    weather_avg = _get_circuit_avg_weather(con, event_name)

    air_temp = payload.get("air_temp") if payload.get("air_temp") is not None else weather_avg["AirTemp"]
    humidity = payload.get("humidity") if payload.get("humidity") is not None else weather_avg["Humidity"]
    pressure = payload.get("pressure") if payload.get("pressure") is not None else weather_avg["Pressure"]
    rainfall = payload.get("rainfall") if payload.get("rainfall") is not None else weather_avg["Rainfall"]
    track_temp = payload.get("track_temp") if payload.get("track_temp") is not None else weather_avg["TrackTemp"]
    wind_direction = payload.get("wind_direction") if payload.get("wind_direction") is not None else weather_avg["WindDirection"]
    wind_speed = payload.get("wind_speed") if payload.get("wind_speed") is not None else weather_avg["WindSpeed"]

    avg_pace, best_lap = _get_driver_pace(con, driver, event_name)
    last_lap = payload.get("last_lap_time")
    driver_prev_lap_time = last_lap if (last_lap is not None and last_lap > 0) else avg_pace
    driver_rolling_median_3 = driver_prev_lap_time
    driver_best_lap_so_far = min(best_lap, driver_prev_lap_time)
    driver_pace_index = driver_prev_lap_time - driver_best_lap_so_far  # is model me DIFFERENCE hai, ratio nahi (lap time model se alag)

    position_prev_lap = payload.get("current_position") if payload.get("current_position") is not None else grid_position
    grid_delta = grid_position - position_prev_lap  # is model ka sign convention lap-time-model se ulta hai

    is_sc = payload.get("is_safety_car_active", False)
    is_vsc = payload.get("is_vsc_active", False)
    is_yellow = payload.get("is_yellow_flag", False)

    laps_since_green_resumed = payload.get("laps_since_green_resumed")
    if laps_since_green_resumed is None:
        laps_since_green_resumed = 0 if (is_sc or is_vsc) else 10  # 10 = fully recovered (notebook ka clip cap)
    laps_since_green_resumed = max(0, min(10, laps_since_green_resumed))
    sc_recovery_decay = max(0.0, min(1.0, 1 - laps_since_green_resumed / 10))
    is_restart_lap = (laps_since_green_resumed == 1)

    stint_lap_number = tyre_life + 1
    tyrelife_squared = tyre_life ** 2

    cumulative_green_laps = max(lap_number - 1, 0)
    race_progress_pct = lap_number / total_laps_est
    fuel_load_pct = (total_laps_est - lap_number) / total_laps_est
    fuel_load_proxy = total_laps_est - lap_number

    is_warmup_phase = stint_lap_number <= 3
    warmup_laps_remaining = max(0, min(3, 3 - stint_lap_number))
    if stint_lap_number <= 3:
        phase = "warmup"
    elif stint_lap_number <= 10:
        phase = "early"
    elif stint_lap_number <= 20:
        phase = "mid"
    else:
        phase = "late"

    row = {
        "TyreLife": tyre_life, "tyrelife_squared": tyrelife_squared,
        "tyrelife_sqrt": np.sqrt(tyre_life), "tyrelife_log1p": np.log1p(tyre_life),
        "stint_lap_number": stint_lap_number,
        "is_warmup_phase": is_warmup_phase, "warmup_laps_remaining": warmup_laps_remaining,
        "phase_warmup": phase == "warmup", "phase_early": phase == "early",
        "phase_mid": phase == "mid", "phase_late": phase == "late",
        "laps_since_green_resumed": laps_since_green_resumed,
        "sc_recovery_decay": sc_recovery_decay, "is_restart_lap": is_restart_lap,
        "AirTemp": air_temp, "Humidity": humidity, "Pressure": pressure, "Rainfall": rainfall,
        "TrackTemp": track_temp, "WindDirection": wind_direction, "WindSpeed": wind_speed,
        "track_temp_minus_airtemp": track_temp - air_temp,
        "fuel_load_proxy": fuel_load_proxy, "fuel_load_pct": fuel_load_pct,
        "race_progress_pct": race_progress_pct,
        "cumulative_green_laps": cumulative_green_laps, "green_laps_sqrt": np.sqrt(cumulative_green_laps),
        "driver_prev_lap_time": driver_prev_lap_time,
        "driver_rolling_median_3": driver_rolling_median_3,
        "driver_best_lap_so_far": driver_best_lap_so_far,
        "driver_pace_index": driver_pace_index,
        "position_prev_lap": position_prev_lap, "grid_delta": grid_delta,
        "is_race_leader": position_prev_lap == 1,
        "laps_since_sc_started": payload.get("laps_since_sc_started", 0),
        "laps_since_vsc_started": payload.get("laps_since_vsc_started", 0),
        "sc_deployment_count": payload.get("sc_deployment_count", 0),
        "prevstatus_green": not (is_sc or is_vsc or is_yellow),
        "prevstatus_yellow": is_yellow, "prevstatus_safety_car": is_sc,
        "prevstatus_vsc": is_vsc, "prevstatus_vsc_ending": False,
    }

    for c in ["HARD", "MEDIUM", "SOFT"]:
        is_this = (compound == c)
        row[f"compound_{c}"] = is_this
        row[f"compound_{c}_x_tyrelife"] = tyre_life if is_this else 0.0
        row[f"compound_{c}_x_tracktemp"] = track_temp if is_this else 0.0
        row[f"{c}_x_stint_lap"] = stint_lap_number if is_this else 0.0
        row[f"{c}_x_stint_lap_sq"] = tyrelife_squared if is_this else 0.0  # notebook: tyrelife_squared use hua hai, stint_lap ka square nahi

    row["Driver_encoded"] = encoders["Driver"].transform([driver])[0]
    row["Team_encoded"] = encoders["Team"].transform([team])[0]
    row["EventName_encoded"] = encoders["EventName"].transform([event_name])[0]

    X = pd.DataFrame([[row[col] for col in feature_cols]], columns=feature_cols)
    predicted_delta = float(model.predict(X)[0])

    return {
        "predicted_laptime_delta_seconds": round(predicted_delta, 3),
        "interpretation": "Seconds slower (positive) or faster (negative) than this stint's baseline pace (best of first 3 clean laps), attributable to tyre degradation.",
        "assumptions_used": {
            "total_laps_estimated": total_laps_est,
            "weather_source": "user_provided" if payload.get("air_temp") is not None else "circuit_historical_average",
            "driver_pace_source": "user_provided" if last_lap else "driver_historical_average_at_circuit",
        }
    }


def get_valid_options():
    _, _, encoders = load_tyre_deg_artifacts()
    return {
        "drivers": sorted(encoders["Driver"].classes_.tolist()),
        "teams": sorted(encoders["Team"].classes_.tolist()),
        "compounds": ["HARD", "MEDIUM", "SOFT"],
        "events": sorted(encoders["EventName"].classes_.tolist()),
    }