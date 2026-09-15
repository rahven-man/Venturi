// Base URL of our FastAPI backend
// This stays in one place so if the backend URL ever changes,
// we only update it here instead of every component
const API_BASE_URL = "http://127.0.0.1:8000";

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
// We will keep adding more functions here as we build each page
// (season-stats, career-stats, teams, circuits, standings, predictions, etc.)