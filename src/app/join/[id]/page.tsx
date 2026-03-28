"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import Logo from "@/components/Logo";
import Link from "next/link";
import { joinQueueAction, scheduleAppointmentAction } from "../actions";
import { Copy, Check } from "lucide-react";

interface BusinessInfo {
  name: string | null;
  business_name: string | null;
  address: string | null;
  phone: string | null;
  bio: string | null;
  website: string | null;
}

interface QueueData {
  id: string;
  name: string;
  status: 'active' | 'closed';
  require_party_size?: boolean;
  business_id: string;
  users?: BusinessInfo;
}

export default function JoinQueuePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [queue, setQueue] = useState<QueueData | null>(null);
  const [mode, setMode] = useState<'join' | 'schedule'>('join');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [partySize, setPartySize] = useState("1");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledHour, setScheduledHour] = useState("12");
  const [scheduledMinute, setScheduledMinute] = useState("00");
  const [scheduledAmPm, setScheduledAmPm] = useState("PM");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [waitingCount, setWaitingCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (id) {
      // Check for existing session for this queue
      const existingTokenId = localStorage.getItem(`queue_token_${id}`);
      if (existingTokenId) {
        // Verify token is still active before redirecting
        verifyExistingToken(existingTokenId);
      } else {
        fetchQueue();
      }
    }
  }, [id]);

  async function verifyExistingToken(tokenId: string) {
    try {
      const { data, error } = await supabase
        .from("tokens")
        .select("id, status")
        .eq("id", tokenId)
        .single();
      
      if (!error && data && data.status === 'waiting') {
        router.push(`/status/${data.id}`);
        return;
      }
      
      // If token is invalid or already served, clear and show join page
      localStorage.removeItem(`queue_token_${id}`);
      fetchQueue();
    } catch (err) {
      fetchQueue();
    }
  }

  async function fetchQueue() {
    try {
      const { data, error } = await supabase
        .from("queues")
        .select(`
          *,
          users(
            name,
            business_name,
            address,
            phone,
            bio,
            website
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setQueue(data);

      const { count, error: countError } = await supabase
        .from("tokens")
        .select("*", { count: 'exact', head: true })
        .eq("queue_id", id)
        .eq("status", "waiting");
        
      if (!countError) {
        setWaitingCount(count || 0);
      }
    } catch (error) {
      console.error("Error fetching queue:", error);
    } finally {
      setLoading(false);
    }
  }

  const businessInfo = queue?.users;
  const jsonLd = queue ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": businessInfo?.business_name || businessInfo?.name || queue.name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessInfo?.address || "Available on request",
    },
    "telephone": businessInfo?.phone || "",
    "url": `https://nex-lovat.vercel.app/join/${id}`,
    "image": "https://nex-lovat.vercel.app/icon.png",
    "description": businessInfo?.bio || `Join the digital queue for ${queue.name}. Real-time waitlist management.`
  } : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setJoining(true);
    
    try {
      if (mode === 'join') {
        const formData = new FormData();
        formData.append("queueId", id as string);
        if (user?.id) formData.append("customerId", user.id);
        formData.append("guestName", name);
        formData.append("customerEmail", email);
        formData.append("partySize", partySize);

        const result = await joinQueueAction(formData);
        
        if (result.success && result.token) {
           localStorage.setItem(`queue_token_${id}`, result.token.id);
           router.push(`/status/${result.token.id}`);
        } else {
           alert(result.error || "Failed to join queue.");
        }
      } else {
        if (!scheduledDate || !queue) {
           setJoining(false);
           return;
        }
        
        let hourStr = parseInt(scheduledHour);
        if (scheduledAmPm === "PM" && hourStr !== 12) hourStr += 12;
        if (scheduledAmPm === "AM" && hourStr === 12) hourStr = 0;
        const combinedDate = new Date(`${scheduledDate}T${hourStr.toString().padStart(2, '0')}:${scheduledMinute}:00`);

        const formData = new FormData();
        formData.append("queueId", id as string);
        formData.append("businessId", queue.business_id);
        if (user?.id) formData.append("customerId", user.id);
        formData.append("guestName", name);
        formData.append("customerEmail", email);
        formData.append("partySize", partySize);
        formData.append("scheduledAt", combinedDate.toISOString());

        const result = await scheduleAppointmentAction(formData);

        if (result.success && result.appointment) {
           router.push(`/appointment/${result.appointment.id}`);
        } else {
           alert(result.error || "Failed to schedule appointment.");
        }
      }
    } catch (error) {
      console.error("Action error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setJoining(false);
    }
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading queue...</div>;
  if (!queue) return <div className="flex min-h-screen items-center justify-center text-destructive">Queue not found.</div>;
  if (queue.status === "closed") return <div className="flex min-h-screen items-center justify-center">This queue is currently closed.</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4 gap-8">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Link href="/">
        <Logo size={40} />
      </Link>
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center pb-2 relative pt-10">
          <div className="absolute right-4 top-4 z-10">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 gap-1.5 rounded-full px-3 text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Share Link"}
            </Button>
          </div>
          <CardTitle className="text-3xl font-black">{queue.name}</CardTitle>
          <CardDescription className="text-base font-medium">
            by {businessInfo?.business_name || businessInfo?.name || "Business"}
          </CardDescription>
          {businessInfo?.address && (
            <p className="text-[10px] text-muted-foreground mt-2 opacity-80 uppercase tracking-[0.2em] font-black border-t border-white/5 pt-2">
              {businessInfo.address}
            </p>
          )}

          {waitingCount !== null && (
            <div className="mt-4 mx-auto inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-bold border border-primary/20">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              {waitingCount} {waitingCount === 1 ? 'person' : 'people'} currently waiting
            </div>
          )}
        </CardHeader>
        
        <div className="px-6 flex gap-2 mb-4">
          <Button 
            variant={mode === 'join' ? 'default' : 'ghost'} 
            className="flex-1 rounded-full font-bold h-10"
            onClick={() => setMode('join')}
          >
            Join Now
          </Button>
          <Button 
            variant={mode === 'schedule' ? 'default' : 'ghost'} 
            className="flex-1 rounded-full font-bold h-10"
            onClick={() => setMode('schedule')}
          >
            Schedule Later
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold tracking-wide uppercase opacity-70">Your Name</Label>
              <Input
                id="name"
                className="h-11 rounded-xl"
                placeholder="Ex. Sarah Parker"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            {queue?.require_party_size && (
              <div className="space-y-2">
                <Label htmlFor="party_size" className="text-sm font-bold tracking-wide uppercase opacity-70">Party Size</Label>
                <div className="flex items-center gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    className="h-11 w-11 rounded-xl"
                    onClick={() => setPartySize(prev => Math.max(1, parseInt(prev) - 1).toString())}
                  >
                    -
                  </Button>
                  <Input
                    id="party_size"
                    className="h-11 rounded-xl text-center font-bold flex-1"
                    type="number"
                    min="1"
                    max="50"
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                    required
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    className="h-11 w-11 rounded-xl"
                    onClick={() => setPartySize(prev => (parseInt(prev) + 1).toString())}
                  >
                    +
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold tracking-wide uppercase opacity-70">Email (Optional)</Label>
              <Input
                id="email"
                className="h-11 rounded-xl"
                type="email"
                placeholder="sarah@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Used for turn notifications & updates.
              </p>
            </div>

            {mode === 'schedule' && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-bold tracking-wide uppercase opacity-70">Pick a Date</Label>
                  <Input
                    id="date"
                    className="h-11 rounded-xl"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-bold tracking-wide uppercase opacity-70">Pick a Time (12-Hour)</Label>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={scheduledHour}
                      onChange={(e) => setScheduledHour(e.target.value)}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                        <option key={h} value={h.toString().padStart(2, '0')}>{h}</option>
                      ))}
                    </select>
                    <span className="flex items-center text-lg font-bold">:</span>
                    <select
                      className="flex-1 h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={scheduledMinute}
                      onChange={(e) => setScheduledMinute(e.target.value)}
                    >
                      <option value="00">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </select>
                    <select
                      className="flex-1 h-11 rounded-xl border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-black"
                      value={scheduledAmPm}
                      onChange={(e) => setScheduledAmPm(e.target.value)}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              type="submit"
              className="w-full h-14 text-lg font-black rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={joining}
            >
              {joining ? (mode === 'join' ? "Joining..." : "Scheduling...") : (mode === 'join' ? "Join Queue Now" : "Schedule Appointment")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
