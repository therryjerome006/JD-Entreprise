const ADMIN_CODE = process.env.ADMIN_CODE || "ADMIN2024";

export async function POST(request: Request) {
  const body = await request.json();
  const { code, playerId } = body;

  if (code === ADMIN_CODE) {
    return Response.json({ role: "admin", authenticated: true });
  }

  if (playerId) {
    const { getDb } = await import("@/lib/db");
    const db = getDb();
    const player = db
      .prepare("SELECT * FROM players WHERE playerId = ?")
      .get(playerId);
    if (player) {
      return Response.json({ role: "player", authenticated: true, player });
    }
    return Response.json({ error: "Joueur non trouvé" }, { status: 404 });
  }

  return Response.json({ error: "Code admin incorrect" }, { status: 401 });
}
