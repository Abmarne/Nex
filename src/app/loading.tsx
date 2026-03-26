import Logo from '@/components/Logo'

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] rounded-full bg-primary/10 blur-[150px] animate-pulse pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vh] rounded-full bg-secondary/5 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center animate-in fade-in duration-700">
        <Logo size={48} className="animate-pulse shadow-2xl" />
        <p className="mt-8 text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-muted-foreground/60 animate-pulse">
          Synchronizing Hub Data
        </p>
        
        {/* Progress Bar Container */}
        <div className="mt-8 h-1 w-48 sm:w-64 bg-white/5 rounded-full overflow-hidden relative border border-white/5 shadow-inner">
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />
        </div>

        <div className="mt-12 group cursor-pointer">
          <p className="text-[10px] text-muted-foreground/30 font-bold uppercase tracking-widest text-center max-w-[200px] leading-relaxed group-hover:text-primary/40 transition-colors">
            Nex - The High-Performance Digital Queue Platform
          </p>
        </div>
      </div>
    </div>
  )
}
