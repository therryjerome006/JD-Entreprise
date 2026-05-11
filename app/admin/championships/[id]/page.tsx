"use client";

import { useEffect, useState, use } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Trophy, CheckCircle, XCircle, Swords, Play } from "lucide-react";
import { TEAM_LOGOS } from "@/lib/logos";
import type { Championship } from "@/lib/types";

interface InscriptionRow {
  id: string;
  playerId: string;
  fullName: string;
  teamName: string;
  teamLogo: string;
  status: string;
}

interface MatchRow {
  id: string;
  teamAName: string;
  teamALogo: string;
  teamBName: string;
  teamBLogo: string;
  scoreA: number | null;
  scoreB: number | null;
  status: string;
  matchDay: number;
}

export default function AdminChampionshipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { role } = useAuthStore();
  const router = useRouter();
  const [championship, setChampionship] = useState<Championship | null>(null);
  const [inscriptions, setInscriptions] = useState<InscriptionRow[]>([]);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoreInputs, setScoreInputs] = useState<Record<string, { a: string; b: string }>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (role !== "admin") {
      router.push("/login");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [champsRes, inscrRes, matchesRes] = await Promise.all([
          fetch("/api/championships"),
          fetch(`/api/championships/${id}/inscriptions`),
          fetch(`/api/matches?championshipId=${id}`),
        ]);
        const champs = await champsRes.json();
        const inscr = await inscrRes.json();
        const matchData = await matchesRes.json();
        if (!cancelled) {
          if (Array.isArray(champs)) {
            setChampionship(champs.find((c: Championship) => c.id === id) || null);
          }
          if (Array.isArray(inscr)) setInscriptions(inscr);
          if (Array.isArray(matchData)) setMatches(matchData);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [role, router, id, refreshKey]);

  const updateInscription = async (inscriptionId: string, status: string) => {
    await fetch(`/api/championships/${id}/inscriptions`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inscriptionId, status }),
    });
    setRefreshKey((k) => k + 1);
  };

  const generateMatches = async () => {
    await fetch("/api/matches/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ championshipId: id }),
    });
    setRefreshKey((k) => k + 1);
  };

  const submitScore = async (matchId: string) => {
    const input = scoreInputs[matchId];
    if (!input) return;
    await fetch(`/api/matches/${matchId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scoreA: parseInt(input.a),
        scoreB: parseInt(input.b),
      }),
    });
    setScoreInputs((prev) => {
      const updated = { ...prev };
      delete updated[matchId];
      return updated;
    });
    setRefreshKey((k) => k + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-gray-400">Chargement...</div>
      </div>
    );
  }

  if (!championship) {
    return <p className="text-center text-gray-500 py-10">Championnat non trouvé</p>;
  }

  const approvedCount = inscriptions.filter((i) => i.status === "APPROVED").length;
  const pendingInscriptions = inscriptions.filter((i) => i.status === "PENDING_CHAMPIONSHIP");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">{championship.name}</h1>
            <p className="text-gray-400 text-sm">
              {approvedCount} équipes approuvées &bull; {matches.length} matchs
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Inscriptions</h2>
        {inscriptions.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune inscription</p>
        ) : (
          <div className="space-y-2">
            {inscriptions.map((i) => {
              const logo = TEAM_LOGOS.find((l) => l.id === i.teamLogo);
              return (
                <div
                  key={i.id}
                  className="flex items-center justify-between bg-[#0f172a] rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{logo?.emoji || "?"}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{i.teamName}</p>
                      <p className="text-gray-500 text-xs">{i.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {i.status === "PENDING_CHAMPIONSHIP" && (
                      <>
                        <button
                          onClick={() => updateInscription(i.id, "APPROVED")}
                          className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-medium"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Accepter
                        </button>
                        <button
                          onClick={() => updateInscription(i.id, "REJECTED")}
                          className="flex items-center gap-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-xs font-medium"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Refuser
                        </button>
                      </>
                    )}
                    {i.status === "APPROVED" && (
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md">
                        Approuvé
                      </span>
                    )}
                    {i.status === "REJECTED" && (
                      <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-md">
                        Refusé
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {approvedCount >= 2 && matches.length === 0 && pendingInscriptions.length === 0 && (
        <button
          onClick={generateMatches}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Générer les matchs ({approvedCount} équipes)
        </button>
      )}

      {matches.length > 0 && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Swords className="w-5 h-5 text-purple-400" />
            Matchs
          </h2>
          <div className="space-y-3">
            {matches.map((m) => {
              const logoA = TEAM_LOGOS.find((l) => l.id === m.teamALogo);
              const logoB = TEAM_LOGOS.find((l) => l.id === m.teamBLogo);
              return (
                <div
                  key={m.id}
                  className="bg-[#0f172a] rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Journée {m.matchDay}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md ${
                        m.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {m.status === "COMPLETED" ? "Terminé" : "Programmé"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-lg">{logoA?.emoji}</span>
                      <span className="text-white text-sm font-medium truncate">
                        {m.teamAName}
                      </span>
                    </div>
                    {m.status === "COMPLETED" ? (
                      <div className="text-center px-4">
                        <span className="text-white font-bold text-lg">
                          {m.scoreA} - {m.scoreB}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2">
                        <input
                          type="number"
                          min="0"
                          className="w-12 bg-[#1e293b] border border-[#334155] rounded-lg px-2 py-1 text-white text-center text-sm focus:outline-none focus:border-blue-500"
                          value={scoreInputs[m.id]?.a || ""}
                          onChange={(e) =>
                            setScoreInputs((prev) => ({
                              ...prev,
                              [m.id]: { ...prev[m.id], a: e.target.value },
                            }))
                          }
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="number"
                          min="0"
                          className="w-12 bg-[#1e293b] border border-[#334155] rounded-lg px-2 py-1 text-white text-center text-sm focus:outline-none focus:border-blue-500"
                          value={scoreInputs[m.id]?.b || ""}
                          onChange={(e) =>
                            setScoreInputs((prev) => ({
                              ...prev,
                              [m.id]: { ...prev[m.id], b: e.target.value },
                            }))
                          }
                        />
                        <button
                          onClick={() => submitScore(m.id)}
                          disabled={
                            !scoreInputs[m.id]?.a || !scoreInputs[m.id]?.b
                          }
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white text-xs px-2 py-1 rounded-lg ml-1"
                        >
                          OK
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-white text-sm font-medium truncate">
                        {m.teamBName}
                      </span>
                      <span className="text-lg">{logoB?.emoji}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
