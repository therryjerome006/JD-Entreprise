import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";

interface TeamRow {
  id: string;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { championshipId } = body;

  if (!championshipId) {
    return Response.json({ error: "championshipId requis" }, { status: 400 });
  }

  const db = getDb();

  const teams = db
    .prepare(
      `SELECT t.id
       FROM championship_inscriptions ci
       JOIN teams t ON t.ownerPlayerId = ci.playerId
       WHERE ci.championshipId = ? AND ci.status = 'APPROVED'`
    )
    .all(championshipId) as TeamRow[];

  if (teams.length < 2) {
    return Response.json(
      { error: "Il faut au moins 2 équipes approuvées" },
      { status: 400 }
    );
  }

  const existingMatches = db
    .prepare("SELECT id FROM matches WHERE championshipId = ?")
    .all(championshipId);

  if (existingMatches.length > 0) {
    return Response.json(
      { error: "Les matchs ont déjà été générés pour ce championnat" },
      { status: 409 }
    );
  }

  const insertMatch = db.prepare(
    "INSERT INTO matches (id, championshipId, teamAId, teamBId, matchDay) VALUES (?, ?, ?, ?, ?)"
  );

  let matchDay = 1;
  const transaction = db.transaction(() => {
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        insertMatch.run(
          randomUUID(),
          championshipId,
          teams[i].id,
          teams[j].id,
          matchDay
        );
        matchDay++;
      }
    }
  });

  transaction();

  db.prepare("UPDATE championships SET status = 'IN_PROGRESS' WHERE id = ?").run(
    championshipId
  );

  const matches = db
    .prepare(
      `SELECT m.*,
              tA.name as teamAName, tA.logo as teamALogo,
              tB.name as teamBName, tB.logo as teamBLogo
       FROM matches m
       JOIN teams tA ON m.teamAId = tA.id
       JOIN teams tB ON m.teamBId = tB.id
       WHERE m.championshipId = ?
       ORDER BY m.matchDay ASC`
    )
    .all(championshipId);

  return Response.json(matches, { status: 201 });
}
