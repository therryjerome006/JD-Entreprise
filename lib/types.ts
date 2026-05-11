export type PlayerStatus = "PENDING_USER" | "ACTIVE_USER" | "REJECTED_USER";

export type InscriptionStatus =
  | "PENDING_CHAMPIONSHIP"
  | "APPROVED"
  | "REJECTED";

export type MatchStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export type ChampionshipStatus = "UPCOMING" | "IN_PROGRESS" | "COMPLETED";

export interface Player {
  id: string;
  fullName: string;
  playerId: string;
  phone: string;
  teamName: string;
  teamLogo: string;
  status: PlayerStatus;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  ownerPlayerId: string;
  createdAt: string;
}

export interface Championship {
  id: string;
  name: string;
  status: ChampionshipStatus;
  createdAt: string;
}

export interface ChampionshipInscription {
  id: string;
  championshipId: string;
  playerId: string;
  status: InscriptionStatus;
  createdAt: string;
}

export interface Match {
  id: string;
  championshipId: string;
  teamAId: string;
  teamBId: string;
  scoreA: number | null;
  scoreB: number | null;
  status: MatchStatus;
  matchDay: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  playerId: string;
  message: string;
  type: string;
  read: number;
  createdAt: string;
}

export interface StandingRow {
  teamId: string;
  teamName: string;
  teamLogo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}
