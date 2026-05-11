"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trophy, Plus, Eye } from "lucide-react";
import type { Championship } from "@/lib/types";

export default function AdminChampionshipsPage() {
  const { role } = useAuthStore();
  const router = useRouter();
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (role !== "admin") {
      router.push("/login");
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/championships");
      const data = await res.json();
      if (!cancelled) {
        if (Array.isArray(data)) setChampionships(data);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [role, router, refreshKey]);

  const createChampionship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    await fetch("/api/championships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    setNewName("");
    setCreating(false);
    setRefreshKey((k) => k + 1);
  };

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
        <Trophy className="w-6 h-6 text-emerald-400" />
        <h1 className="text-2xl font-bold text-white">Championnats</h1>
      </div>

      <form
        onSubmit={createChampionship}
        className="bg-[#1e293b] border border-[#334155] rounded-2xl p-4 flex gap-3 mb-6"
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nom du nouveau championnat..."
          className="flex-1 bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
        />
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Créer
        </button>
      </form>

      {championships.length === 0 ? (
        <p className="text-gray-500 text-center py-10">Aucun championnat créé</p>
      ) : (
        <div className="space-y-3">
          {championships.map((c) => {
            const status = statusLabel(c.status);
            return (
              <div
                key={c.id}
                className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium">{c.name}</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-md mt-1 ${status.color}`}>
                    {status.text}
                  </span>
                </div>
                <Link
                  href={`/admin/championships/${c.id}`}
                  className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Gérer
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
