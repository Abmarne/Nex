"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Award, Trophy, User, Gift, Star } from "lucide-react";

type ArcadeScore = {
  id: string;
  guest_name: string;
  score: number;
  queue_id: string;
  queues: {
    name: string;
  };
};

type LoyalMember = {
  id: string;
  points: number;
  updated_at: string;
  users: {
    name: string;
    email: string;
  };
};

export default function LoyaltyProgramPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<LoyalMember[]>([]);
  const [arcadeLeaderboard, setArcadeLeaderboard] = useState<ArcadeScore[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLoyaltyData = useCallback(async () => {
    setLoading(true);
    try {
      if (!user?.id) return;
      // 1. Fetch Loyalty Members
      const { data: loyaltyData, error: loyaltyError } = await supabase
        .from("loyalty_points")
        .select(`
          *,
          users:customer_id(name, email)
        `)
        .eq("business_id", user.id)
        .order("points", { ascending: false });

      if (loyaltyError) throw loyaltyError;
      setMembers(loyaltyData as unknown as LoyalMember[] || []);

      // 2. Fetch Arcade High Scores (linked to this business's queues)
      const { data: queues } = await supabase
        .from("queues")
        .select("id")
        .eq("business_id", user.id);
      
      const queueIds = queues?.map(q => q.id) || [];
      
      if (queueIds.length > 0) {
        const { data: arcadeData, error: arcadeError } = await supabase
          .from("arcade_scores")
          .select(`
            *,
            queues(name)
          `)
          .in("queue_id", queueIds)
          .order("score", { ascending: false })
          .limit(10);
        
        if (arcadeError) throw arcadeError;
        setArcadeLeaderboard(arcadeData as unknown as ArcadeScore[] || []);
      }
    } catch (error) {
      console.error("Error fetching loyalty data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchLoyaltyData();
    }
  }, [user, fetchLoyaltyData]);

  if (loading) return <div className="p-8">Loading loyalty data...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-black tracking-tight">Loyalty Program</h2>
        <p className="text-muted-foreground font-medium">Reward your most frequent customers with a simple point system.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-none text-white shadow-xl shadow-amber-200/50">
          <CardHeader className="pb-2">
            <Trophy className="h-8 w-8 mb-2" />
            <CardTitle className="text-lg">Top Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{members[0]?.points || 0} pts</div>
            <p className="text-amber-100 font-medium">{members[0]?.users?.name || "No customers yet"}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary to-primary/80 border-none text-white shadow-xl shadow-primary/30">
          <CardHeader className="pb-2">
            <Star className="h-8 w-8 mb-2" />
            <CardTitle className="text-lg">Avg. Loyalty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">
              {members.length > 0 
                ? Math.round(members.reduce((acc, m) => acc + m.points, 0) / members.length)
                : 0} pts
            </div>
            <p className="text-primary-foreground/70 font-medium">Average across all members</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-all border-dashed border-2 flex flex-col items-center justify-center p-6 text-center group cursor-pointer">
          <Gift className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-lg">Create Reward</h4>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Coming Soon</p>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 px-2">
            <Award size={20} className="text-primary" />
            Points Leaderboard
          </h3>
          
          <div className="grid gap-3">
            {members.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 border-2 border-dashed rounded-3xl">
                <User className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-4" />
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No registered customers yet.</p>
              </div>
            ) : (
              members.map((member, index) => (
                <Card key={member.id} className="group hover:border-primary/40 transition-all shadow-sm">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black ${
                        index === 0 ? 'bg-amber-100 text-amber-600' : 
                        index === 1 ? 'bg-slate-100 text-slate-500' :
                        index === 2 ? 'bg-orange-50 text-orange-400' : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{member.users?.name}</p>
                        <p className="text-xs text-muted-foreground font-medium">{member.users?.email}</p>
                      </div>
                    </div>
                    <div className="bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
                      <span className="text-xl font-black text-primary">{member.points}</span>
                      <span className="ml-1 text-[10px] font-black uppercase tracking-tighter text-primary/70">Points</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 px-2">
            <Trophy size={20} className="text-amber-500" />
            Arcade Leaderboard
          </h3>
          
          <div className="grid gap-3">
            {arcadeLeaderboard.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 border-2 border-dashed rounded-3xl">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-4" />
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No arcade scores yet.</p>
              </div>
            ) : (
              arcadeLeaderboard.map((entry, index) => (
                <Card key={entry.id} className="group hover:border-amber-400/40 transition-all shadow-sm border-l-4 border-l-amber-500">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black ${
                        index === 0 ? 'bg-amber-500 text-white' : 
                        index === 1 ? 'bg-slate-300 text-slate-700' :
                        index === 2 ? 'bg-orange-300 text-orange-800' : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{entry.guest_name}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase bg-muted px-2 py-0.5 rounded w-fit">
                          {entry.queues?.name}
                        </p>
                      </div>
                    </div>
                    <div className="bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/20 text-right">
                      <span className="text-xl font-black text-amber-600 block leading-none">{entry.score}</span>
                      <span className="text-[10px] font-black uppercase tracking-tighter text-amber-600/70">Points</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
