import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Smartphone, ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 px-4 md:px-6 z-10 flex flex-col items-center justify-center min-h-screen">
      <div className="container mx-auto max-w-6xl text-center flex flex-col items-center mt-12 mb-auto">
        
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-3 px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-primary/10 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 backdrop-blur-md mb-8 md:mb-12 shadow-[0_0_15px_-5px_var(--color-primary)]">
            <Sparkles size={14} className="fill-primary animate-pulse" />
            Next-Gen Queueing Protocol
          </div>
          
          <h1 className="text-5xl sm:text-8xl md:text-[8rem] font-black tracking-tighter leading-[0.95] md:leading-[0.9] mb-8 md:mb-10 text-white drop-shadow-2xl">
            Wait <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-lg">Smarter.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-muted-foreground/80 max-w-2xl md:max-w-3xl mx-auto font-medium leading-relaxed mb-12 md:mb-16 tracking-wide px-4">
            The high-performance, real-time waiting terminal. No downloads. No friction. Pure operational superiority.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-xs sm:max-w-none mx-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 rounded-2xl text-[12px] md:text-[14px] font-black uppercase tracking-widest gap-4 shadow-[0_0_40px_-10px_var(--color-primary)] hover:shadow-[0_0_60px_-10px_var(--color-primary)] hover:scale-105 transition-all duration-300 bg-primary text-white border border-primary/50">
                Deploy Terminal
                <ArrowRight size={20} className="hidden sm:block" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 rounded-2xl text-[12px] md:text-[14px] font-black uppercase tracking-widest gap-4 border border-white/10 bg-white/5 hover:bg-white/10 text-white hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                System Login
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Glass Mockup Dashboard */}
        <div className="w-full max-w-5xl mt-24 md:mt-32 relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 group perspective">
          <div className="absolute inset-x-0 bottom-[-50px] h-32 bg-primary/20 blur-[100px] z-0" />
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 z-20" />
          
          <div className="rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 bg-[#121212]/90 backdrop-blur-3xl shadow-2xl shadow-primary/10 overflow-hidden transition-transform duration-700 hover:-translate-y-4 relative z-10 mx-2 md:mx-0">
            <div className="h-12 md:h-16 border-b border-white/5 bg-black/40 flex items-center px-4 md:px-8 gap-2 md:gap-3 backdrop-blur-md">
              <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-red-500 shadow-[0_0_10px_var(--color-red-500)]" />
              <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-amber-500 shadow-[0_0_10px_var(--color-amber-500)]" />
              <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_var(--color-emerald-500)]" />
              <div className="mx-auto text-[8px] md:text-[10px] font-black text-muted-foreground/50 tracking-widest uppercase">TERMINAL_PREVIEW_01</div>
            </div>
            <div className="p-4 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 relative">
               {/* Left Glowing Active Card */}
              <div className="col-span-2 md:row-span-2 rounded-[1.2rem] md:rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center relative overflow-hidden min-h-[160px] md:min-h-[250px] shadow-[inset_0_0_50px_-20px_var(--color-emerald-500)]">
                <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 md:opacity-20"><Smartphone size={40} className="md:w-20 md:h-20 text-emerald-500" /></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 md:w-2 h-1/2 bg-emerald-500 rounded-r-full shadow-[0_0_15px_var(--color-emerald-500)]" />
                <div className="text-emerald-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-4">Live Focus</div>
                <div className="text-5xl sm:text-7xl md:text-9xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-tighter">#042</div>
              </div>
              
              {/* Secondary Cards */}
              <div className="rounded-[1.2rem] md:rounded-[2rem] bg-black/40 border border-white/5 flex flex-col items-center justify-center p-4 md:p-8 gap-2 md:gap-4 hover:border-white/10 transition-colors">
                <div className="text-2xl md:text-4xl font-black text-white/40">#043</div>
                <div className="h-1 w-8 md:h-1.5 md:w-12 bg-white/10 rounded-full" />
              </div>
              <div className="rounded-[1.2rem] md:rounded-[2rem] bg-black/40 border border-white/5 flex flex-col items-center justify-center p-4 md:p-8 gap-2 md:gap-4 hover:border-white/10 transition-colors">
                <div className="text-2xl md:text-4xl font-black text-white/40">#044</div>
                <div className="h-1 w-8 md:h-1.5 md:w-12 bg-white/10 rounded-full" />
              </div>
              <div className="hidden md:flex rounded-[2rem] bg-black/40 border border-white/5 flex-col items-center justify-center p-8 gap-4 hover:border-white/10 transition-colors">
                <div className="text-4xl font-black text-white/40">#045</div>
                <div className="h-1.5 w-12 bg-white/10 rounded-full" />
              </div>
              <div className="hidden md:flex rounded-[2rem] bg-black/40 border border-primary/20 flex-col items-center justify-center p-8 gap-4 relative overflow-hidden bg-primary/5">
                <div className="text-4xl font-black text-primary">#046</div>
                <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Scroll Indicator */}
      <div className="animate-bounce flex flex-col items-center text-white/20 mb-12 mt-20 hidden md:flex">
        <span className="text-[10px] font-black tracking-[0.2em] uppercase mb-4">Scroll Down</span>
        <ChevronDown size={24} />
      </div>
    </section>
  );
}
