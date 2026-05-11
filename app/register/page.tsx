"use client";

import { useState } from "react";
import { TEAM_LOGOS } from "@/lib/logos";
import { UserPlus, Check } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    playerId: "",
    phone: "",
    teamName: "",
    teamLogo: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Inscription réussie !</h2>
          <p className="text-gray-400 mb-2">
            Votre demande a été soumise avec succès.
          </p>
          <p className="text-gray-500 text-sm">
            Un administrateur va valider votre inscription. Vous pourrez ensuite
            vous connecter avec votre ID joueur : <strong className="text-blue-400">{form.playerId}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Inscription Joueur</h1>
            <p className="text-gray-400 text-sm">Créez votre compte et votre équipe</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Nom complet
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="Ex: Jean Baptiste"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              ID Joueur (créé par vous)
            </label>
            <input
              type="text"
              required
              value={form.playerId}
              onChange={(e) => setForm({ ...form, playerId: e.target.value })}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="Ex: jean_pro_01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="Ex: +509 1234 5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Nom de votre équipe
            </label>
            <input
              type="text"
              required
              value={form.teamName}
              onChange={(e) => setForm({ ...form, teamName: e.target.value })}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="Ex: Jerome FC"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Choisissez un logo pour votre équipe
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {TEAM_LOGOS.map((logo) => (
                <button
                  key={logo.id}
                  type="button"
                  onClick={() => setForm({ ...form, teamLogo: logo.id })}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                    form.teamLogo === logo.id
                      ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30"
                      : "border-[#334155] hover:border-[#475569]"
                  }`}
                  title={logo.name}
                >
                  <span className="text-2xl">{logo.emoji}</span>
                  <span className="text-[10px] text-gray-400 truncate w-full text-center">
                    {logo.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
            {form.teamLogo && (
              <p className="text-xs text-blue-400 mt-2">
                Logo sélectionné : {TEAM_LOGOS.find((l) => l.id === form.teamLogo)?.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !form.teamLogo}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Envoi en cours...</span>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                S&apos;inscrire
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
