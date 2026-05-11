import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  const db = getDb();
  const championships = db
    .prepare("SELECT * FROM championships ORDER BY createdAt DESC")
    .all();
  return Response.json(championships);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name } = body;

  if (!name) {
    return Response.json({ error: "Nom du championnat requis" }, { status: 400 });
  }

  const db = getDb();
  const id = randomUUID();

  db.prepare("INSERT INTO championships (id, name) VALUES (?, ?)").run(id, name);

  const activePlayers = db
    .prepare("SELECT id, fullName FROM players WHERE status = 'ACTIVE_USER'")
    .all() as Array<{ id: string; fullName: string }>;

  const insertNotif = db.prepare(
    "INSERT INTO notifications (id, playerId, message, type) VALUES (?, ?, ?, ?)"
  );

  for (const player of activePlayers) {
    insertNotif.run(
      randomUUID(),
      player.id,
      `Nouveau championnat disponible : "${name}". Inscrivez-vous maintenant !`,
      "NEW_CHAMPIONSHIP"
    );
  }

  const championship = db.prepare("SELECT * FROM championships WHERE id = ?").get(id);
  return Response.json(championship, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return Response.json({ error: "ID et statut requis" }, { status: 400 });
  }

  const db = getDb();
  db.prepare("UPDATE championships SET status = ? WHERE id = ?").run(status, id);
  const updated = db.prepare("SELECT * FROM championships WHERE id = ?").get(id);
  return Response.json(updated);
}
