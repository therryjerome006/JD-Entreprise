import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const teams = db
    .prepare(
      `SELECT t.*, p.fullName as ownerName, p.status as ownerStatus
       FROM teams t
       JOIN players p ON t.ownerPlayerId = p.id
       ORDER BY t.createdAt DESC`
    )
    .all();
  return Response.json(teams);
}
