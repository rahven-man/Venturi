from pydantic import BaseModel
from typing import Optional

class LapTimePredictionInput(BaseModel):
    driver: str
    team: str
    event_name: str
    compound: str
    lap_number: int
    stint: int
    tyre_life: int
    fresh_tyre: bool
    grid_position: int
    season: int = 2026

    # optional - agar nahi diya to backend auto-fill karega
    air_temp: Optional[float] = None
    track_temp: Optional[float] = None
    humidity: Optional[float] = None
    pressure: Optional[float] = None
    rainfall: Optional[float] = None
    wind_speed: Optional[float] = None
    wind_direction: Optional[float] = None
    current_position: Optional[int] = None
    last_lap_time: Optional[float] = None

    is_safety_car_active: bool = False
    is_vsc_active: bool = False
    is_restart_lap: bool = False
    laps_since_sc_started: int = 0
    laps_since_vsc_started: int = 0
    sc_deployment_count: int = 0


class PitStopPredictionInput(BaseModel):
    driver: str
    team: str
    event_name: str
    compound_category: str  # HARD/MEDIUM/SOFT/INTERMEDIATE/WET/UNKNOWN
    lap_number: int
    stint: int
    tyre_life: int
    fresh_tyre: bool
    grid_position: int

    current_position: Optional[int] = None
    last_lap_time: Optional[float] = None

    pressure: Optional[float] = None
    wind_speed: Optional[float] = None
    wind_direction: Optional[float] = None
    prev_lap_rainfall: Optional[float] = None
    prev_lap_airtemp: Optional[float] = None
    prev_lap_tracktemp: Optional[float] = None
    prev_lap_humidity: Optional[float] = None

    is_safety_car_active: bool = False
    is_vsc_active: bool = False
    is_yellow_flag: bool = False
    is_restart_lap: bool = False
    is_out_lap: bool = False
    laps_since_restart: Optional[int] = None
    is_rain_increasing: bool = False
    leader_pitted_this_lap: bool = False
    leader_pitted_prev_lap: bool = False
    car_ahead_pitted_this_lap: bool = False
    car_ahead_pitted_prev_lap: bool = False
    position_two_laps_ago: Optional[int] = None

class TyreDegradationPredictionInput(BaseModel):
    driver: str
    team: str
    event_name: str
    compound: str  # sirf HARD/MEDIUM/SOFT - ye model dry-only hai
    lap_number: int
    stint: int
    tyre_life: int
    grid_position: int

    current_position: Optional[int] = None
    last_lap_time: Optional[float] = None

    air_temp: Optional[float] = None
    track_temp: Optional[float] = None
    humidity: Optional[float] = None
    pressure: Optional[float] = None
    rainfall: Optional[float] = None
    wind_speed: Optional[float] = None
    wind_direction: Optional[float] = None

    is_safety_car_active: bool = False
    is_vsc_active: bool = False
    is_yellow_flag: bool = False
    laps_since_green_resumed: Optional[int] = None
    laps_since_sc_started: int = 0
    laps_since_vsc_started: int = 0
    sc_deployment_count: int = 0