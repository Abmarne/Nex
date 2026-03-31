import React from "react";

export function StatsSection() {
  return (
    <section className="py-20 md:py-24 relative z-10 border-y border-white/5 bg-black/50 backdrop-blur-2xl">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 text-center divide-y md:divide-y-0 md:divide-x divide-white/5">
        <div className="flex flex-col items-center justify-center pt-8 md:pt-0 group cursor-default">
           <div className="text-6xl sm:text-7xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500 title-font tracking-tighter">
             50%
           </div>
           <p className="text-[10px] md:text-[12px] font-black text-primary uppercase tracking-[0.2em]">Efficiency Boost</p>
        </div>
        <div className="flex flex-col items-center justify-center pt-8 md:pt-0 group cursor-default">
           <div className="text-6xl sm:text-7xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500 title-font tracking-tighter">
             $0
           </div>
           <p className="text-[10px] md:text-[12px] font-black text-secondary uppercase tracking-[0.2em]">Deployment Cost</p>
        </div>
        <div className="flex flex-col items-center justify-center pt-8 md:pt-0 group cursor-default">
           <div className="text-6xl sm:text-7xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500 title-font tracking-tighter">
             1s
           </div>
           <p className="text-[10px] md:text-[12px] font-black text-emerald-500 uppercase tracking-[0.2em]">Scan to Enter</p>
        </div>
      </div>
    </section>
  );
}
