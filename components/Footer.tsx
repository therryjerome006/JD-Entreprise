"use client";

import { Trophy } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1e293b] border-t border-[#334155] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Trophy className="w-4 h-4 text-blue-400" />
          <span>JD Championship Manager</span>
        </div>
        <p className="text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} JD Entreprise. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
