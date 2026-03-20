"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle2, XCircle, Share2, ArrowLeft, ClipboardList, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

type Token = {
  id: string;
  position: number;
  status: 'waiting' | 'served' | 'left';
  source: 'digital' | 'walk-in';
  created_at: string;
  customer_id: string | null;
  guest_name: string | null;
  customer_email: string | null;
  party_size: number;
  snooze_count: number;
  preboarding_data: Record<string, string> | null;
  users?: {
    name: string;
  };
};

type Queue = {
  id: string;
  name: string;
  status: 'active' | 'closed';
  require_party_size: boolean;
  preboarding_enabled: boolean;
  preboarding_fields: {id: string; label: string; type: string}[];
};

export default function QueueDashboardPage() {
  const { id } = useParams();
  const [queue, setQueue] = useState<Queue | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualPartySize, setManualPartySize] = useState("1");
  const [addingManual, setAddingManual] = useState(false);
  const [expandedToken, setExpandedToken] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchQueueData();
      
      // Subscribe to real-time updates for tokens in this queue
      const channel = supabase
        .channel(`queue-${id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tokens', filter: `queue_id=eq.${id}` },
          () => {
            fetchTokens();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id]);

  async function fetchQueueData() {
    setLoading(true);
    try {
      const { data: queueData, error: queueError } = await supabase
        .from("queues")
        .select("*")
        .eq("id", id)
        .single();

      if (queueError) throw queueError;
      setQueue(queueData);

      await fetchTokens();
    } catch (error) {
      console.error("Error fetching queue data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTokens() {
    try {
      // Fetch token with associated user data if it exists
      const { data, error } = await supabase
        .from("tokens")
        .select(`
          *,
          users:customer_id(name)
        `)
        .eq("queue_id", id)
        .in("status", ["waiting", "served"])
        .order("position", { ascending: true });

      if (error) throw error;
      console.log("Tokens fetched for dashboard:", data?.[0]); 
      setTokens(data || []);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  }

  async function updateTokenStatus(tokenId: string, status: 'served' | 'left') {
    try {
      // Get the token's position before updating
      const currentToken = tokens.find(t => t.id === tokenId);
      
      const { error } = await supabase
        .from("tokens")
        .update({ 
          status,
          served_at: status === 'served' ? new Date().toISOString() : null
        })
        .eq("id", tokenId);

      if (error) throw error;
      
      // Real-time subscription handles UI updates
      setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, status } : t));
    } catch (error) {
      console.error("Error updating token status:", error);
    }
  }


  async function addManualCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!manualName.trim()) return;
    
    setAddingManual(true);
    try {
      // Calculate next position
      const lastTokenPosition = tokens.length > 0 
        ? Math.max(...tokens.map(t => t.position)) 
        : 0;
      const nextPosition = lastTokenPosition + 1;

      const { data, error } = await supabase
        .from("tokens")
        .insert([{
          queue_id: id,
          guest_name: manualName,
          party_size: parseInt(manualPartySize) || 1,
          position: nextPosition,
          status: 'waiting',
          source: 'walk-in'
        }])
        .select()
        .single();

      if (error) throw error;
      
      setManualName("");
      setManualPartySize("1");
      // Real-time subscription will handle the UI update, but we can do it optimistically too
      setTokens(prev => [...prev, data]);
    } catch (error) {
      console.error("Error adding manual customer:", error);
    } finally {
      setAddingManual(false);
    }
  }

  if (loading) return <div className="p-8">Loading queue details...</div>;
  if (!queue) return <div className="p-8 text-destructive">Queue not found.</div>;

  const waitingTokens = tokens.filter(t => t.status === 'waiting');
  const servedTokens = tokens.filter(t => t.status === 'served');
  const joinUrl = `${window.location.origin}/join/${queue.id}`;

  return (
    <div className="space-y-8 relative pb-24">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] rounded-full bg-secondary/5 blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/queues">
            <Button variant="ghost" size="icon" className="hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 rounded-xl">
              <ArrowLeft size={20} className="text-muted-foreground hover:text-white" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">{queue.name}</h2>
            <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold flex items-center gap-2 mt-1">
               <span className={`h-2 w-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${queue.status === 'active' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-destructive shadow-destructive/50'}`} />
               {queue.status}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-white/10 bg-black/20 hover:bg-white/5 hover:border-white/20 transition-all rounded-xl shadow-sm" onClick={() => setShowQR(!showQR)}>
            <Share2 size={16} />
            <span className="hidden sm:inline">{showQR ? "Hide QR" : "Show QR"}</span>
          </Button>
        </div>
      </div>

      {showQR && (
        <Card className="max-w-md mx-auto border-white/10 bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 pointer-events-none" />
          <CardHeader className="text-center relative z-10 border-b border-white/5 pb-6">
            <CardTitle className="text-white">Customer Join Link</CardTitle>
            <CardDescription>Customers scan this QR to join instantly.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 pt-6 relative z-10">
            <div className="p-4 bg-white rounded-2xl shadow-xl border border-white/20">
              <QRCodeSVG value={joinUrl} size={200} />
            </div>
            <p className="text-xs font-mono bg-black/60 text-muted-foreground p-3 rounded-xl break-all border border-white/5 w-full text-center">{joinUrl}</p>
          </CardContent>
        </Card>
      )}

      {/* Bento Grid */}
      <div className="grid gap-6 md:grid-cols-12 auto-rows-min">
        
        {/* Waiting List - spanning 8 columns */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-2">
              <Users size={16} className="text-primary" />
              Waiting ({waitingTokens.length})
            </h3>
          </div>
          
          <Card className="border-white/5 bg-[#121212]/80 backdrop-blur-md overflow-hidden rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={addManualCustomer} className="flex gap-3 mb-6 relative z-10">
                <input 
                  type="text" 
                  placeholder="Add walk-in name..." 
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white transition-all placeholder:text-muted-foreground/50"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  disabled={addingManual}
                />
                {queue?.require_party_size && (
                  <input 
                    type="number" 
                    placeholder="Size" 
                    className="w-20 md:w-24 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white transition-all"
                    min="1"
                    value={manualPartySize}
                    onChange={(e) => setManualPartySize(e.target.value)}
                    disabled={addingManual}
                  />
                )}
                <Button className="h-auto rounded-xl px-6 font-bold tracking-wide shadow-[0_0_20px_-5px_var(--color-primary)] hover:shadow-[0_0_30px_-5px_var(--color-primary)] transition-all bg-primary hover:bg-primary/90 text-white" type="submit" disabled={addingManual || !manualName.trim()}>
                  {addingManual ? "..." : "Add"}
                </Button>
              </form>

              <div className="space-y-3">
                {waitingTokens.length === 0 ? (
                  <div className="py-16 text-center text-muted-foreground/50 border border-dashed border-white/5 rounded-xl bg-black/20 flex flex-col items-center gap-3">
                    <Users size={32} className="opacity-20" />
                    <p className="text-sm font-medium tracking-wide">The queue is empty.</p>
                  </div>
                ) : (
                  waitingTokens.map((token, index) => (
                    <div key={token.id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-xl border border-white/5 bg-black/40 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 gap-4 sm:gap-0">
                      {/* Active glowing indicator for first person */}
                      {index === 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full shadow-[0_0_10px_var(--color-primary)]" />}
                      
                      <div className="flex items-center gap-4 sm:gap-6 pl-2">
                        <span className={`text-3xl sm:text-4xl font-black tabular-nums tracking-tighter ${index === 0 ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'text-muted-foreground/40'}`}>#{token.position}</span>
                        <div className="flex flex-col">
                          <span className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                            {(() => {
                              const profileName = Array.isArray(token.users) 
                                ? token.users[0]?.name 
                                : (token.users as any)?.name;
                              return token.guest_name || profileName || "Guest Customer";
                            })()}
                          </span>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="text-[9px] sm:text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest bg-white/5 px-1.5 py-0.5 rounded">
                              {token.source === 'walk-in' ? "Walk-in" : "Digital"}
                            </span>
                            {queue?.require_party_size && token.party_size > 0 && (
                              <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase tracking-widest">
                                <Users size={10} /> {token.party_size}
                              </span>
                            )}
                            {token.snooze_count > 0 && (
                              <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-secondary bg-secondary/10 px-1.5 py-0.5 rounded uppercase tracking-widest">
                                Snoozed x{token.snooze_count}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full sm:w-auto mt-2 sm:mt-0">
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg h-10 w-10 sm:h-9 sm:w-9 p-0" onClick={() => updateTokenStatus(token.id, 'left')}>
                          <XCircle size={18} />
                        </Button>
                        <Button size="sm" className="bg-white text-black hover:bg-white/90 gap-1 rounded-lg h-10 sm:h-9 px-4 sm:px-5 font-bold tracking-wide w-full sm:w-auto" onClick={() => updateTokenStatus(token.id, 'served')}>
                          Serve
                        </Button>
                      </div>
                      
                      {/* Preboarding Info - visible below on expand */}
                      {queue?.preboarding_enabled && token.preboarding_data && (
                        <div className="absolute right-4 top-4">
                           <button
                             type="button"
                             className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md transition-colors uppercase tracking-widest"
                             onClick={() => setExpandedToken(expandedToken === token.id ? null : token.id)}
                           >
                             <ClipboardList size={12} /> Data
                             {expandedToken === token.id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                           </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Panel - spanning 4 columns */}
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-2">
              <Zap size={16} className="text-secondary" />
              Control Center
            </h3>
          </div>

          {/* Currently Serving Hero Card */}
          <Card className="border-white/5 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl overflow-hidden rounded-2xl relative shadow-lg">
             <div className="absolute -top-10 -right-10 p-8 opacity-[0.03]"><Zap size={150} /></div>
             <CardContent className="p-8 flex flex-col items-center justify-center min-h-[250px] relative z-10 text-center">
               <span className="text-[10px] uppercase tracking-widest font-bold text-primary mb-2 bg-primary/10 px-3 py-1 rounded-full">Currently Serving</span>
               <span className={`text-[6rem] sm:text-[7rem] font-black text-white drop-shadow-[0_0_40px_rgba(0,112,243,0.3)] tracking-tighter leading-none ${!waitingTokens[0] && 'opacity-20 drop-shadow-none text-muted-foreground'}`}>
                 {waitingTokens[0] ? `#${waitingTokens[0].position}` : "—"}
               </span>
               <p className="text-base text-white/70 mt-4 font-medium tracking-tight">
                 {waitingTokens[0] ? (waitingTokens[0].guest_name || (waitingTokens[0].users as any)?.name || "Guest Customer") : "Queue is Empty"}
               </p>
               {waitingTokens[0] && (
                 <Button className="mt-6 w-full rounded-xl font-bold tracking-wide bg-white text-black hover:bg-white/90" size="lg" onClick={() => updateTokenStatus(waitingTokens[0].id, 'served')}>
                    Complete & Next
                 </Button>
               )}
             </CardContent>
          </Card>

          {/* Actually served list */}
          <Card className="border-white/5 bg-[#121212]/50 backdrop-blur-sm rounded-2xl">
            <CardContent className="p-5 space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground block mb-4 pl-1 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-500/70" /> Recently Served
              </span>
              {servedTokens.slice(-5).reverse().map((token) => (
                <div key={token.id} className="flex flex-col px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black text-white/30 group-hover:text-white/50 transition-colors">#{token.position}</span>
                      <span className="text-sm font-medium text-white/70 line-clamp-1 group-hover:text-white transition-colors">
                        {token.guest_name || (token.users as any)?.name || "Guest"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {servedTokens.length === 0 && <p className="text-xs text-muted-foreground/30 py-6 text-center font-medium">No one served yet.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
