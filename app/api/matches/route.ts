import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const championshipId = searchParams.get("championshipId");

  const db = getDb();

  let query = `
    SELECT m.*,
           tA.name as teamAName, tA.logo as teamALogo,
           tB.name as teamBName, tB.logo as teamBLogo
    FROM matches m
    JOIN teams tA ON m.teamAId = tA.id
    JOIN teams tB ON m.teamBId = tB.id
  `;
  const queryParams: string[] = [];

  if (championshipId) {
    query += " WHERE m.championshipId = ?";
    queryParams.push(championshipId);
  }

  query += " ORDER BY m.matchDay ASC, m.createdAt ASC";

  const matches = db.prepare(query).all(...queryParams);
  return Response.json(matches);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { championshipId, teamAId, teamBId, matchDay } = body;

  if (!championshipId || !teamAId || !teamBId) {
    return Response.json({ error: "Champs requis" }, { status: 400 });
  }

  const db = getDb();
  const id = randomUUID();

  db.prepare(
    "INSERT INTO matches (id, championshipId, teamAId, teamBId, matchDay) VALUES (?, ?, ?, ?, ?)"
  ).run(id, championshipId, teamAId, teamBId, matchDay || 1);

  const match = db
    .prepare(
      `SELECT m.*,
              tA.name as teamAName, tA.logo as teamALogo,
              tB.name as teamBName, tB.logo as teamBLogo
       FROM matches m
       JOIN teams tA ON m.teamAId = tA.id
       JOIN teams tB ON m.teamBId = tB.id
       WHERE m.id = ?`
    )
    .get(id);

  return Response.json(match, { status: 201 });
}
