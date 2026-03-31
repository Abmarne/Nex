import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Logo from '@/components/Logo'
import { Home, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground selection:bg-primary/30 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] rounded-full bg-primary/10 blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] rounded-full bg-secondary/5 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center space-y-10 animate-in fade-in zoom-in duration-500">
        <Logo size={48} className="drop-shadow-2xl" />
        
        <div className="space-y-4">
          <div className="mx-auto w-24 h-24 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 shadow-inner border border-white/5 relative group">
            <Compass size={48} className="group-hover:rotate-45 transition-transform duration-700" />
            <span className="absolute -top-4 -right-4 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl shadow-primary/30 uppercase tracking-widest animate-bounce">404</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white leading-tight">Route Not Found</h1>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed lowercase tracking-wide max-w-xs mx-auto">
            The path you&apos;ve explored doesn&apos;t exist in our hub. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 py-4">
          <Link href="/" className="w-full">
            <Button 
              className="h-14 w-full bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
            >
              <Home size={20} className="mr-2" />
              Return to Nexus
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full">
            <Button 
              variant="ghost" 
              className="h-12 w-full text-muted-foreground hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]"
            >
              Access Dashboard
            </Button>
          </Link>
        </div>

        <div className="pt-8 border-t border-white/5 w-full">
          <p className="text-[10px] text-muted-foreground/30 uppercase font-black tracking-[0.3em]">
            System: Nex | Cluster: Global
          </p>
        </div>
      </div>
    </div>
  )
}
