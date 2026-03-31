import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Zap, Moon } from "lucide-react";
import { Token } from "@/types/database";

interface InteractionPanelProps {
  notificationsEnabled: boolean;
  requestNotificationPermission: () => void;
  position: number | null;
  token: Token;
  snoozeQueue: () => void;
  snoozing: boolean;
  leaveQueue: () => void;
}

export function InteractionPanel({
  notificationsEnabled,
  requestNotificationPermission,
  position,
  token,
  snoozeQueue,
  snoozing,
  leaveQueue,
}: InteractionPanelProps) {
  return (
    <Card className="w-full max-w-sm bg-[#121212]/80 backdrop-blur-xl border-white/5 rounded-3xl overflow-hidden mt-4 shadow-xl">
      <CardContent className="p-6 text-center space-y-5">
        <div className="flex items-center justify-center gap-2 text-primary/70 animate-pulse bg-primary/5 p-2 rounded-lg">
          <RefreshCw size={14} />
          <span className="text-xs font-bold uppercase tracking-widest">Live Sync Active</span>
        </div>
        
        {!notificationsEnabled && (
          <Button 
            className="w-full gap-2 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white rounded-xl h-12 shadow-sm font-bold tracking-wide transition-all"
            onClick={requestNotificationPermission}
          >
            <Zap size={16} className="text-primary" />
            Enable Push Alerts
          </Button>
        )}

        <p className="text-xs text-muted-foreground/50 font-medium">
          We&apos;ll alert you when it&apos;s almost your turn. You can close your phone.
        </p>
      </CardContent>
      
      <div className="border-t border-white/5 p-4 flex flex-col gap-3 bg-black/20">
        {/* Snooze Button */}
        {position !== null && position > 3 && (token.snooze_count ?? 0) < 2 && (
          <Button
            variant="outline"
            className="w-full gap-2 border-white/5 bg-transparent text-muted-foreground hover:bg-white/5 hover:text-white rounded-xl h-11"
            onClick={snoozeQueue}
            disabled={snoozing}
          >
            <Moon size={16} />
            {snoozing ? "Snoozing..." : `Pause & Step Back (${2 - (token.snooze_count ?? 0)} left)`}
          </Button>
        )}
        
        <Button variant="ghost" className="w-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-xl h-11 font-bold tracking-wide" onClick={leaveQueue}>
          Abandon Line
        </Button>
      </div>
    </Card>
  );
}
