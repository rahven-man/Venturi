export const CURATED_DRIVERS = [
  {
    displayName: "Max Verstappen",
    searchKey: "Verstappen",
    filename: "Max-Verstappen.avif",
    slogan: "Simply Lovely",
  },
  {
    displayName: "Lewis Hamilton",
    searchKey: "Hamilton",
    filename: "Lewis-Hamilton.avif",
    slogan: "Still We Rise",
  },
  {
    displayName: "Charles Leclerc",
    searchKey: "Leclerc",
    filename: "Charles-Leclerc.avif",
    slogan: "Il Predestinato",
  },
  {
    displayName: "Lando Norris",
    searchKey: "Norris",
    filename: "Lando-Norris.avif",
    slogan: "Moving Upwards",
  },
  {
    displayName: "Oscar Piastri",
    searchKey: "Piastri",
    filename: "Oscar-Piastri.avif",
    slogan: "No Fuss, Just Fast",
  },
  {
    displayName: "George Russell",
    searchKey: "Russell",
    filename: "George-Russell.avif",
    slogan: "Mr. Consistency",
  },
  {
    displayName: "Kimi Antonelli",
    searchKey: "Antonelli",
    filename: "Kimi-Antonelli.avif",
    slogan: "The Next Generation",
  },
  {
    displayName: "Fernando Alonso",
    searchKey: "Alonso",
    filename: "Fernando-Alonso.avif",
    slogan: "Trust The Plan",
  },
  {
    displayName: "Carlos Sainz",
    searchKey: "Sainz",
    filename: "Carlos-Sainz.avif",
    slogan: "Smooth Operator",
  },
  {
    displayName: "Valtteri Bottas",
    searchKey: "Bottas",
    filename: "Valtteri-Bottas.avif",
    slogan: "To Whom It May Concern",
  },
  {
    displayName: "Sergio Perez",
    searchKey: "Perez",
    filename: "Sergio-Perez.avif",
    slogan: "Minister of Defence",
  },
];

// Resolves any backend driver to a local image: tries the curated
// current-season photo set by surname match, falls back to a single
// generic silhouette for the other ~870 drivers without a saved photo.
// Historical/legend drivers with a saved local photo (flat white/black
// background) - not shown on the base directory page, only resolved
// here for the detail page's hero image.
const LEGACY_DRIVERS = [
  { searchKey: "Schumacher", filename: "Michael-Schumacher.png" },
  { searchKey: "Senna", filename: "Ayrton-Senna.png" },
  { searchKey: "Prost", filename: "Alain-Prost.png" },
  { searchKey: "Vettel", filename: "Sebastian-Vettel.png" },
  { searchKey: "Raikkonen", filename: "Kimi-Raikkonen.png" },
  { searchKey: "Lauda", filename: "Niki-Lauda.png" },
  { searchKey: "Hakkinen", filename: "Mika-Hakkinen.png" },
  { searchKey: "Mansell", filename: "Nigel-Mansell.png" },
  { searchKey: "Button", filename: "Jenson-Button.png" },
  { searchKey: "Rosberg", filename: "Nico-Roseberg.png" },
];

export function resolveDriverImage(fullName) {
  const pool = [...CURATED_DRIVERS, ...LEGACY_DRIVERS];
  const match = pool.find((d) => fullName.toLowerCase().includes(d.searchKey.toLowerCase()));
  return match ? match.filename : "GeneralDriver.png";
}