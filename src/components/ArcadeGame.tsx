"use client";

import { useState, useEffect } from "react";
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
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

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
  }, [queueId]);

  useEffect(() => {
    let timer: any;
    if (playing && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (playing && timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [playing, timeLeft]);

  async function fetchLeaderboard() {
    const { data } = await supabase
      .from("arcade_scores")
      .select("*")
      .eq("queue_id", queueId)
      .order("score", { ascending: false })
      .limit(5);
    if (data) setLeaderboard(data);
  }

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

  async function endGame() {
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
  }

  return (
    <Card className="w-full max-w-sm border-2 border-indigo-200 shadow-xl overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader className="bg-indigo-600 text-white text-center pb-6">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-black">
          <Target size={28} />
          Speed Tapper
        </CardTitle>
        <CardDescription className="text-indigo-100 font-medium mt-1">
          Kill time while you wait. Top the leaderboard!
        </CardDescription>
        {arcadeReward && (
          <div className="mt-3 bg-indigo-500/50 p-2 rounded-lg border border-indigo-400/50 inline-flex items-center gap-2 text-sm font-bold shadow-inner">
            <Award size={16} className="text-yellow-300" />
            <span className="text-yellow-100">Reward: {arcadeReward}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-6">
        {!playing && !gameOver && (
          <div className="text-center py-6">
            <p className="text-lg font-bold text-indigo-900 mb-6">How fast can you tap in 10 seconds?</p>
            <Button 
              size="lg" 
              className="w-full rounded-2xl h-16 text-xl font-black bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
              onClick={startGame}
            >
              <Play fill="currentColor" className="mr-2" /> Start Challenge
            </Button>
          </div>
        )}

        {playing && (
          <div className="text-center">
            <div className="flex justify-between items-center mb-6 px-4">
              <div className="text-center">
                <p className="text-xs font-bold uppercase text-indigo-400">Time</p>
                <p className={`text-4xl font-black ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-indigo-900'}`}>{timeLeft}s</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold uppercase text-indigo-400">Score</p>
                <p className="text-4xl font-black text-indigo-900">{score}</p>
              </div>
            </div>
            
            <button 
              onClick={handleTap}
              className="w-full aspect-square max-h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-[0_10px_0_0_rgba(67,56,202,1)] active:shadow-[0_2px_0_0_rgba(67,56,202,1)] active:translate-y-2 transition-all flex items-center justify-center text-white select-none touch-manipulation"
            >
              <span className="text-4xl font-black tracking-widest uppercase opacity-80 pointer-events-none">TAP!</span>
            </button>
          </div>
        )}

        {gameOver && (
          <div className="text-center py-4 animate-in zoom-in duration-300">
            <p className="text-sm font-bold uppercase text-indigo-400 mb-1">Time's Up!</p>
            <p className="text-6xl font-black text-indigo-900 mb-2">{score}</p>
            <p className="text-sm font-medium text-indigo-600 mb-6">Taps in 10 seconds</p>
            
            <Button variant="outline" className="w-full font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={startGame}>
              <RefreshCw size={16} className="mr-2" /> Play Again
            </Button>
          </div>
        )}

        {/* Leaderboard */}
        <div className="mt-8 pt-6 border-t border-indigo-100">
          <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-indigo-800 mb-4">
            <Trophy size={16} className="text-yellow-500" /> Live Leaderboard
          </h4>
          
          <div className="space-y-2">
            {leaderboard.length === 0 ? (
              <p className="text-xs text-center p-4 bg-indigo-50/50 rounded-lg text-indigo-400 font-medium">Be the first to set a score!</p>
            ) : (
              leaderboard.map((entry, idx) => (
                <div key={entry.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-indigo-50 shadow-sm relative overflow-hidden">
                  {idx === 0 && <div className="absolute inset-y-0 left-0 w-1 bg-yellow-400"></div>}
                  {idx === 1 && <div className="absolute inset-y-0 left-0 w-1 bg-slate-300"></div>}
                  {idx === 2 && <div className="absolute inset-y-0 left-0 w-1 bg-orange-300"></div>}
                  
                  <div className="flex items-center gap-3 pl-2">
                    <span className={`font-black text-sm w-4 text-center ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-orange-400' : 'text-indigo-200'}`}>{idx + 1}</span>
                    <span className="font-bold text-indigo-900 text-sm">{entry.guest_name}</span>
                  </div>
                  <span className="font-black text-indigo-600">{entry.score}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
