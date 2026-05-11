"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Shield, User } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"player" | "admin">("player");
  const [playerId, setPlayerId] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAdmin, setPlayer } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "admin" ? { code: adminCode } : { playerId }
        ),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur de connexion");
      } else if (data.role === "admin") {
        setAdmin();
        router.push("/admin");
      } else if (data.role === "player") {
        setPlayer(data.player);
        router.push("/player");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Connexion</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode("player"); setError(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              mode === "player"
                ? "bg-blue-600 text-white"
                : "bg-[#334155] text-gray-400 hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            Joueur
          </button>
          <button
            onClick={() => { setMode("admin"); setError(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              mode === "admin"
                ? "bg-yellow-600 text-white"
                : "bg-[#334155] text-gray-400 hover:text-white"
            }`}
          >
            <Shield className="w-4 h-4" />
            Admin
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "player" ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Votre ID Joueur
              </label>
              <input
                type="text"
                required
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="Ex: jean_pro_01"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Code Admin
              </label>
              <input
                type="password"
                required
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                placeholder="Entrez le code admin"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-medium py-3 rounded-xl flex items-center justify-center gap-2 text-white ${
              mode === "admin"
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-blue-600 hover:bg-blue-700"
            } disabled:opacity-50`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
