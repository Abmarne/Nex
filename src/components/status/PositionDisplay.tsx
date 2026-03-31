import React from "react";

export function PositionDisplay({ position }: { position: number }) {
  if (position === null) return null;
  
  return (
    <div className="text-center w-full relative">
      <p className="text-muted-foreground/60 uppercase tracking-[0.3em] text-[10px] font-black mb-4 md:mb-6">Your Token Number</p>
      <div className="relative inline-block">
        <h2 className="text-7xl sm:text-[10rem] font-black text-white leading-none tracking-tighter drop-shadow-[0_0_60px_rgba(0,112,243,0.3)]">
          #{position}
        </h2>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent mix-blend-overlay pointer-events-none" />
      </div>
    </div>
  );
}
