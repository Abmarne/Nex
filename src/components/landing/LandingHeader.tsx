import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export function LandingHeader() {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-2xl">
      <div className="container mx-auto px-4 sm:px-6 h-20 md:h-24 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo size={32} className="md:scale-110" />
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="#features" className="text-xs font-black tracking-widest uppercase text-muted-foreground hover:text-white transition-colors">Features</Link>
          <Link href="/login" className="text-xs font-black tracking-widest uppercase text-muted-foreground hover:text-white transition-colors">Login</Link>
          <Link href="/register">
            <Button className="rounded-xl shadow-[0_0_20px_-5px_var(--color-primary)] hover:shadow-[0_0_30px_-5px_var(--color-primary)] bg-primary text-white font-black uppercase tracking-widest text-[10px] px-8 h-12 transition-all">Command Center</Button>
          </Link>
        </nav>

        {/* Mobile CTA */}
        <div className="md:hidden flex items-center gap-4">
           <Link href="/login" className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Login</Link>
           <Link href="/register">
             <Button className="rounded-lg bg-primary text-white font-black uppercase tracking-widest text-[9px] px-4 h-9">HQ</Button>
           </Link>
        </div>
      </div>
    </header>
  );
}
