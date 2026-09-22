// Base URL of our FastAPI backend.
// Locally: falls back to 127.0.0.1:8000 automatically.
// Production (Vercel): set NEXT_PUBLIC_API_URL in the Vercel dashboard to your Render URL.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Generic function to call any GET endpoint on our backend
// Every other function in this file will use this one internally
async function apiGet(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API call failed: ${endpoint} (status ${response.status})`);
  }

  return response.json();
}

// Generic function to call any POST endpoint (used for the 3 ML prediction models)
async function apiPost(endpoint, body) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${endpoint} (status ${response.status})`);
  }

  return response.json();
}

// ---- Drivers ----

export function getDrivers(activeOnly = true) {
  return apiGet(`/drivers?active_only=${activeOnly}`);
}

export function getDriverProfile(driverId) {
  return apiGet(`/drivers/${driverId}/profile`);
}


export function getDriverSeasonStats(driverId, year) {
  return apiGet(`/drivers/${driverId}/season-stats?year=${year}`);
}

export function getDriverCareerStats(driverId) {
  return apiGet(`/drivers/${driverId}/career-stats`);
}

export function getDriverSeasonTrend(driverId) {
  return apiGet(`/drivers/${driverId}/season-trend`);
}

export function getDriverDnaRadar(driverId, year = null) {
  const query = year ? `?year=${year}` : "";
  return apiGet(`/drivers/${driverId}/dna-radar${query}`);
}

export function getDriverCareerMatrix(driverId) {
  return apiGet(`/drivers/${driverId}/career-matrix`);
}

// ---- Teams ----

export function getTeams(activeOnly = true) {
  return apiGet(`/teams?active_only=${activeOnly}`);
}

export function getTeamProfile(teamId) {
  return apiGet(`/teams/${teamId}/profile`);
}

export function getTeamSeasonStats(teamId, year) {
  return apiGet(`/teams/${teamId}/season-stats?year=${year}`);
}

export function getTeamCareerStats(teamId) {
  return apiGet(`/teams/${teamId}/career-stats`);
}

export function getTeamSeasonTrend(teamId) {
  return apiGet(`/teams/${teamId}/season-trend`);
}

// ---- Lap Time Model ----

export function getLapTimeOptions() {
  return apiGet("/predictions/lap-time/options");
}

export function predictLapTime(payload) {
  return apiPost("/predictions/lap-time", payload);
}
// We will keep adding more functions here as we build each page
// (season-stats, career-stats, teams, circuits, standings, predictions, etc.)

// ---- Pit Stop Model ----
export function getPitStopOptions() { return apiGet("/predictions/pit-stop/options"); }
export function predictPitStop(payload) { return apiPost("/predictions/pit-stop", payload); }

// ---- Tyre Degradation Model ----
export function getTyreDegradationOptions() { return apiGet("/predictions/tyre-degradation/options"); }
export function predictTyreDegradation(payload) { return apiPost("/predictions/tyre-degradation", payload); }

// ---- Circuits ----
export function getCircuits(activeOnly = true, search = null) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  else params.set("active_only", activeOnly);
  return apiGet(`/circuits?${params.toString()}`);
}
export function getCircuitProfile(circuitId) { return apiGet(`/circuits/${circuitId}/profile`); }
export function getCircuitLapRecord(circuitId) { return apiGet(`/circuits/${circuitId}/lap-record`); }
export function getCircuitWinners(circuitId, limit = 15) { return apiGet(`/circuits/${circuitId}/winners?limit=${limit}`); }
export function getCircuitAllTimeStats(circuitId) { return apiGet(`/circuits/${circuitId}/all-time-stats`); }

// ---- Championship Standings ----
export function getStandingsSeasons() { return apiGet("/standings/seasons"); }
export function getDriverStandings(year) { return apiGet(`/standings/drivers?year=${year}`); }
export function getConstructorStandings(year) { return apiGet(`/standings/constructors?year=${year}`); }