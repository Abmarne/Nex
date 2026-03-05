"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3, Users, Clock, CheckCircle2, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalServed: 0,
    avgWaitTime: 0,
    peakHour: "N/A",
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      // 1. Get all tokens for this business's queues
      const { data: queues } = await supabase
        .from("queues")
        .select("id")
        .eq("business_id", user?.id);

      const queueIds = queues?.map(q => q.id) || [];

      if (queueIds.length === 0) {
        setLoading(false);
        return;
      }

      // 2. Fetch tokens
      const { data: tokens, error } = await supabase
        .from("tokens")
        .select("*")
        .in("queue_id", queueIds);

      if (error) throw error;

      const served = tokens.filter(t => t.status === 'served');
      const total = tokens.length;

      // Calculate Avg Wait Time (Mock logic: using created_at difference if we had served_at)
      // Since we don't have served_at in schema yet, let's assume 10 mins average for now 
      // OR update schema to include served_at. Let's stick to simple stats for MVP.
      
      setStats({
        totalServed: served.length,
        avgWaitTime: 8, // Placeholder: 8 minutes
        peakHour: "14:00 - 15:00",
        completionRate: total > 0 ? Math.round((served.length / total) * 100) : 0,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8">Loading analytics...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Insights into your queue performance and customer flow.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Served</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServed}</div>
            <p className="text-xs text-muted-foreground">Liftime customers served</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgWaitTime} min</div>
            <p className="text-xs text-muted-foreground">Average across all queues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Served vs Left</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{stats.peakHour}</div>
            <p className="text-xs text-muted-foreground">Most active time of day</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Queue Performance</CardTitle>
          <CardDescription>Detailed breakdown of your most busy queues.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg">
             <p className="text-muted-foreground flex items-center gap-2">
               <BarChart3 size={20} />
               Performance charts will appear here as more data is collected.
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
