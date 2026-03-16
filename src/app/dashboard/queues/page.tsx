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
    if (!confirm("Are you sure you want to delete this queue? All tokens and data associated with it will be permanently removed.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("queues")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setQueues(queues.filter(q => q.id !== id));
    } catch (error) {
      console.error("Error deleting queue:", error);
      alert("Failed to delete queue. Please try again.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Queues</h2>
          <p className="text-muted-foreground">Manage your existing queues or create a new one.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={18} />
          Create Queue
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Queue</CardTitle>
            <CardDescription>Configure your new digital queue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createQueue} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">Queue Name</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="e.g. Walk-ins, Consultation, Haircuts"
                  value={newQueueName}
                  onChange={(e) => setNewQueueName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-muted">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="party_size_toggle"
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                    checked={requirePartySize}
                    onChange={(e) => setRequirePartySize(e.target.checked)}
                  />
                  <label htmlFor="party_size_toggle" className="text-sm font-bold flex items-center gap-2 cursor-pointer">
                    Require Party Size (e.g. for Restaurants)
                  </label>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="arcade_toggle"
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                    checked={arcadeEnabled}
                    onChange={(e) => setArcadeEnabled(e.target.checked)}
                  />
                  <label htmlFor="arcade_toggle" className="text-sm font-bold flex items-center gap-2 cursor-pointer">
                    Enable Queue Arcade Mini-Game
                    <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">Wow Factor</span>
                  </label>
                </div>
                {arcadeEnabled && (
                  <div className="pt-2 pl-6 animate-in slide-in-from-top-2">
                    <label className="text-xs font-bold opacity-70 block mb-1">Arcade High Score Reward (Optional)</label>
                    <input
                      className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
                      placeholder="e.g. Free Coffee, 10% Discount"
                      value={arcadeReward}
                      onChange={(e) => setArcadeReward(e.target.value)}
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Customers can play "Speed Tapper" while waiting. The leaderboard creates an engaging wait experience!</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4 bg-violet-50 rounded-lg border border-violet-100">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="preboarding_toggle"
                    className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
                    checked={preboardingEnabled}
                    onChange={(e) => setPreboardingEnabled(e.target.checked)}
                  />
                  <label htmlFor="preboarding_toggle" className="text-sm font-bold flex items-center gap-2 cursor-pointer">
                    Enable Pre-boarding Form
                    <span className="bg-violet-600 text-white text-[10px] px-2 py-0.5 rounded-full">Time Saver</span>
                  </label>
                </div>
                {preboardingEnabled && (
                  <div className="pt-2 pl-6 space-y-3 animate-in slide-in-from-top-2">
                    <p className="text-[10px] text-muted-foreground">Customers fill these out while waiting. Responses are attached to their token for your staff.</p>
                    
                    {preboardingFields.map((field, idx) => (
                      <div key={field.id} className="flex items-start gap-2 p-2 bg-white rounded-md border border-violet-100">
                        <div className="flex-1 space-y-1">
                          <input
                            className="w-full bg-transparent text-sm font-medium border-b border-dashed focus:outline-none focus:border-violet-400 pb-0.5"
                            value={field.label}
                            placeholder="Field label"
                            onChange={(e) => {
                              const updated = [...preboardingFields];
                              updated[idx].label = e.target.value;
                              setPreboardingFields(updated);
                            }}
                          />
                          <div className="flex gap-2">
                            <select
                              className="text-xs bg-violet-50 border border-violet-100 rounded px-1 py-0.5"
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
                            <label className="flex items-center gap-1 text-xs">
                              <input type="checkbox" checked={field.required || false} onChange={(e) => {
                                const updated = [...preboardingFields];
                                updated[idx].required = e.target.checked;
                                setPreboardingFields(updated);
                              }} />
                              Required
                            </label>
                          </div>
                          {field.type === 'select' && (
                            <input
                              className="w-full text-xs bg-transparent border-b border-dashed focus:outline-none focus:border-violet-400"
                              placeholder="Comma-separated options (e.g. Coffee,Tea,Juice)"
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
                          className="text-red-400 hover:text-red-600 p-0.5"
                          onClick={() => setPreboardingFields(preboardingFields.filter((_, i) => i !== idx))}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full border-dashed border-violet-300 text-violet-600 hover:bg-violet-50 gap-1"
                      onClick={() => setPreboardingFields([...preboardingFields, { id: `field_${Date.now()}`, label: '', type: 'text' }])}
                    >
                      <Plus size={14} /> Add Form Field
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="charity_toggle"
                    className="w-4 h-4 rounded text-yellow-600 focus:ring-yellow-500"
                    checked={charityEnabled}
                    onChange={(e) => setCharityEnabled(e.target.checked)}
                  />
                  <label htmlFor="charity_toggle" className="text-sm font-bold flex items-center gap-2 cursor-pointer text-yellow-900">
                    Enable Charity "Fast Pass"
                    <span className="bg-yellow-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase">For Good 💛</span>
                  </label>
                </div>
                {charityEnabled && (
                  <div className="pt-2 pl-6 space-y-3 animate-in slide-in-from-top-2">
                    <p className="text-[10px] text-yellow-800 font-medium">Allow customers to skip 3 spots by making a micro-donation. You verify the receipt on your dashboard!</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-yellow-700">Charity Name</label>
                        <input
                          className="flex h-8 w-full rounded-md border border-yellow-200 bg-white px-3 text-xs"
                          placeholder="e.g. Red Cross"
                          value={charityName}
                          onChange={(e) => setCharityName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-yellow-700">Min. Donation (₹)</label>
                        <input
                          type="number"
                          className="flex h-8 w-full rounded-md border border-yellow-200 bg-white px-3 text-xs"
                          value={charityAmount}
                          onChange={(e) => setCharityAmount(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-yellow-700">Donation Link (e.g. Website/UPI Page)</label>
                      <input
                        className="flex h-8 w-full rounded-md border border-yellow-200 bg-white px-3 text-xs"
                        placeholder="https://charity.org/donate"
                        value={charityLink}
                        onChange={(e) => setCharityLink(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={!newQueueName.trim()}>Create Queue</Button>
                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {loading ? (
          <p>Loading queues...</p>
        ) : queues.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No queues found. Create your first queue to get started!</p>
        ) : (
          queues.map((queue) => (
            <Card key={queue.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${queue.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <ListOrdered size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{queue.name}</h3>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                      {queue.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/queues/${queue.id}`}>
                    <Button variant="outline" className="gap-2">
                      <ExternalLink size={16} />
                      Live Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleQueueStatus(queue.id, queue.status)}
                    title={queue.status === 'active' ? 'Close Queue' : 'Open Queue'}
                  >
                    {queue.status === 'active' ? <Square size={18} className="fill-current" /> : <Play size={18} className="fill-current" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => deleteQueue(queue.id)}
                    title="Delete Queue"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
