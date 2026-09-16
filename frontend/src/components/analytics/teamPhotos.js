export const CURATED_TEAMS = [
  { searchKey: "Mercedes", displayName: "Mercedes", filename: "2026mercedescarright.avif", slogan: "All In Performance" },
  { searchKey: "Ferrari", displayName: "Ferrari", filename: "2026ferraricarright.avif", slogan: "Forza Ferrari" },
  { searchKey: "McLaren", displayName: "McLaren", filename: "2026mclarencarright.avif", slogan: "Whatever It Takes" },
  { searchKey: "Red Bull", displayName: "Red Bull Racing", filename: "2026redbullracingcarright.avif", slogan: "Gives You Wings" },
  { searchKey: "Aston Martin", displayName: "Aston Martin", filename: "2026astonmartincarright.avif", slogan: "Hyper-Focus" },
  { searchKey: "Alpine", displayName: "Alpine F1 Team", filename: "2026alpinecarright.avif", slogan: "Allez Les Bleus" },
  { searchKey: "Williams", displayName: "Williams", filename: "2026williamscarright.avif", slogan: "Pure Racing Heritage" },
  { searchKey: "Haas", displayName: "Haas F1 Team", filename: "2026haascarright.avif", slogan: "The American Dreamers" },
  { searchKey: "RB", displayName: "RB F1 Team", filename: "2026racingbullscarright.avif", slogan: "The Fast Lane" },
  { searchKey: "Audi", displayName: "Audi", filename: "2026audicarright.avif", slogan: "Vorsprung durch Technik" },
  { searchKey: "Cadillac", displayName: "Cadillac F1 Team", filename: "2026cadillaccarright.avif", slogan: "Standard of the World" },
];

export function resolveTeamImage(name) {
  const match = CURATED_TEAMS.find((team) => name.toLowerCase().includes(team.searchKey.toLowerCase()));
  return match?.filename ?? "GeneralTeams.png";
}