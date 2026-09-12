from fastapi import APIRouter, HTTPException
from app.services import circuit_service

router = APIRouter(prefix="/circuits", tags=["Circuits"])

@router.get("")
def list_circuits(active_only: bool = True, search: str = None):
    return circuit_service.get_circuits_list(active_only=active_only, search=search)

@router.get("/{circuit_id}/profile")
def circuit_profile(circuit_id: int):
    profile = circuit_service.get_circuit_profile(circuit_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Circuit not found")
    return profile

@router.get("/{circuit_id}/lap-record")
def circuit_lap_record(circuit_id: int):
    return circuit_service.get_circuit_lap_record(circuit_id)

@router.get("/{circuit_id}/winners")
def circuit_winners(circuit_id: int, limit: int = 10):
    return circuit_service.get_circuit_winners(circuit_id, limit=limit)

@router.get("/{circuit_id}/all-time-stats")
def circuit_all_time_stats(circuit_id: int):
    return circuit_service.get_circuit_all_time_stats(circuit_id)