"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Users, Trophy, Swords } from "lucide-react";

export default function AdminDashboard() {
  const { role } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({ players: 0, pending: 0, championships: 0 });

  useEffect(() => {
    if (role !== "admin") {
      router.push("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const [playersRes, champsRes] = await Promise.all([
          fetch("/api/players"),
          fetch("/api/championships"),
        ]);
        const players = await playersRes.json();
        const champs = await champsRes.json();

        if (Array.isArray(players) && Array.isArray(champs)) {
          setStats({
            players: players.length,
            pending: players.filter((p: { status: string }) => p.status === "PENDING_USER").length,
            championships: champs.length,
          });
        }
      } catch {
        // ignore
      }
    };

    fetchStats();
  }, [role, router]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Administration</h1>
          <p className="text-gray-400 text-sm">Gérez les joueurs, championnats et matchs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Joueurs totaux</p>
          <p className="text-3xl font-bold text-white">{stats.players}</p>
        </div>
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5">
          <p className="text-gray-400 text-sm">En attente</p>
          <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Championnats</p>
          <p className="text-3xl font-bold text-blue-400">{stats.championships}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/players"
          className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 hover:border-blue-500/30 transition-colors group"
        >
          <Users className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-semibold mb-1">Gestion Joueurs</h3>
          <p className="text-gray-400 text-sm">Valider ou refuser les inscriptions</p>
        </Link>
        <Link
          href="/admin/championships"
          className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 hover:border-emerald-500/30 transition-colors group"
        >
          <Trophy className="w-8 h-8 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-semibold mb-1">Championnats</h3>
          <p className="text-gray-400 text-sm">Créer et gérer les compétitions</p>
        </Link>
        <Link
          href="/admin/matches"
          className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 hover:border-purple-500/30 transition-colors group"
        >
          <Swords className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-semibold mb-1">Matchs</h3>
          <p className="text-gray-400 text-sm">Gérer les matchs et résultats</p>
        </Link>
      </div>
    </div>
  );
}
