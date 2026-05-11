"use client";

import { useEffect, useState, use } from "react";
import { Trophy, BarChart3, Swords } from "lucide-react";
import { TEAM_LOGOS } from "@/lib/logos";
import type { Championship, StandingRow } from "@/lib/types";

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

export default function ChampionshipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [championship, setChampionship] = useState<Championship | null>(null);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [tab, setTab] = useState<"standings" | "matches">("standings");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [champsRes, matchesRes, standingsRes] = await Promise.all([
          fetch("/api/championships"),
          fetch(`/api/matches?championshipId=${id}`),
          fetch(`/api/standings/${id}`),
        ]);

        const champs = await champsRes.json();
        const matchData = await matchesRes.json();
        const standingsData = await standingsRes.json();

        if (Array.isArray(champs)) {
          setChampionship(champs.find((c: Championship) => c.id === id) || null);
        }
        if (Array.isArray(matchData)) setMatches(matchData);
        if (Array.isArray(standingsData)) setStandings(standingsData);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">{championship.name}</h1>
            <p className="text-gray-400 text-sm">
              {championship.status === "UPCOMING"
                ? "A venir"
                : championship.status === "IN_PROGRESS"
                ? "En cours"
                : "Terminé"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("standings")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium ${
            tab === "standings"
              ? "bg-blue-600 text-white"
              : "bg-[#1e293b] text-gray-400 border border-[#334155]"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Classement
        </button>
        <button
          onClick={() => setTab("matches")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium ${
            tab === "matches"
              ? "bg-blue-600 text-white"
              : "bg-[#1e293b] text-gray-400 border border-[#334155]"
          }`}
        >
          <Swords className="w-4 h-4" />
          Matchs
        </button>
      </div>

      {tab === "standings" && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden">
          {standings.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-10">
              Aucun classement disponible
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#334155] text-gray-400">
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Équipe</th>
                    <th className="py-3 px-2 text-center">MJ</th>
                    <th className="py-3 px-2 text-center">V</th>
                    <th className="py-3 px-2 text-center">N</th>
                    <th className="py-3 px-2 text-center">D</th>
                    <th className="py-3 px-2 text-center">BP</th>
                    <th className="py-3 px-2 text-center">BC</th>
                    <th className="py-3 px-2 text-center">DB</th>
                    <th className="py-3 px-4 text-center font-bold">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, idx) => {
                    const logo = TEAM_LOGOS.find((l) => l.id === row.teamLogo);
                    return (
                      <tr
                        key={row.teamId}
                        className={`border-b border-[#334155]/50 ${
                          idx === 0
                            ? "bg-yellow-500/5"
                            : idx < 3
                            ? "bg-emerald-500/5"
                            : ""
                        }`}
                      >
                        <td className="py-3 px-4 text-gray-400 font-medium">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{logo?.emoji || "?"}</span>
                            <span className="text-white font-medium">
                              {row.teamName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center text-gray-300">
                          {row.played}
                        </td>
                        <td className="py-3 px-2 text-center text-emerald-400">
                          {row.won}
                        </td>
                        <td className="py-3 px-2 text-center text-yellow-400">
                          {row.drawn}
                        </td>
                        <td className="py-3 px-2 text-center text-red-400">
                          {row.lost}
                        </td>
                        <td className="py-3 px-2 text-center text-gray-300">
                          {row.goalsFor}
                        </td>
                        <td className="py-3 px-2 text-center text-gray-300">
                          {row.goalsAgainst}
                        </td>
                        <td className="py-3 px-2 text-center text-gray-300">
                          {row.goalDifference > 0
                            ? `+${row.goalDifference}`
                            : row.goalDifference}
                        </td>
                        <td className="py-3 px-4 text-center text-white font-bold text-lg">
                          {row.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "matches" && (
        <div className="space-y-3">
          {matches.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-10 bg-[#1e293b] border border-[#334155] rounded-2xl">
              Aucun match programmé
            </p>
          ) : (
            matches.map((m) => {
              const logoA = TEAM_LOGOS.find((l) => l.id === m.teamALogo);
              const logoB = TEAM_LOGOS.find((l) => l.id === m.teamBLogo);
              return (
                <div
                  key={m.id}
                  className="bg-[#1e293b] border border-[#334155] rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      Journée {m.matchDay}
                    </span>
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
                    <div className="text-center px-4">
                      {m.status === "COMPLETED" ? (
                        <span className="text-white font-bold text-lg">
                          {m.scoreA} - {m.scoreB}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">VS</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-white text-sm font-medium truncate">
                        {m.teamBName}
                      </span>
                      <span className="text-lg">{logoB?.emoji}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
