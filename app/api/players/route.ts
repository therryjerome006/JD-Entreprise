import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  const db = getDb();
  const players = db.prepare("SELECT * FROM players ORDER BY createdAt DESC").all();
  return Response.json(players);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { fullName, playerId, phone, teamName, teamLogo } = body;

  if (!fullName || !playerId || !phone || !teamName || !teamLogo) {
    return Response.json({ error: "Tous les champs sont obligatoires" }, { status: 400 });
  }

  const db = getDb();

  const existing = db.prepare("SELECT id FROM players WHERE playerId = ?").get(playerId);
  if (existing) {
    return Response.json({ error: "Cet ID joueur existe déjà" }, { status: 409 });
  }

  const id = randomUUID();
  const teamId = randomUUID();

  const insertPlayer = db.prepare(
    "INSERT INTO players (id, fullName, playerId, phone, teamName, teamLogo) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const insertTeam = db.prepare(
    "INSERT INTO teams (id, name, logo, ownerPlayerId) VALUES (?, ?, ?, ?)"
  );

  const transaction = db.transaction(() => {
    insertPlayer.run(id, fullName, playerId, phone, teamName, teamLogo);
    insertTeam.run(teamId, teamName, teamLogo, id);
  });

  transaction();

  const player = db.prepare("SELECT * FROM players WHERE id = ?").get(id);
  return Response.json(player, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return Response.json({ error: "ID et statut requis" }, { status: 400 });
  }

  if (!["ACTIVE_USER", "REJECTED_USER"].includes(status)) {
    return Response.json({ error: "Statut invalide" }, { status: 400 });
  }

  const db = getDb();
  const player = db.prepare("SELECT * FROM players WHERE id = ?").get(id) as { id: string; fullName: string; playerId: string } | undefined;
  if (!player) {
    return Response.json({ error: "Joueur non trouvé" }, { status: 404 });
  }

  db.prepare("UPDATE players SET status = ? WHERE id = ?").run(status, id);

  const notifId = randomUUID();
  const message =
    status === "ACTIVE_USER"
      ? `Félicitations ${player.fullName} ! Votre inscription a été validée.`
      : `Désolé ${player.fullName}, votre inscription a été refusée.`;

  db.prepare(
    "INSERT INTO notifications (id, playerId, message, type) VALUES (?, ?, ?, ?)"
  ).run(notifId, id, message, "PLAYER_VALIDATION");

  const updated = db.prepare("SELECT * FROM players WHERE id = ?").get(id);
  return Response.json(updated);
}
