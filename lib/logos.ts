export const TEAM_LOGOS = [
  { id: "barcelona", name: "FC Barcelona", emoji: "\u26bd", color: "#A50044" },
  { id: "real_madrid", name: "Real Madrid", emoji: "\u{1F451}", color: "#FEBE10" },
  { id: "psg", name: "Paris Saint-Germain", emoji: "\u{1F5FC}", color: "#004170" },
  { id: "manchester_utd", name: "Manchester United", emoji: "\u{1F534}", color: "#DA291C" },
  { id: "liverpool", name: "Liverpool FC", emoji: "\u{1F7E2}", color: "#C8102E" },
  { id: "bayern", name: "Bayern Munich", emoji: "\u{1F3F0}", color: "#DC052D" },
  { id: "juventus", name: "Juventus", emoji: "\u{1F3C6}", color: "#000000" },
  { id: "ac_milan", name: "AC Milan", emoji: "\u2B50", color: "#FB090B" },
  { id: "chelsea", name: "Chelsea FC", emoji: "\u{1F535}", color: "#034694" },
  { id: "arsenal", name: "Arsenal FC", emoji: "\u{1F3AF}", color: "#EF0107" },
  { id: "inter_milan", name: "Inter Milan", emoji: "\u{1F311}", color: "#010E80" },
  { id: "dortmund", name: "Borussia Dortmund", emoji: "\u{1F41D}", color: "#FDE100" },
  { id: "atletico", name: "Atletico Madrid", emoji: "\u{1F525}", color: "#272E61" },
  { id: "man_city", name: "Manchester City", emoji: "\u{1F4A0}", color: "#6CABDD" },
  { id: "napoli", name: "SSC Napoli", emoji: "\u{1F30B}", color: "#12A0D7" },
  { id: "benfica", name: "SL Benfica", emoji: "\u{1F985}", color: "#FF0000" },
];

export function getLogoById(id: string) {
  return TEAM_LOGOS.find((l) => l.id === id);
}
