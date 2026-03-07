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

export default function JoinQueuePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [queue, setQueue] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (id) {
      fetchQueue();
    }
  }, [id]);

  async function fetchQueue() {
    try {
      const { data, error } = await supabase
        .from("queues")
        .select(
          `
          *,
          users(name)
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      setQueue(data);
    } catch (error) {
      console.error("Error fetching queue:", error);
    } finally {
      setLoading(false);
    }
  }

  async function joinQueue(e: React.FormEvent) {
    e.preventDefault();
    setJoining(true);

    try {
      let customerId = user?.id;

      const { data: lastToken } = await supabase
        .from("tokens")
        .select("position")
        .eq("queue_id", id)
        .order("position", { ascending: false })
        .limit(1)
        .single();

      const nextPosition = (lastToken?.position || 0) + 1;

      const { data: token, error } = await supabase
        .from("tokens")
        .insert([
          {
            queue_id: id,
            customer_id: customerId || null,
            guest_name: name,
            customer_email: email || null,
            position: nextPosition,
            status: "waiting",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      router.push(`/status/${token.id}`);
    } catch (error) {
      console.error("Error joining queue:", error);
    } finally {
      setJoining(false);
    }
  }

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading queue...
      </div>
    );
  if (!queue)
    return (
      <div className="flex min-h-screen items-center justify-center text-destructive">
        Queue not found.
      </div>
    );
  if (queue.status === "closed")
    return (
      <div className="flex min-h-screen items-center justify-center">
        This queue is currently closed.
      </div>
    );

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{queue.name}</CardTitle>
          <CardDescription>
            by {queue.users?.name || "Business"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={joinQueue}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We'll email you when your turn is near.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={joining}
            >
              {joining ? "Joining..." : "Join Queue"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
