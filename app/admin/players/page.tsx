"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { TEAM_LOGOS } from "@/lib/logos";
import type { Player } from "@/lib/types";

export default function AdminPlayersPage() {
  const { role } = useAuthStore();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (role !== "admin") {
      router.push("/login");
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/players");
      const data = await res.json();
      if (!cancelled) {
        if (Array.isArray(data)) setPlayers(data);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [role, router, refreshKey]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/players", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setRefreshKey((k) => k + 1);
  };

  const filtered =
    filter === "all" ? players : players.filter((p) => p.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-gray-400">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Gestion des Joueurs</h1>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { value: "all", label: "Tous" },
          { value: "PENDING_USER", label: "En attente" },
          { value: "ACTIVE_USER", label: "Actifs" },
          { value: "REJECTED_USER", label: "Refusés" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-blue-600 text-white"
                : "bg-[#1e293b] text-gray-400 hover:text-white border border-[#334155]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-10">Aucun joueur trouvé</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((player) => {
            const logo = TEAM_LOGOS.find((l) => l.id === player.teamLogo);
            return (
              <div
                key={player.id}
                className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="text-2xl">{logo?.emoji || "?"}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium">{player.fullName}</p>
                  <p className="text-gray-400 text-sm">
                    Équipe : {player.teamName} &bull; ID: {player.playerId} &bull;
                    Tél: {player.phone}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {player.status === "PENDING_USER" && (
                    <>
                      <button
                        onClick={() => updateStatus(player.id, "ACTIVE_USER")}
                        className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-2 rounded-lg text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accepter
                      </button>
                      <button
                        onClick={() => updateStatus(player.id, "REJECTED_USER")}
                        className="flex items-center gap-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-2 rounded-lg text-sm font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        Refuser
                      </button>
                    </>
                  )}
                  {player.status === "ACTIVE_USER" && (
                    <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Actif
                    </span>
                  )}
                  {player.status === "REJECTED_USER" && (
                    <span className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg">
                      <XCircle className="w-3.5 h-3.5" />
                      Refusé
                    </span>
                  )}
                  {player.status !== "PENDING_USER" && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(player.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
