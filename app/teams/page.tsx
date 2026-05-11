"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { TEAM_LOGOS } from "@/lib/logos";

interface TeamRow {
  id: string;
  name: string;
  logo: string;
  ownerName: string;
  ownerStatus: string;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teams")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTeams(data.filter((t: TeamRow) => t.ownerStatus === "ACTIVE_USER"));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-gray-400">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Équipes</h1>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">Aucune équipe pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => {
            const logo = TEAM_LOGOS.find((l) => l.id === team.logo);
            return (
              <div
                key={team.id}
                className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{
                      backgroundColor: logo ? `${logo.color}15` : "#334155",
                    }}
                  >
                    {logo?.emoji || "?"}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{team.name}</h3>
                    <p className="text-gray-400 text-xs">
                      Logo : {logo?.name || "Inconnu"}
                    </p>
                  </div>
                </div>
                <div className="border-t border-[#334155] pt-3">
                  <p className="text-gray-400 text-sm">
                    Propriétaire : <span className="text-white">{team.ownerName}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
