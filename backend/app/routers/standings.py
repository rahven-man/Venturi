from fastapi import APIRouter
from app.services import standings_service

router = APIRouter(prefix="/standings", tags=["Standings"])

@router.get("/seasons")
def available_seasons():
    return standings_service.get_available_seasons()

@router.get("/drivers")
def driver_standings(year: int):
    return standings_service.get_driver_standings(year)

@router.get("/constructors")
def constructor_standings(year: int):
    return standings_service.get_constructor_standings(year)