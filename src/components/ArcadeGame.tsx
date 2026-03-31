"use client";

import { ArcadeScore } from "@/types/database";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Trophy, Play, Target, Award, RefreshCw } from "lucide-react";

export default function ArcadeGame({ 
  queueId, 
  tokenId, 
  guestName, 
  arcadeReward 
}: { 
  queueId: string, 
  tokenId: string, 
  guestName: string, 
  arcadeReward: string 
}) {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState<ArcadeScore[]>([]);

  const fetchLeaderboard = useCallback(async () => {
    const { data } = await supabase
      .from("arcade_scores")
      .select("*")
      .eq("queue_id", queueId)
      .order("score", { ascending: false })
      .limit(5);
    if (data) setLeaderboard(data);
  }, [queueId]);

  useEffect(() => {
    fetchLeaderboard();
    
    const channel = supabase
      .channel(`arcade-updates-${queueId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'arcade_scores', filter: `queue_id=eq.${queueId}` }, () => {
        fetchLeaderboard();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queueId, fetchLeaderboard]);

  const endGame = useCallback(async () => {
    setPlaying(false);
    setGameOver(true);
    
    // Only submit if it's > 0
    if (score > 0) {
      await supabase.from('arcade_scores').insert([{
        queue_id: queueId,
        token_id: tokenId,
        guest_name: guestName || "Guest",
        score: score
      }]);
    }
  }, [queueId, score, tokenId, guestName]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (playing && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (playing && timeLeft === 0) {
      endGame();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [playing, timeLeft, endGame]);

  function startGame() {
    setScore(0);
    setTimeLeft(10);
    setPlaying(true);
    setGameOver(false);
  }

  function handleTap() {
    if (playing && timeLeft > 0) {
      setScore(prev => prev + 1);
    }
  }

  return (
    <Card className="border-white/5 bg-[#121212]/80 backdrop-blur-2xl shadow-2xl rounded-[2rem] overflow-hidden text-white relative group w-full max-w-sm">
      <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <CardHeader className="bg-black/50 backdrop-blur-xl border-b border-white/5 pb-6 text-center relative z-10">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl font-black tracking-tight text-white mb-2">
          <div className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/30 shadow-[inset_0_0_15px_rgba(var(--color-primary),0.2)]">
            <Target size={24} />
          </div>
          Speed Tapper
        </CardTitle>
        <CardDescription className="text-muted-foreground/80 font-medium">
          Command your reflexes. Top the leaderboard.
        </CardDescription>
        {arcadeReward && (
          <div className="mt-4 bg-primary/10 p-2.5 rounded-xl border border-primary/30 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] shadow-[0_0_20px_-5px_var(--color-primary)]">
            <Award size={16} className="text-primary" />
            <span className="text-white">Bounty: <span className="text-primary">{arcadeReward}</span></span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-8 relative z-10">
        {!playing && !gameOver && (
          <div className="text-center py-6">
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-8">Execute taps in 10.00s</p>
            <Button 
              size="lg" 
              className="w-full rounded-2xl h-16 text-lg font-black uppercase tracking-widest bg-primary text-white border border-primary/50 hover:bg-primary/90 shadow-[0_0_30px_-5px_var(--color-primary)] hover:shadow-[0_0_40px_-5px_var(--color-primary)] transition-all gap-3"
              onClick={startGame}
            >
              <Play fill="currentColor" size={20} /> Initialize
            </Button>
          </div>
        )}

        {playing && (
          <div className="text-center">
            <div className="flex justify-between items-center mb-10 px-6 border border-white/5 bg-black/40 rounded-2xl p-4 shadow-inner">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Timer</p>
                <p className={`text-5xl font-black ${timeLeft <= 3 ? 'text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-primary drop-shadow-[0_0_15px_var(--color-primary)]'}`}>{timeLeft}</p>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Hits</p>
                <p className="text-5xl font-black text-white">{score}</p>
              </div>
            </div>
            
            <button 
              onClick={handleTap}
              className="w-[200px] h-[200px] mx-auto rounded-full bg-primary relative border border-primary/50 shadow-[0_15px_0_0_rgba(0,112,243,0.5),auto_auto_30px_rgba(0,112,243,0.3)] active:shadow-[0_2px_0_0_rgba(0,112,243,0.5),auto_auto_40px_rgba(0,112,243,0.6)] active:translate-y-[13px] transition-all flex items-center justify-center text-white select-none touch-manipulation overflow-hidden outline-none"
            >
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
               <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-white/20 blur-xl rounded-full pointer-events-none" />
              <span className="text-3xl font-black tracking-[0.2em] uppercase origin-center relative z-10 pointer-events-none">STRIKE</span>
            </button>
          </div>
        )}

        {gameOver && (
          <div className="text-center py-6 animate-in zoom-in duration-500">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Sequence Terminated</p>
            <p className="text-[5rem] leading-none font-black text-white drop-shadow-[0_0_20px_var(--color-primary)] mb-4">{score}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/80 mb-8 border border-primary/20 bg-primary/5 inline-block px-4 py-1.5 rounded-full">Hits Logged</p>
            
            <Button className="w-full rounded-2xl h-14 font-black uppercase tracking-widest gap-2 bg-white/5 text-white border border-white/10 hover:bg-white/10 shadow-lg transition-all" onClick={startGame}>
              <RefreshCw size={18} /> Relaunch
            </Button>
          </div>
        )}

        {/* Leaderboard */}
        <div className="mt-10 pt-8 border-t border-white/5">
          <h4 className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">
            <Trophy size={14} className="text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" /> Live Standings
          </h4>
          
          <div className="space-y-3">
            {leaderboard.length === 0 ? (
              <p className="text-[10px] tracking-widest uppercase text-center p-6 bg-black/40 border border-white/5 rounded-2xl text-muted-foreground/60 font-black">Awaiting Entries...</p>
            ) : (
              leaderboard.map((entry, idx) => (
                <div key={entry.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:bg-white/5 shadow-inner relative overflow-hidden transition-colors">
                  {idx === 0 && <div className="absolute inset-y-0 left-0 w-1 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,1)]"></div>}
                  {idx === 1 && <div className="absolute inset-y-0 left-0 w-1 bg-white/60"></div>}
                  {idx === 2 && <div className="absolute inset-y-0 left-0 w-1 bg-orange-700"></div>}
                  
                  <div className="flex items-center gap-4 pl-3">
                    <span className={`font-black text-[10px] px-2 py-0.5 rounded-md ${idx === 0 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : idx === 1 ? 'bg-white/10 text-white/80 border border-white/20' : idx === 2 ? 'bg-orange-700/20 text-orange-500 border border-orange-700/30' : 'text-muted-foreground/50'}`}>#{idx + 1}</span>
                    <span className="font-bold text-white text-sm truncate max-w-[120px]">{entry.guest_name}</span>
                  </div>
                  <span className={`font-black tracking-tighter ${idx === 0 ? 'text-amber-500' : 'text-primary'}`}>{entry.score}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
