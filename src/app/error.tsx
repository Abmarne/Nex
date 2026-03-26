'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Logo from '@/components/Logo'
import { AlertCircle, RefreshCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an observability provider (like Sentry)
    console.error('Root Error Boundary caught:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground selection:bg-primary/30 relative overflow-hidden">
      {/* Immersive Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] rounded-full bg-primary/5 blur-[150px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <Logo size={48} className="drop-shadow-2xl" />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-4 shadow-inner shadow-destructive/5">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white leading-tight">System Interruption</h1>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed lowercase tracking-wide">
            An unexpected glitch occurred in the matrix. Our systems have logged this event for analysis.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 py-4">
          <Button 
            onClick={() => reset()}
            className="h-14 w-full bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <RefreshCcw size={20} className="mr-2" />
            Resume Operation
          </Button>
          <Button 
            variant="ghost" 
            className="h-12 w-full text-muted-foreground hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]"
            onClick={() => window.location.href = '/'}
          >
            Terminal Exit (Return Home)
          </Button>
        </div>

        <div className="pt-8 border-t border-white/5 w-full">
          <p className="text-[10px] text-muted-foreground/30 uppercase font-black tracking-[0.3em]">
            Error Hash: {error.digest || 'anonymous_fault'}
          </p>
        </div>
      </div>
    </div>
  )
}
