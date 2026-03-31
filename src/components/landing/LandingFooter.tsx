import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export function LandingFooter() {
  return (
    <footer className="py-32 border-t border-white/5 bg-black relative z-10">
      <div className="container mx-auto px-6 flex flex-col items-center space-y-12">
         <Logo size={60} showText={true} />
         <p className="text-sm font-black tracking-widest uppercase text-muted-foreground/30 max-w-sm text-center">
           Digitally orchestrating the world&apos;s waiting lines.
         </p>
         <div className="flex items-center justify-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
           <Link href="#" className="hover:text-white transition-colors">Terms of Spec</Link>
           <Link href="#" className="hover:text-white transition-colors">Privacy Matrix</Link>
           <Link href="#" className="hover:text-white transition-colors">Comms Link</Link>
         </div>
         <p className="text-[10px] text-muted-foreground/20 font-black tracking-[0.3em] uppercase mt-12">© 2026 Nex Platform.</p>
      </div>
    </footer>
  );
}
