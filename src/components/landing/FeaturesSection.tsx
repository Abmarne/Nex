import React from "react";
import { Smartphone, Zap, ShieldCheck, ListOrdered, LayoutDashboard } from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-40 px-6 relative z-10 bg-background">
      <div className="container mx-auto max-w-7xl space-y-16 md:space-y-24">
        <div className="text-center space-y-4 md:space-y-6">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight text-white drop-shadow-lg">
            The Architecture of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Waiting.</span>
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed tracking-wide px-4">Heavy-duty enterprise features bundled in a premium UI layer tailored for maximum aesthetics.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
          {/* Big Bento Left */}
          <div className="md:col-span-2 min-h-[350px] md:min-h-[400px] group rounded-[2rem] md:rounded-[3rem] border border-white/5 bg-[#121212]/80 backdrop-blur-2xl p-8 md:p-12 overflow-hidden relative shadow-2xl hover:-translate-y-2 hover:border-primary/30 transition-all duration-500 flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 md:-top-20 md:-right-20 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
              <Smartphone size={300} className="md:w-[400px] md:h-[400px] text-primary" />
            </div>
            <div className="h-14 w-14 md:h-20 md:w-20 rounded-xl md:rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shadow-[inset_0_0_20px_rgba(var(--color-primary),0.2)] mb-8 md:mb-10 transition-colors group-hover:bg-primary group-hover:text-white">
              <Smartphone size={28} className="md:w-10 md:h-10" />
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className="text-3xl md:text-4xl font-black mb-3 md:mb-4 text-white tracking-tight">Zero-Install Access</h3>
              <p className="text-base md:text-lg text-muted-foreground max-w-md font-medium leading-relaxed">Customers scan a branded QR tag to instantly serialize onto the list. No garbage apps. No passwords.</p>
            </div>
          </div>

          {/* Small Bento Right Top */}
          <div className="min-h-[350px] md:min-h-[400px] group rounded-[2rem] md:rounded-[3rem] border border-white/5 bg-[#121212]/80 backdrop-blur-2xl p-8 md:p-12 relative shadow-2xl hover:-translate-y-2 hover:border-secondary/30 transition-all duration-500 flex flex-col justify-between overflow-hidden">
             <div className="absolute -bottom-10 -right-10 p-8 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-700">
               <Zap size={200} className="md:w-[250px] md:h-[250px] text-secondary" />
             </div>
             <div className="h-14 w-14 md:h-20 md:w-20 rounded-xl md:rounded-2xl bg-secondary/10 text-secondary border border-secondary/20 flex items-center justify-center shadow-inner mb-8 md:mb-10 transition-colors group-hover:bg-secondary group-hover:text-white">
               <Zap size={28} className="md:w-10 md:h-10" />
             </div>
             <div className="relative z-10 mt-auto">
               <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 text-white tracking-tight">Hyper-Sync</h3>
               <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">Socket-level immediate reactivity across every mobile device globally.</p>
             </div>
          </div>

          {/* Small Bento Left Bottom */}
          <div className="min-h-[350px] md:min-h-[400px] group rounded-[2rem] md:rounded-[3rem] border border-white/5 bg-[#121212]/80 backdrop-blur-2xl p-8 md:p-12 relative shadow-2xl hover:-translate-y-2 hover:border-amber-500/30 transition-all duration-500 flex flex-col justify-between overflow-hidden">
             <div className="absolute -top-10 -right-10 p-8 opacity-5 group-hover:opacity-10 group-hover:-rotate-12 transition-all duration-700">
               <ShieldCheck size={200} className="md:w-[250px] md:h-[250px] text-amber-500" />
             </div>
             <div className="h-14 w-14 md:h-20 md:w-20 rounded-xl md:rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shadow-inner mb-8 md:mb-10 transition-colors group-hover:bg-amber-500 group-hover:text-white">
               <ShieldCheck size={28} className="md:w-10 md:h-10" />
             </div>
             <div className="relative z-10 mt-auto">
               <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 text-white tracking-tight">Armor Core</h3>
               <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">Redundant cloud edges prevent dropouts during holiday rushes.</p>
             </div>
          </div>
          
          {/* Big Bento Right Bottom */}
          <div className="md:col-span-2 min-h-[350px] md:min-h-[400px] group rounded-[2rem] md:rounded-[3rem] border border-white/5 bg-[#121212]/80 backdrop-blur-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl hover:-translate-y-2 hover:border-primary/30 transition-all duration-500 flex flex-col justify-between">
            <div className="absolute -bottom-10 -right-10 md:-bottom-20 md:-right-20 p-8 opacity-5 group-hover:opacity-10 group-hover:-translate-y-4 group-hover:-translate-x-4 transition-all duration-700">
              <ListOrdered size={300} className="md:w-[400px] md:h-[400px] text-primary" />
            </div>
             <div className="h-14 w-14 md:h-20 md:w-20 rounded-xl md:rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shadow-inner mb-8 md:mb-10 transition-colors group-hover:bg-primary group-hover:text-white">
               <LayoutDashboard size={28} className="md:w-10 md:h-10" />
             </div>
             <div className="relative z-10 mt-auto">
               <h3 className="text-3xl md:text-4xl font-black mb-3 md:mb-4 text-white tracking-tight">Command Center</h3>
               <p className="text-base md:text-lg text-muted-foreground max-w-xl font-medium leading-relaxed">Omniscient God-mode dashboard. Process wait intervals, analytics, and active hubs in a completely modernized dark format.</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
