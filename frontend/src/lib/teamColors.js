export const TEAM_COLORS = {
  "Red Bull": "#3671C6", "Ferrari": "#E8002D", "Mercedes": "#27F4D2",
  "McLaren": "#FF8000", "Aston Martin": "#229971", "Alpine": "#FF87BC",
  "Williams": "#64C4FF", "Haas": "#B6BABD", "Haas F1 Team": "#B6BABD", "Sauber": "#52E252",
  "RB": "#6692FF", "Racing Bulls": "#6692FF", "AlphaTauri": "#2B4562",
  "Racing Point": "#F596C8", "Alfa Romeo": "#900000", "Renault": "#FFF500",
  "Lotus": "#FFB800", "Lotus F1": "#FFB800", "Brabham": "#00A651",
  "Tyrrell": "#002D62", "Benetton": "#00A651",
};

export function getTeamColor(teamName) {
  return TEAM_COLORS[teamName] ?? "#5483b3";
}