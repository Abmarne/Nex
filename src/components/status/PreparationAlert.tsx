import React from "react";
import { Zap } from "lucide-react";

export function PreparationAlert({ position }: { position: number }) {
  if (position === null || position > 3 || position <= 0) return null;

  return (
    <div className="w-full max-w-sm bg-[#1a1500]/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-5 flex items-center gap-5 shadow-[0_0_30px_rgba(245,158,11,0.15)] animate-in slide-in-from-bottom flex-shrink-0">
      <div className="bg-gradient-to-br from-amber-400 to-orange-600 text-white p-3 rounded-xl shadow-inner">
        <Zap size={24} className="fill-current" />
      </div>
      <div>
        <p className="font-black text-amber-500 leading-tight tracking-wide text-sm uppercase">PREPARE</p>
        <p className="text-white text-base font-medium">Head to the counter immediately.</p>
      </div>
    </div>
  );
}
