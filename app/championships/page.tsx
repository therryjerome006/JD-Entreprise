"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Eye } from "lucide-react";
import type { Championship } from "@/lib/types";

export default function ChampionshipsPage() {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/championships")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setChampionships(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const statusLabel = (s: string) => {
    if (s === "UPCOMING") return { text: "A venir", color: "bg-yellow-500/10 text-yellow-400" };
    if (s === "IN_PROGRESS") return { text: "En cours", color: "bg-blue-500/10 text-blue-400" };
    return { text: "Terminé", color: "bg-emerald-500/10 text-emerald-400" };
  };

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
        <Trophy className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Championnats</h1>
      </div>

      {championships.length === 0 ? (
        <div className="text-center py-20">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">Aucun championnat pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {championships.map((c) => {
            const status = statusLabel(c.status);
            return (
              <Link
                key={c.id}
                href={`/championships/${c.id}`}
                className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 hover:border-blue-500/30 transition-colors flex items-center justify-between group"
              >
                <div>
                  <h3 className="text-white font-semibold text-lg">{c.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-md ${status.color}`}>
                      {status.text}
                    </span>
                    <span className="text-xs text-gray-500">
                      Créé le {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
                <Eye className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
