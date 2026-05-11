import { getDb } from "@/lib/db";
import type { StandingRow } from "@/lib/types";

interface MatchRow {
  teamAId: string;
  teamBId: string;
  scoreA: number;
  scoreB: number;
}

interface TeamRow {
  id: string;
  name: string;
  logo: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ championshipId: string }> }
) {
  const { championshipId } = await params;
  const db = getDb();

  const completedMatches = db
    .prepare(
      "SELECT teamAId, teamBId, scoreA, scoreB FROM matches WHERE championshipId = ? AND status = 'COMPLETED'"
    )
    .all(championshipId) as MatchRow[];

  const approvedInscriptions = db
    .prepare(
      `SELECT t.id, t.name, t.logo
       FROM championship_inscriptions ci
       JOIN teams t ON t.ownerPlayerId = ci.playerId
       WHERE ci.championshipId = ? AND ci.status = 'APPROVED'`
    )
    .all(championshipId) as TeamRow[];

  const standingsMap = new Map<string, StandingRow>();

  for (const team of approvedInscriptions) {
    standingsMap.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      teamLogo: team.logo,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  }

  for (const match of completedMatches) {
    const teamA = standingsMap.get(match.teamAId);
    const teamB = standingsMap.get(match.teamBId);

    if (teamA) {
      teamA.played++;
      teamA.goalsFor += match.scoreA;
      teamA.goalsAgainst += match.scoreB;
      if (match.scoreA > match.scoreB) {
        teamA.won++;
        teamA.points += 3;
      } else if (match.scoreA === match.scoreB) {
        teamA.drawn++;
        teamA.points += 1;
      } else {
        teamA.lost++;
      }
      teamA.goalDifference = teamA.goalsFor - teamA.goalsAgainst;
    }

    if (teamB) {
      teamB.played++;
      teamB.goalsFor += match.scoreB;
      teamB.goalsAgainst += match.scoreA;
      if (match.scoreB > match.scoreA) {
        teamB.won++;
        teamB.points += 3;
      } else if (match.scoreA === match.scoreB) {
        teamB.drawn++;
        teamB.points += 1;
      } else {
        teamB.lost++;
      }
      teamB.goalDifference = teamB.goalsFor - teamB.goalsAgainst;
    }
  }

  const standings = Array.from(standingsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference)
      return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return Response.json(standings);
}
