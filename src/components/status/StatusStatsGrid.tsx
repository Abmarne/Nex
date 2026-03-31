import React from "react";
import { Card } from "@/components/ui/card";
import { Users, Clock } from "lucide-react";

interface StatusStatsGridProps {
  position: number | null;
  estWaitTime: number;
}

export function StatusStatsGrid({ position, estWaitTime }: StatusStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-4">
      <Card className="text-center p-6 bg-white/[0.02] backdrop-blur-xl border-white/5 rounded-3xl shadow-lg relative overflow-hidden group">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
        <Users className="mx-auto mb-4 text-primary opacity-80" size={28} />
        <p className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-widest mb-1">Ahead of you</p>
        <p className="text-4xl font-black text-white">{position === 1 ? "NEXT" : (position || 0) - 1}</p>
      </Card>
      
      <Card className="text-center p-6 bg-white/[0.02] backdrop-blur-xl border-white/5 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-20" />
        <Clock className="mx-auto mb-4 text-secondary opacity-80" size={28} />
        <p className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-widest mb-1">Est. Wait</p>
        <p className="text-4xl font-black text-white">{estWaitTime}<span className="text-base text-muted-foreground ml-1">m</span></p>
      </Card>
    </div>
  );
}
