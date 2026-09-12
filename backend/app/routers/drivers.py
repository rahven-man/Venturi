from fastapi import APIRouter, HTTPException
from app.services import driver_service

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.get("")
def list_drivers(active_only: bool = True, search: str = None):
    return driver_service.get_drivers_list(active_only=active_only, search=search)

@router.get("/{driver_id}/profile")
def driver_profile(driver_id: int):
    profile = driver_service.get_driver_profile(driver_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Driver not found")
    return profile

@router.get("/{driver_id}/season-stats")
def driver_season_stats(driver_id: int, year: int):
    return driver_service.get_driver_season_stats(driver_id, year)

@router.get("/{driver_id}/career-stats")
def driver_career_stats(driver_id: int):
    return driver_service.get_driver_career_stats(driver_id)

@router.get("/{driver_id}/season-trend")
def driver_season_trend(driver_id: int):
    return driver_service.get_driver_season_trend(driver_id)

@router.get("/{driver_id}/dna-radar")
def driver_dna_radar(driver_id: int, year: int = None):
    return driver_service.get_driver_dna_radar(driver_id, year)

@router.get("/{driver_id}/career-matrix")
def driver_career_matrix(driver_id: int):
    return driver_service.get_driver_career_matrix(driver_id)