import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const inscriptions = db
    .prepare(
      `SELECT ci.*, p.fullName, p.teamName, p.teamLogo
       FROM championship_inscriptions ci
       JOIN players p ON ci.playerId = p.id
       WHERE ci.championshipId = ?
       ORDER BY ci.createdAt DESC`
    )
    .all(id);

  return Response.json(inscriptions);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: championshipId } = await params;
  const body = await request.json();
  const { playerId } = body;

  if (!playerId) {
    return Response.json({ error: "ID joueur requis" }, { status: 400 });
  }

  const db = getDb();

  const player = db.prepare("SELECT * FROM players WHERE id = ?").get(playerId) as { id: string; status: string } | undefined;
  if (!player || player.status !== "ACTIVE_USER") {
    return Response.json(
      { error: "Joueur non validé ou inexistant" },
      { status: 403 }
    );
  }

  const existing = db
    .prepare(
      "SELECT id FROM championship_inscriptions WHERE championshipId = ? AND playerId = ?"
    )
    .get(championshipId, playerId);
  if (existing) {
    return Response.json({ error: "Déjà inscrit à ce championnat" }, { status: 409 });
  }

  const inscriptionId = randomUUID();
  db.prepare(
    "INSERT INTO championship_inscriptions (id, championshipId, playerId) VALUES (?, ?, ?)"
  ).run(inscriptionId, championshipId, playerId);

  const inscription = db
    .prepare("SELECT * FROM championship_inscriptions WHERE id = ?")
    .get(inscriptionId);
  return Response.json(inscription, { status: 201 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: championshipId } = await params;
  const body = await request.json();
  const { inscriptionId, status } = body;

  if (!inscriptionId || !status) {
    return Response.json({ error: "ID inscription et statut requis" }, { status: 400 });
  }

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return Response.json({ error: "Statut invalide" }, { status: 400 });
  }

  const db = getDb();

  db.prepare("UPDATE championship_inscriptions SET status = ? WHERE id = ?").run(
    status,
    inscriptionId
  );

  const inscription = db
    .prepare(
      `SELECT ci.*, p.fullName, p.teamName
       FROM championship_inscriptions ci
       JOIN players p ON ci.playerId = p.id
       WHERE ci.id = ?`
    )
    .get(inscriptionId) as { playerId: string; fullName: string; teamName: string } | undefined;

  if (inscription) {
    const champ = db
      .prepare("SELECT name FROM championships WHERE id = ?")
      .get(championshipId) as { name: string } | undefined;

    const message =
      status === "APPROVED"
        ? `Votre équipe "${inscription.teamName}" a été acceptée au championnat "${champ?.name}" !`
        : `Votre inscription au championnat "${champ?.name}" a été refusée.`;

    db.prepare(
      "INSERT INTO notifications (id, playerId, message, type) VALUES (?, ?, ?, ?)"
    ).run(randomUUID(), inscription.playerId, message, "CHAMPIONSHIP_INSCRIPTION");
  }

  const updated = db
    .prepare("SELECT * FROM championship_inscriptions WHERE id = ?")
    .get(inscriptionId);
  return Response.json(updated);
}
