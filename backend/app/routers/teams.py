from fastapi import APIRouter, HTTPException
from app.services import team_service

router = APIRouter(prefix="/teams", tags=["Teams"])

@router.get("")
def list_teams(active_only: bool = True, search: str = None):
    return team_service.get_teams_list(active_only=active_only, search=search)

@router.get("/{team_id}/profile")
def team_profile(team_id: int):
    profile = team_service.get_team_profile(team_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Team not found")
    return profile

@router.get("/{team_id}/season-stats")
def team_season_stats(team_id: int, year: int):
    return team_service.get_team_season_stats(team_id, year)

@router.get("/{team_id}/career-stats")
def team_career_stats(team_id: int):
    return team_service.get_team_career_stats(team_id)

@router.get("/{team_id}/season-trend")
def team_season_trend(team_id: int):
    return team_service.get_team_season_trend(team_id)