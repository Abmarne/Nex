"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ArcadeGame from "@/components/ArcadeGame";
import PreboardingForm from "@/components/PreboardingForm";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import { Token, Queue } from "@/types/database";

interface QueueWithUser extends Queue {
  users?: { name: string | null };
}

interface TokenWithQueue extends Token {
  queues?: QueueWithUser;
}

// Extracted Components
import { PositionDisplay } from "@/components/status/PositionDisplay";
import { PreparationAlert } from "@/components/status/PreparationAlert";
import { StatusStatsGrid } from "@/components/status/StatusStatsGrid";
import { InteractionPanel } from "@/components/status/InteractionPanel";

export default function TokenStatusPage() {
  const params = useParams();
  const tokenId = params?.tokenId as string;
  const router = useRouter();
  const [token, setToken] = useState<TokenWithQueue | null>(null);
  const [queue, setQueue] = useState<QueueWithUser | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [snoozing, setSnoozing] = useState(false);

  const fetchTokenData = useCallback(async () => {
    try {
      const { data, error: tokenError } = await supabase
        .from("tokens")
        .select(`
          *,
          queues (
            *,
            users (name)
          )
        `)
        .eq("id", tokenId)
        .single();

      if (tokenError) throw tokenError;
      
      const tokenData = data as unknown as TokenWithQueue;
      setToken(tokenData);
      setQueue(tokenData.queues || null);

      // Calculate position
      const { count } = await supabase
        .from("tokens")
        .select("*", { count: 'exact', head: true })
        .eq("queue_id", tokenData.queue_id)
        .eq("status", "waiting")
        .lt("position", tokenData.position);

      setPosition((count || 0) + 1);
    } catch (error) {
      console.error("Error fetching token data:", error);
    } finally {
      setLoading(false);
    }
  }, [tokenId]);

  useEffect(() => {
    if (tokenId) {
      fetchTokenData();

      // Check for notification permission
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          setNotificationsEnabled(true);
        }
      }

      // Realtime subscription for ALL changes to tokens in this queue
      const channel = supabase
        .channel(`queue-updates-${tokenId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tokens' },
          () => {
            fetchTokenData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [tokenId, fetchTokenData]);

  async function requestNotificationPermission() {
    if (!('Notification' in window)) {
      toast.error("Notifications not supported", { description: "Your browser doesn't support push notifications." });
      return;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        new Notification("Notifications Enabled!", {
          body: "We'll alert you when it's almost your turn.",
          icon: "/favicon.ico"
        });
      }
    }
  }

  const sendTurnAlert = useCallback(() => {
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification("Your turn is near!", {
        body: `You are #${position} in line at ${queue?.name}. Please head to the counter.`,
        icon: "/favicon.ico"
      });
    }
  }, [notificationsEnabled, position, queue]);

  useEffect(() => {
    if (position !== null && position <= 3 && position > 0) {
      sendTurnAlert();
    }
  }, [position, sendTurnAlert]);

  const leaveQueue = useCallback(async () => {
    toast.warning("Leave the queue?", {
      description: "Your position will be permanently lost.",
      action: {
        label: "Yes, Leave",
        onClick: async () => {
          try {
            const { error } = await supabase
              .from("tokens")
              .update({ status: "left" })
              .eq("id", tokenId);

            if (error) throw error;

            if (token?.queue_id) {
              localStorage.removeItem(`queue_token_${token.queue_id}`);
            }
            router.push("/");
          } catch (error) {
            console.error("Error leaving queue:", error);
            toast.error("Failed to leave the queue.");
          }
        },
      },
      cancel: { label: "Stay", onClick: () => {} },
      duration: 8000,
    });
  }, [tokenId, token?.queue_id, router]);

  const snoozeQueue = useCallback(async () => {
    if (!token || (token.snooze_count ?? 0) >= 2) return;
    setSnoozing(true);
    try {
      const { data: lastToken } = await supabase
        .from("tokens")
        .select("position")
        .eq("queue_id", token.queue_id)
        .eq("status", "waiting")
        .order("position", { ascending: false })
        .limit(1);

      const maxPosition = (lastToken?.[0] as { position: number } | undefined)?.position || token.position;
      const newPosition = Math.min(token.position + 3, maxPosition + 1);

      const { error } = await supabase
        .from("tokens")
        .update({
          position: newPosition,
          snooze_count: (token.snooze_count ?? 0) + 1,
        })
        .eq("id", tokenId);

      if (error) throw error;
    } catch (error) {
      console.error("Error snoozing queue:", error);
    } finally {
      setSnoozing(false);
    }
  }, [tokenId, token]);

  if (loading) return <div className="flex min-h-screen items-center justify-center">Checking your position...</div>;
  if (!token) return <div className="flex min-h-screen items-center justify-center text-destructive">Token not found.</div>;

  if (token.status === 'served') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50 p-4">
        <Card className="w-full max-w-md text-center border-green-200">
          <CardHeader>
            <CardTitle className="text-3xl text-green-700">It&apos;s Your Turn!</CardTitle>
            <CardDescription>Please proceed to the counter.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-8">
              <span className="text-8xl font-black text-green-600">#{token.position}</span>
            </div>
            <p className="font-medium">{queue?.name}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => {
              if (token?.queue_id) localStorage.removeItem(`queue_token_${token.queue_id}`);
              router.push("/");
            }}>Back to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (token.status === 'left') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>You left the queue</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => {
              if (token?.queue_id) localStorage.removeItem(`queue_token_${token.queue_id}`);
              router.push("/");
            }}>Back to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const estWaitTime = position ? (position - 1) * 5 : 0;
  const preboardingFields = (queue?.preboarding_fields as { id: string; label: string; type: "text" | "select" | "textarea"; options?: string[]; required?: boolean }[]) || [];

  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vh] rounded-full bg-primary/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vh] rounded-full bg-secondary/10 blur-[130px] pointer-events-none -z-10" />

      <header className="p-6 flex items-center gap-4 relative z-10 border-b border-white/5">
        <Button variant="ghost" size="icon" className="hover:bg-white/5 bg-black/20 backdrop-blur-md border border-white/5 rounded-full" onClick={() => router.push("/")}>
          <ArrowLeft size={18} className="text-white" />
        </Button>
        <Logo size={24} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-start p-6 pt-12 gap-8 relative z-10">
        <PositionDisplay position={token.position} />
        <PreparationAlert position={position || 0} />
        <StatusStatsGrid position={position} estWaitTime={estWaitTime} />
        <InteractionPanel 
          notificationsEnabled={notificationsEnabled}
          requestNotificationPermission={requestNotificationPermission}
          position={position}
          token={token}
          snoozeQueue={snoozeQueue}
          snoozing={snoozing}
          leaveQueue={leaveQueue}
        />

        {queue?.arcade_enabled && token && (
          <div className="w-full max-w-sm mt-4">
             <ArcadeGame 
               queueId={queue.id} 
               tokenId={token.id} 
               guestName={token.guest_name || queue.users?.name || "Guest"} 
               arcadeReward={queue.arcade_reward || ""}
             />
          </div>
        )}

        {queue?.preboarding_enabled && preboardingFields.length > 0 && token && (
          <div className="w-full max-w-sm mt-4">
             <PreboardingForm
               tokenId={token.id}
               fields={preboardingFields}
               existingData={token.preboarding_data as Record<string, string> | null}
             />
          </div>
        )}
      </main>

      <footer className="p-8 pb-12 flex flex-col items-center justify-center gap-3 relative z-10 border-t border-white/5 mt-auto">
        <Logo showText={true} size={18} className="opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
        <p className="text-[9px] text-muted-foreground/30 uppercase tracking-widest font-black">Powered by Nex</p>
      </footer>
    </div>
  );
}
