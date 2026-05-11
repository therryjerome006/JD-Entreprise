"use client";

import Link from "next/link";
import { Trophy, Users, Calendar, BarChart3, UserPlus, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-emerald-600/10" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <Trophy className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Plateforme de Championnats</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Gérez vos <span className="text-blue-400">championnats</span> comme un pro
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Inscrivez-vous, créez votre équipe, participez aux compétitions et suivez
            les résultats en temps réel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium text-lg"
            >
              <UserPlus className="w-5 h-5" />
              S&apos;inscrire
            </Link>
            <Link
              href="/championships"
              className="inline-flex items-center gap-2 bg-[#334155] hover:bg-[#475569] text-white px-6 py-3 rounded-xl font-medium text-lg"
            >
              <Trophy className="w-5 h-5" />
              Voir les championnats
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: UserPlus,
              title: "Inscription",
              desc: "Créez votre profil et votre équipe personnalisée",
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              icon: Users,
              title: "Équipes",
              desc: "Choisissez votre logo parmi les plus grands clubs",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              icon: Calendar,
              title: "Championnats",
              desc: "Participez aux compétitions et suivez les matchs",
              color: "text-purple-400",
              bg: "bg-purple-500/10",
            },
            {
              icon: BarChart3,
              title: "Classement",
              desc: "Suivez le classement automatique en temps réel",
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 hover:border-blue-500/30 transition-colors"
            >
              <div
                className={`${item.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Comment ça marche ?
          </h2>
          <div className="space-y-6">
            {[
              { step: "1", title: "Inscrivez-vous", desc: "Créez votre compte et votre équipe avec un logo au choix" },
              { step: "2", title: "Validation Admin", desc: "L'administrateur valide votre inscription" },
              { step: "3", title: "Rejoignez un championnat", desc: "Inscrivez-vous aux championnats disponibles" },
              { step: "4", title: "Jouez et gagnez", desc: "Participez aux matchs et suivez le classement" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto bg-[#1e293b] border border-[#334155] rounded-2xl p-8 text-center">
          <Shield className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-white font-bold text-xl mb-2">Espace Admin</h3>
          <p className="text-gray-400 text-sm mb-4">
            Accédez à la gestion complète des joueurs, championnats et matchs
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 px-5 py-2.5 rounded-xl font-medium text-sm"
          >
            <Shield className="w-4 h-4" />
            Accès Admin
          </Link>
        </div>
      </section>
    </div>
  );
}
