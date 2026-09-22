export const TEAM_COLORS = {
  "Red Bull": "#3671C6",
  "Red Bull Racing": "#3671C6",
  "Ferrari": "#E8002D",
  "Scuderia Ferrari": "#E8002D",
  "Mercedes": "#00A19C",
  "Mercedes-AMG Petronas": "#00A19C",
  "McLaren": "#FF8000",
  "Aston Martin": "#229971",
  "Alpine": "#0093CC",
  "Alpine F1 Team": "#0093CC",
  "Williams": "#64C4FF",
  "Haas": "#B6BABD",
  "Haas F1 Team": "#B6BABD",
  "Sauber": "#52E252",
  "Kick Sauber": "#52E252",
  "Stake F1 Team": "#52E252",
  "RB": "#6692FF",
  "Racing Bulls": "#6692FF",
  "RB F1 Team": "#6692FF",
  "Visa Cash App RB": "#6692FF",
  "AlphaTauri": "#2B4562",
  "Toro Rosso": "#469BFF",
  "Racing Point": "#F596C8",
  "Alfa Romeo": "#900000",
  "Renault": "#FFF500",
  "Lotus": "#FFB800",
  "Lotus F1": "#FFB800",
  "Brabham": "#00A651",
  "Tyrrell": "#002D62",
  "Benetton": "#00A651",
  "Brawn": "#F3F96F",
};

export function getTeamColor(teamName) {
  if (!teamName || typeof teamName !== "string") return "#5483b3";
  const trimmed = teamName.trim();
  if (TEAM_COLORS[trimmed]) return TEAM_COLORS[trimmed];

  const lower = trimmed.toLowerCase();
  for (const [key, color] of Object.entries(TEAM_COLORS)) {
    if (key.toLowerCase() === lower) return color;
  }
  for (const [key, color] of Object.entries(TEAM_COLORS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return color;
    }
  }
  return "#5483b3";
}

/**
 * Derives card-level styling tokens from a team hex color.
 * Returns a dark tinted background (team color at low opacity) plus accent values.
 */
export function cardThemeFromTeamColor(hexColor) {
  // Parse hex to rgb
  const hex = (hexColor || "#5483b3").replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) || 84;
  const g = parseInt(hex.substring(2, 4), 16) || 131;
  const b = parseInt(hex.substring(4, 6), 16) || 179;

  return {
    // Very dark background tinted by team color — replaces #052659
    cardBg: `rgb(${Math.round(r * 0.12 + 2)}, ${Math.round(g * 0.09 + 6)}, ${Math.round(b * 0.14 + 20)})`,
    // Inner panel background — replaces #021024
    innerBg: `rgb(${Math.round(r * 0.07 + 1)}, ${Math.round(g * 0.05 + 8)}, ${Math.round(b * 0.09 + 14)})`,
    // Accent color at full brightness — for indicator stripes, active borders
    accent: hexColor,
    // Subtle accent at 25% opacity — for card borders
    accentBorder: `rgba(${r}, ${g}, ${b}, 0.28)`,
    // Glow for box-shadow tints
    accentGlow: `rgba(${r}, ${g}, ${b}, 0.18)`,
    // Muted accent for grid lines and textures
    accentMuted: `rgba(${r}, ${g}, ${b}, 0.10)`,
  };
}