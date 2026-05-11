"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Bell, Trophy, User, CheckCircle, XCircle, Clock } from "lucide-react";
import { TEAM_LOGOS } from "@/lib/logos";
import type { Championship, Notification, ChampionshipInscription } from "@/lib/types";

export default function PlayerDashboard() {
  const { role, player } = useAuthStore();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [inscriptions, setInscriptions] = useState<ChampionshipInscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "player" || !player) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [notifsRes, champsRes] = await Promise.all([
          fetch(`/api/notifications?playerId=${player.id}`),
          fetch("/api/championships"),
        ]);

        const notifsData = await notifsRes.json();
        const champsData = await champsRes.json();

        if (Array.isArray(notifsData)) setNotifications(notifsData);
        if (Array.isArray(champsData)) setChampionships(champsData);

        const inscrPromises = champsData.map((c: Championship) =>
          fetch(`/api/championships/${c.id}/inscriptions`).then((r) => r.json())
        );
        const allInscr = await Promise.all(inscrPromises);
        const myInscr = allInscr
          .flat()
          .filter((i: ChampionshipInscription) => i.playerId === player.id);
        setInscriptions(myInscr);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, player, router]);

  const markAllRead = async () => {
    if (!player) return;
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: player.id }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: 1 })));
  };

  const inscribeToChampionship = async (championshipId: string) => {
    if (!player) return;
    const res = await fetch(`/api/championships/${championshipId}/inscriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: player.id }),
    });
    if (res.ok) {
      const data = await res.json();
      setInscriptions((prev) => [...prev, data]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-gray-400">Chargement...</div>
      </div>
    );
  }

  if (!player) return null;

  const logo = TEAM_LOGOS.find((l) => l.id === player.teamLogo);
  const unread = notifications.filter((n) => !n.read);

  const statusBadge = {
    PENDING_USER: { label: "En attente", color: "bg-yellow-500/10 text-yellow-400", icon: Clock },
    ACTIVE_USER: { label: "Actif", color: "bg-emerald-500/10 text-emerald-400", icon: CheckCircle },
    REJECTED_USER: { label: "Refusé", color: "bg-red-500/10 text-red-400", icon: XCircle },
  }[player.status];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-3xl">
            {logo?.emoji || <User className="w-7 h-7 text-blue-400" />}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{player.fullName}</h1>
            <p className="text-gray-400 text-sm">
              {player.teamName} &bull; ID: {player.playerId}
            </p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${statusBadge.color}`}>
            <statusBadge.icon className="w-3.5 h-3.5" />
            {statusBadge.label}
          </div>
        </div>
      </div>

      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            Notifications
            {unread.length > 0 && (
              <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unread.length}
              </span>
            )}
          </h2>
          {unread.length > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune notification</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 rounded-xl text-sm ${
                  n.read ? "bg-[#0f172a] text-gray-400" : "bg-blue-500/5 border border-blue-500/10 text-gray-300"
                }`}
              >
                {n.message}
                <span className="block text-xs text-gray-500 mt-1">
                  {new Date(n.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {player.status === "ACTIVE_USER" && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-blue-400" />
            Championnats disponibles
          </h2>
          {championships.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun championnat disponible</p>
          ) : (
            <div className="space-y-3">
              {championships.map((c) => {
                const myInscription = inscriptions.find(
                  (i) => i.championshipId === c.id
                );
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between bg-[#0f172a] rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="text-white font-medium">{c.name}</p>
                      <p className="text-xs text-gray-500">
                        Statut : {c.status === "UPCOMING" ? "A venir" : c.status === "IN_PROGRESS" ? "En cours" : "Terminé"}
                      </p>
                    </div>
                    {myInscription ? (
                      <span
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                          myInscription.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : myInscription.status === "REJECTED"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {myInscription.status === "APPROVED"
                          ? "Inscrit"
                          : myInscription.status === "REJECTED"
                          ? "Refusé"
                          : "En attente"}
                      </span>
                    ) : (
                      <button
                        onClick={() => inscribeToChampionship(c.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-lg font-medium"
                      >
                        S&apos;inscrire
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
