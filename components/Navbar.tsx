"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { Trophy, Users, Shield, LogOut, Bell, Home, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { role, player, logout } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (role === "player" && player) {
      fetch(`/api/notifications?playerId=${player.id}`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setUnreadCount(data.filter((n: { read: number }) => !n.read).length);
          }
        })
        .catch(() => {});
    }
  }, [role, player]);

  return (
    <nav className="bg-[#1e293b] border-b border-[#334155] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Trophy className="w-6 h-6 text-blue-400" />
            <span>JD Championship</span>
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          <div className={`${menuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-[#1e293b] md:bg-transparent border-b md:border-0 border-[#334155] items-start md:items-center gap-1 md:gap-2 p-4 md:p-0`}>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-[#334155] w-full md:w-auto"
            >
              <Home className="w-4 h-4" />
              Accueil
            </Link>
            <Link
              href="/championships"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-[#334155] w-full md:w-auto"
            >
              <Trophy className="w-4 h-4" />
              Championnats
            </Link>
            <Link
              href="/teams"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-[#334155] w-full md:w-auto"
            >
              <Users className="w-4 h-4" />
              Équipes
            </Link>

            {role === "visitor" && (
              <>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-blue-400 hover:text-blue-300 hover:bg-[#334155] w-full md:w-auto"
                >
                  <UserPlus className="w-4 h-4" />
                  Inscription
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 w-full md:w-auto"
                >
                  Connexion
                </Link>
              </>
            )}

            {role === "player" && (
              <>
                <Link
                  href="/player"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-[#334155] relative w-full md:w-auto"
                >
                  <Bell className="w-4 h-4" />
                  Dashboard
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 md:relative md:top-0 md:right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-[#334155] w-full md:w-auto"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </>
            )}

            {role === "admin" && (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-yellow-400 hover:text-yellow-300 hover:bg-[#334155] w-full md:w-auto"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-[#334155] w-full md:w-auto"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
