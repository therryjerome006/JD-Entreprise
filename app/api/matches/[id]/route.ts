import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { scoreA, scoreB } = body;

  if (scoreA === undefined || scoreB === undefined) {
    return Response.json({ error: "Scores requis" }, { status: 400 });
  }

  const db = getDb();

  db.prepare(
    "UPDATE matches SET scoreA = ?, scoreB = ?, status = 'COMPLETED' WHERE id = ?"
  ).run(scoreA, scoreB, id);

  const match = db
    .prepare(
      `SELECT m.*,
              tA.name as teamAName, tA.logo as teamALogo,
              tA.ownerPlayerId as playerAId,
              tB.name as teamBName, tB.logo as teamBLogo,
              tB.ownerPlayerId as playerBId
       FROM matches m
       JOIN teams tA ON m.teamAId = tA.id
       JOIN teams tB ON m.teamBId = tB.id
       WHERE m.id = ?`
    )
    .get(id) as {
    teamAName: string;
    teamBName: string;
    playerAId: string;
    playerBId: string;
  } | undefined;

  if (match) {
    const msg = `Résultat : ${match.teamAName} ${scoreA} - ${scoreB} ${match.teamBName}`;
    const insertNotif = db.prepare(
      "INSERT INTO notifications (id, playerId, message, type) VALUES (?, ?, ?, ?)"
    );
    insertNotif.run(randomUUID(), match.playerAId, msg, "MATCH_RESULT");
    insertNotif.run(randomUUID(), match.playerBId, msg, "MATCH_RESULT");
  }

  const updated = db
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

  return Response.json(updated);
}
