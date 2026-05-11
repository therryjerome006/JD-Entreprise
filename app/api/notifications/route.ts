import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get("playerId");

  if (!playerId) {
    return Response.json({ error: "playerId requis" }, { status: 400 });
  }

  const db = getDb();
  const notifications = db
    .prepare(
      "SELECT * FROM notifications WHERE playerId = ? ORDER BY createdAt DESC"
    )
    .all(playerId);

  return Response.json(notifications);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { playerId } = body;

  if (!playerId) {
    return Response.json({ error: "playerId requis" }, { status: 400 });
  }

  const db = getDb();
  db.prepare("UPDATE notifications SET read = 1 WHERE playerId = ?").run(playerId);
  return Response.json({ success: true });
}
