import numpy as np
import pandas as pd
from app.db import get_connection
from app.ml.lap_time_model import load_lap_time_artifacts


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
    return {k: (v if v is not None else 0.0) for k, v in zip(keys, result)}


def _get_driver_pace(con, driver, event_name):
    # is circuit pe driver ka clean-lap pace (SC/VSC/red-flag/out-lap excluded, jaisa notebook 07 me tha)
    result = con.execute(f"""
        SELECT AVG(LapTime_seconds), MIN(LapTime_seconds)
        FROM fastf1
        WHERE Driver = '{driver}' AND EventName = '{event_name}' AND SessionName = 'Race'
          AND status_green = true AND status_red_flag = false AND PitOutTime IS NULL
          AND LapTime_seconds IS NOT NULL
    """).fetchone()

    if result[0] is None:
        
        result = con.execute(f"""
            SELECT AVG(LapTime_seconds), MIN(LapTime_seconds)
            FROM fastf1
            WHERE Driver = '{driver}' AND SessionName = 'Race'
              AND status_green = true AND status_red_flag = false AND PitOutTime IS NULL
              AND LapTime_seconds IS NOT NULL
        """).fetchone()

    avg_pace = float(result[0]) if result[0] is not None else 90.0
    best_lap = float(result[1]) if result[1] is not None else avg_pace
    return avg_pace, best_lap


def predict_lap_time(payload: dict):
    model, feature_cols, encoders = load_lap_time_artifacts()
    con = get_connection()

    driver = payload["driver"]
    team = payload["team"]
    event_name = payload["event_name"]
    compound = payload["compound"].upper()
    lap_number = payload["lap_number"]
    stint = payload["stint"]
    tyre_life = payload["tyre_life"]
    fresh_tyre = payload["fresh_tyre"]
    grid_position = payload["grid_position"]
    season = payload.get("season", 2026)

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
    driver_pace_index = driver_rolling_median_3 / driver_best_lap_so_far

    position_prev_lap = payload.get("current_position") if payload.get("current_position") is not None else grid_position

    is_sc = payload.get("is_safety_car_active", False)
    is_vsc = payload.get("is_vsc_active", False)
    is_restart = payload.get("is_restart_lap", False)

    # NOTE: single-shot "what-if" prediction hai, poori race ki lap-by-lap SC history nahi hai
    # isliye ye approximation hai (jaisa notebook me bhi "documented limitation" approach follow hua)
    cumulative_green_laps = max(lap_number - 1, 0)

    race_progress_pct = lap_number / total_laps_est
    fuel_load_pct = (total_laps_est - lap_number + 1) / total_laps_est
    fuel_load_proxy = total_laps_est - lap_number + 1

    row = {
        "LapNumber": lap_number, "Stint": stint, "TyreLife": tyre_life,
        "FreshTyre": fresh_tyre, "tyrelife_squared": tyre_life ** 2,
        "GridPosition": grid_position, "AirTemp": air_temp, "Humidity": humidity,
        "Pressure": pressure, "Rainfall": rainfall, "TrackTemp": track_temp,
        "WindDirection": wind_direction, "WindSpeed": wind_speed, "Season": season,
        "is_out_lap": False, "fuel_load_proxy": fuel_load_proxy,
        "track_evolution_proxy": lap_number,
        "prevstatus_green": not (is_sc or is_vsc), "prevstatus_yellow": False,
        "prevstatus_safety_car": is_sc, "prevstatus_red_flag": False,
        "prevstatus_vsc": is_vsc, "prevstatus_vsc_ending": False, "prevstatus_unknown": False,
        "stint_lap_number": tyre_life + 1,
        "tyrelife_sqrt": np.sqrt(tyre_life), "tyrelife_log1p": np.log1p(tyre_life),
        "cumulative_green_laps": cumulative_green_laps,
        "green_laps_sqrt": np.sqrt(cumulative_green_laps),
        "is_first_green_after_sc": is_restart and not (is_sc or is_vsc),
        "driver_prev_lap_time": driver_prev_lap_time,
        "driver_rolling_median_3": driver_rolling_median_3,
        "driver_best_lap_so_far": driver_best_lap_so_far,
        "driver_pace_index": driver_pace_index,
        "position_prev_lap": position_prev_lap,
        "grid_delta": position_prev_lap - grid_position,
        "is_race_leader": position_prev_lap == 1,
        "race_progress_pct": race_progress_pct, "fuel_load_pct": fuel_load_pct,
        "rainfall_accumulated": rainfall * lap_number,
        "track_temp_minus_airtemp": track_temp - air_temp,
        "stint_x_tyrelife": stint * tyre_life,
        "gridpos_x_progress": grid_position * race_progress_pct,
        "airtemp_x_tracktemp": air_temp * track_temp,
        "laps_since_sc_started": payload.get("laps_since_sc_started", 0),
        "laps_since_vsc_started": payload.get("laps_since_vsc_started", 0),
        "sc_deployment_count": payload.get("sc_deployment_count", 0),
    }

    compound_options = ["HARD", "INTERMEDIATE", "MEDIUM", "SOFT", "UNKNOWN", "WET"]
    for c in compound_options:
        is_this = (compound == c)
        row[f"compound_{c}"] = is_this
        row[f"compound_{c}_x_tyrelife"] = tyre_life if is_this else 0.0
        row[f"compound_{c}_x_tracktemp"] = track_temp if is_this else 0.0

    
    row["Driver_enc"] = encoders["Driver"].transform([driver])[0]
    row["Team_enc"] = encoders["Team"].transform([team])[0]
    row["Compound_category_enc"] = encoders["Compound_category"].transform([compound])[0]
    row["EventName_enc"] = encoders["EventName"].transform([event_name])[0]

    X = pd.DataFrame([[row[col] for col in feature_cols]], columns=feature_cols)
    predicted = float(model.predict(X)[0])

    return {
        "predicted_lap_time_seconds": round(predicted, 3),
        "assumptions_used": {
            "total_laps_estimated": total_laps_est,
            "weather_source": "user_provided" if payload.get("air_temp") is not None else "circuit_historical_average",
            "driver_pace_source": "user_provided_last_lap" if payload.get("last_lap_time") is not None else "driver_historical_average_at_circuit",
        }
    }


def get_valid_options():
    _, _, encoders = load_lap_time_artifacts()
    return {
        "drivers": sorted(encoders["Driver"].classes_.tolist()),
        "teams": sorted(encoders["Team"].classes_.tolist()),
        "compounds": sorted(encoders["Compound_category"].classes_.tolist()),
        "events": sorted(encoders["EventName"].classes_.tolist()),
    }