"use client";

import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ListOrdered, Play, Square, ExternalLink, Trash2, X } from "lucide-react";
import Link from "next/link";

type Queue = {
  id: string;
  name: string;
  status: 'active' | 'closed';
  created_at: string;
  arcade_enabled: boolean;
  arcade_reward: string | null;
  require_party_size: boolean;
  preboarding_enabled: boolean;
  preboarding_fields: any[];
  charity_fastpass_enabled: boolean;
  charity_name: string | null;
  charity_link: string | null;
  charity_amount: number;
};

export default function QueuesPage() {
  const { user } = useAuth();
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newQueueName, setNewQueueName] = useState("");
  const [arcadeEnabled, setArcadeEnabled] = useState(false);
  const [arcadeReward, setArcadeReward] = useState("");
  const [requirePartySize, setRequirePartySize] = useState(false);
  const [preboardingEnabled, setPreboardingEnabled] = useState(false);
  const [preboardingFields, setPreboardingFields] = useState<{id: string; label: string; type: string; options?: string[]; required?: boolean}[]>([]);
  const [charityEnabled, setCharityEnabled] = useState(false);
  const [charityName, setCharityName] = useState("");
  const [charityLink, setCharityLink] = useState("");
  const [charityAmount, setCharityAmount] = useState(50);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchQueues();
    }
  }, [user]);

  async function fetchQueues() {
    try {
      const { data, error } = await supabase
        .from("queues")
        .select("*")
        .eq("business_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQueues(data || []);
    } catch (error) {
      console.error("Error fetching queues:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createQueue(e: React.FormEvent) {
    e.preventDefault();
    if (!newQueueName.trim()) return;

    try {
      const { data, error } = await supabase
        .from("queues")
        .insert([
          { 
            business_id: user?.id, 
            name: newQueueName, 
            status: "active",
            arcade_enabled: arcadeEnabled,
            arcade_reward: arcadeEnabled ? arcadeReward : null,
            require_party_size: requirePartySize,
            preboarding_enabled: preboardingEnabled,
            preboarding_fields: preboardingEnabled ? preboardingFields : [],
            charity_fastpass_enabled: charityEnabled,
            charity_name: charityEnabled ? charityName : null,
            charity_link: charityEnabled ? charityLink : null,
            charity_amount: charityAmount
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setQueues([data, ...queues]);
      setNewQueueName("");
      setArcadeEnabled(false);
      setArcadeReward("");
      setRequirePartySize(false);
      setPreboardingFields([]);
      setCharityEnabled(false);
      setCharityName("");
      setCharityLink("");
      setCharityAmount(50);
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating queue:", error);
    }
  }

  async function toggleQueueStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "closed" : "active";
    try {
      const { error } = await supabase
        .from("queues")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      setQueues(queues.map(q => q.id === id ? { ...q, status: newStatus as any } : q));
    } catch (error) {
      console.error("Error updating queue status:", error);
    }
  }

  async function deleteQueue(id: string) {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("queues")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setQueues(prev => prev.filter(q => q.id !== id));
      alert("Queue deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting queue:", error);
      alert(`Failed to delete queue: ${error.message || "Unknown error"}`);
    } finally {
      setIsDeleting(false);
      setConfirmDeleteId(null);
    }
  }

  return (
    <div className="space-y-8 relative pb-24 border-none">
      {/* Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vh] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vh] rounded-full bg-secondary/5 blur-[120px] pointer-events-none -z-10" />

      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-white mb-2">My Queues</h2>
          <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Manage your active hubs or launch a new one.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2 bg-primary hover:bg-primary/90 text-white font-bold tracking-wide rounded-xl shadow-[0_0_20px_-5px_var(--color-primary)] hover:shadow-[0_0_30px_-5px_var(--color-primary)] transition-all h-12 px-6">
          <Plus size={18} />
          Launch Queue
        </Button>
      </div>

      {isCreating && (
        <Card className="border-white/10 bg-[#121212]/90 backdrop-blur-xl rounded-3xl shadow-2xl relative overflow-hidden animate-in slide-in-from-top-4 fade-in duration-500">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <CardHeader className="border-b border-white/5 pb-6">
            <CardTitle className="text-2xl font-black text-white">Create New Queue</CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Configure your new digital terminal.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={createQueue} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Queue Name</label>
                <input
                  className="flex h-12 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white shadow-inner transition-colors placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/50"
                  placeholder="e.g. Walk-ins, VIP Lounge, Main Entrance"
                  value={newQueueName}
                  onChange={(e) => setNewQueueName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-3 p-5 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="party_size_toggle"
                    className="w-5 h-5 rounded border-white/20 bg-black/50 text-primary focus:ring-primary focus:ring-offset-background"
                    checked={requirePartySize}
                    onChange={(e) => setRequirePartySize(e.target.checked)}
                  />
                  <label htmlFor="party_size_toggle" className="text-sm font-bold text-white flex flex-col cursor-pointer select-none">
                    <span>Require Party Size</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Useful for restaurants or groups</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3 p-5 bg-primary/5 rounded-2xl border border-primary/20 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="arcade_toggle"
                    className="w-5 h-5 rounded border-primary/30 bg-black/50 text-primary focus:ring-primary focus:ring-offset-background"
                    checked={arcadeEnabled}
                    onChange={(e) => setArcadeEnabled(e.target.checked)}
                  />
                  <label htmlFor="arcade_toggle" className="text-sm font-bold text-white flex items-center gap-3 cursor-pointer select-none">
                    <span>Enable Arcade Mini-Game</span>
                    <span className="bg-primary/20 text-primary border border-primary/30 text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-widest">Wow Factor</span>
                  </label>
                </div>
                {arcadeEnabled && (
                  <div className="pt-4 pl-8 animate-in slide-in-from-top-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary/70 block mb-2">Arcade High Score Reward (Optional)</label>
                    <input
                      className="flex h-10 w-full rounded-xl border border-primary/20 bg-black/50 px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                      placeholder="e.g. Free Coffee, 10% Discount"
                      value={arcadeReward}
                      onChange={(e) => setArcadeReward(e.target.value)}
                    />
                    <p className="text-[10px] text-primary/60 mt-2 font-medium">Customers can play "Speed Tapper" while waiting.</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-5 bg-secondary/5 rounded-2xl border border-secondary/20 hover:border-secondary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="preboarding_toggle"
                    className="w-5 h-5 rounded border-secondary/30 bg-black/50 text-secondary focus:ring-secondary focus:ring-offset-background"
                    checked={preboardingEnabled}
                    onChange={(e) => setPreboardingEnabled(e.target.checked)}
                  />
                  <label htmlFor="preboarding_toggle" className="text-sm font-bold text-white flex items-center gap-3 cursor-pointer select-none">
                    <span>Enable Pre-boarding Form</span>
                    <span className="bg-secondary/20 text-secondary border border-secondary/30 text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-widest">Time Saver</span>
                  </label>
                </div>
                {preboardingEnabled && (
                  <div className="pt-4 pl-8 space-y-4 animate-in slide-in-from-top-2">
                    <p className="text-[10px] text-secondary/70 font-medium">Gather info instantly while they wait.</p>
                    
                    {preboardingFields.map((field, idx) => (
                      <div key={field.id} className="flex items-start gap-3 p-4 bg-black/50 rounded-xl border border-secondary/20 relative group">
                        <div className="flex-1 space-y-3">
                          <input
                            className="w-full bg-transparent text-sm font-bold text-white border-b border-dashed border-secondary/30 focus:outline-none focus:border-secondary/60 pb-1"
                            value={field.label}
                            placeholder="Data Field Label"
                            onChange={(e) => {
                              const updated = [...preboardingFields];
                              updated[idx].label = e.target.value;
                              setPreboardingFields(updated);
                            }}
                          />
                          <div className="flex gap-4 items-center">
                            <select
                              className="text-xs bg-secondary/10 text-secondary font-bold border border-secondary/20 rounded-lg px-2 py-1 outline-none"
                              value={field.type}
                              onChange={(e) => {
                                const updated = [...preboardingFields];
                                updated[idx].type = e.target.value;
                                if (e.target.value === 'select') updated[idx].options = ['Option 1'];
                                setPreboardingFields(updated);
                              }}
                            >
                              <option value="text">Short Text</option>
                              <option value="textarea">Long Text</option>
                              <option value="select">Dropdown</option>
                            </select>
                            <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground select-none cursor-pointer">
                              <input type="checkbox" className="rounded border-white/20 bg-black text-secondary" checked={field.required || false} onChange={(e) => {
                                const updated = [...preboardingFields];
                                updated[idx].required = e.target.checked;
                                setPreboardingFields(updated);
                              }} />
                              Required
                            </label>
                          </div>
                          {field.type === 'select' && (
                            <input
                              className="w-full text-xs bg-transparent border-b border-dashed border-secondary/30 text-white focus:outline-none focus:border-secondary/60 pb-1"
                              placeholder="Comma-separated options (e.g. Small,Medium,Large)"
                              value={field.options?.join(',') || ''}
                              onChange={(e) => {
                                const updated = [...preboardingFields];
                                updated[idx].options = e.target.value.split(',').map(s => s.trim());
                                setPreboardingFields(updated);
                              }}
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setPreboardingFields(preboardingFields.filter((_, i) => i !== idx))}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full border-dashed border-secondary/40 text-secondary hover:bg-secondary/10 hover:text-secondary hover:border-secondary gap-2 h-10 rounded-xl"
                      onClick={() => setPreboardingFields([...preboardingFields, { id: `field_${Date.now()}`, label: '', type: 'text' }])}
                    >
                      <Plus size={14} /> Add Custom Field
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-5 bg-amber-500/5 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="charity_toggle"
                    className="w-5 h-5 rounded border-amber-500/30 bg-black/50 text-amber-500 focus:ring-amber-500 focus:ring-offset-background"
                    checked={charityEnabled}
                    onChange={(e) => setCharityEnabled(e.target.checked)}
                  />
                  <label htmlFor="charity_toggle" className="text-sm font-bold text-amber-500 flex items-center gap-3 cursor-pointer select-none">
                    <span>Charity Fast Pass</span>
                    <span className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-widest">For Good</span>
                  </label>
                </div>
                {charityEnabled && (
                  <div className="pt-4 pl-8 space-y-4 animate-in slide-in-from-top-2">
                    <p className="text-[10px] text-amber-500/70 font-medium">Skip 3 spots with a verified donation.</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-amber-500/80 tracking-widest">Charity Name</label>
                        <input
                          className="flex h-10 w-full rounded-xl border border-amber-500/20 bg-black/50 px-3 text-sm text-white focus:outline-none focus:border-amber-500/50"
                          placeholder="e.g. Red Cross"
                          value={charityName}
                          onChange={(e) => setCharityName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-amber-500/80 tracking-widest">Min. Donation (₹)</label>
                        <input
                          type="number"
                          className="flex h-10 w-full rounded-xl border border-amber-500/20 bg-black/50 px-3 text-sm text-white focus:outline-none focus:border-amber-500/50"
                          value={charityAmount}
                          onChange={(e) => setCharityAmount(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-amber-500/80 tracking-widest">Payment Link</label>
                      <input
                        className="flex h-10 w-full rounded-xl border border-amber-500/20 bg-black/50 px-3 text-sm text-white focus:outline-none focus:border-amber-500/50"
                        placeholder="https://donate.url"
                        value={charityLink}
                        onChange={(e) => setCharityLink(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-6 border-t border-white/5">
                <Button type="submit" disabled={!newQueueName.trim()} className="bg-white text-black hover:bg-white/90 font-bold px-8 h-12 rounded-xl">Initialize Terminal</Button>
                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)} className="h-12 rounded-xl hover:bg-white/5">Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-20">
             <div className="w-8 h-8 rounded-full border-t-2 border-primary border-r-2 animate-spin mx-auto mb-4" />
             <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">Scanning Terminals...</p>
          </div>
        ) : queues.length === 0 ? (
          <p className="text-center py-20 text-muted-foreground/50 border border-dashed border-white/10 rounded-3xl bg-black/20 text-sm font-medium tracking-wide">No terminals deployed. Initialize your first queue.</p>
        ) : (
          queues.map((queue) => (
            <Card key={queue.id} className="border-white/5 bg-[#121212]/80 backdrop-blur-md rounded-2xl hover:border-white/10 hover:bg-[#121212] transition-all duration-300 group shadow-lg overflow-hidden">
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-6 relative">
                {/* Active Status Glow indicator */}
                {queue.status === 'active' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-emerald-500 rounded-r-full shadow-[0_0_15px_var(--color-emerald-500)]" />}
                
                <div className="flex items-center gap-5 sm:pl-2">
                  <div className={`p-4 rounded-xl flex-shrink-0 relative overflow-hidden ${queue.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-current to-transparent opacity-10" />
                    <ListOrdered size={28} className="relative z-10" />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl text-white tracking-tight">{queue.name}</h3>
                    <div className="flex gap-2 items-center mt-1">
                      <p className={`text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-sm ${queue.status === 'active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                        {queue.status}
                      </p>
                      {queue.arcade_enabled && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-sm font-black uppercase tracking-widest">Minigame</span>}
                      {queue.preboarding_enabled && <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded-sm font-black uppercase tracking-widest">Forms</span>}
                      {queue.charity_fastpass_enabled && <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-sm font-black uppercase tracking-widest">Good</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Link href={`/dashboard/queues/${queue.id}`} className="flex-1 sm:flex-none">
                    <Button variant="outline" className="gap-2 w-full border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl h-11 font-bold tracking-wide transition-all shadow-sm">
                      <ExternalLink size={16} />
                      Terminal
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-11 w-11 rounded-xl border border-transparent shadow-sm ${queue.status === 'active' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:border-red-500/30' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:border-emerald-500/30'}`}
                    onClick={() => toggleQueueStatus(queue.id, queue.status)}
                    title={queue.status === 'active' ? 'Close Queue' : 'Open Queue'}
                  >
                    {queue.status === 'active' ? <Square size={18} className="fill-current" /> : <Play size={18} className="fill-current" />}
                  </Button>
                  
                  {confirmDeleteId === queue.id ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 ml-2 bg-red-500/10 border border-red-500/20 p-1.5 rounded-xl">
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest pl-2">Burn?</span>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="h-8 px-3 rounded-lg text-[10px] font-bold"
                        disabled={isDeleting}
                        onClick={() => deleteQueue(queue.id)}
                      >
                        {isDeleting ? "..." : "YES"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 px-2 rounded-lg text-[10px] text-white hover:bg-white/10 font-bold"
                        disabled={isDeleting}
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        NO
                      </Button>
                    </div>
                  ) : (
                    <div className="ml-2">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-11 w-11 rounded-xl text-muted-foreground/50 hover:bg-red-500/10 hover:text-red-500 transition-colors group/del"
                         onClick={() => setConfirmDeleteId(queue.id)}
                       >
                         <Trash2 size={18} className="group-hover/del:scale-110 transition-transform" />
                       </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
