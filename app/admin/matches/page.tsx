"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Swords, Trophy } from "lucide-react";
import type { Championship } from "@/lib/types";

export default function AdminMatchesPage() {
  const { role } = useAuthStore();
  const router = useRouter();
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "admin") {
      router.push("/login");
      return;
    }
    fetch("/api/championships")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setChampionships(data);
      })
      .finally(() => setLoading(false));
  }, [role, router]);

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
        <Swords className="w-6 h-6 text-purple-400" />
        <h1 className="text-2xl font-bold text-white">Gestion des Matchs</h1>
      </div>

      <p className="text-gray-400 text-sm mb-6">
        Sélectionnez un championnat pour gérer ses matchs et résultats
      </p>

      {championships.length === 0 ? (
        <p className="text-gray-500 text-center py-10">Aucun championnat créé</p>
      ) : (
        <div className="space-y-3">
          {championships.map((c) => (
            <Link
              key={c.id}
              href={`/admin/championships/${c.id}`}
              className="flex items-center justify-between bg-[#1e293b] border border-[#334155] rounded-xl p-4 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-white font-medium">{c.name}</p>
                  <span className="text-xs text-gray-500">
                    {c.status === "UPCOMING" ? "A venir" : c.status === "IN_PROGRESS" ? "En cours" : "Terminé"}
                  </span>
                </div>
              </div>
              <span className="text-blue-400 text-sm">Voir &rarr;</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
