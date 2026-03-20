"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role: "business",
            },
          },
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[400px] border-white/5 bg-[#121212]/80 backdrop-blur-2xl shadow-xl rounded-3xl overflow-hidden relative group">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      <CardHeader className="border-b border-white/5 pb-8 relative z-10 bg-black/20">
        <CardTitle className="text-3xl font-black text-white text-center tracking-tight">
          {mode === "login" ? "Welcome Back" : "Initialize HQ"}
        </CardTitle>
        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-center text-muted-foreground/80 mt-2">
          {mode === "login" 
            ? "Enter your credentials to access the terminal" 
            : "Register your business to deploy standard queues"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="relative z-10">
        <CardContent className="space-y-5 pt-8 px-8">
          {mode === "register" && (
            <div className="space-y-2 group/input">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-white/50 group-focus-within/input:text-primary transition-colors">Business Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Enter your business name" 
                className="h-12 bg-black/50 border-white/10 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 shadow-inner px-4 font-medium placeholder:text-muted-foreground/40 transition-all"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          )}
          <div className="space-y-2 group/input">
            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-white/50 group-focus-within/input:text-primary transition-colors">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              className="h-12 bg-black/50 border-white/10 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 shadow-inner px-4 font-medium placeholder:text-muted-foreground/40 transition-all"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2 group/input">
            <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-white/50 group-focus-within/input:text-primary transition-colors">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              className="h-12 bg-black/50 border-white/10 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 shadow-inner px-4 font-medium placeholder:text-muted-foreground/40 transition-all"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-bold tracking-widest p-3 rounded-lg text-center animate-in slide-in-from-top-2">{error}</div>}
        </CardContent>
        <CardFooter className="flex flex-col gap-6 pb-8 pt-4 px-8 border-t border-white/5 mt-4">
          <Button 
            type="submit" 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold tracking-wide rounded-xl shadow-[0_0_20px_-5px_var(--color-primary)] hover:shadow-[0_0_30px_-5px_var(--color-primary)] transition-all uppercase text-xs" 
            disabled={loading}
          >
            {loading ? "Authenticating..." : mode === "login" ? "Enter Command Center" : "Create Business Profile"}
          </Button>
          <div className="text-[11px] font-bold text-center tracking-wide text-muted-foreground/70">
            {mode === "login" ? (
              <>
                NO ACCESS KEY YET?{" "}
                <Link href="/register" className="text-primary hover:text-white transition-colors underline decoration-primary/50 underline-offset-4">
                  REGISTER HERE
                </Link>
              </>
            ) : (
              <>
                ALREADY INITIALIZED?{" "}
                <Link href="/login" className="text-secondary hover:text-white transition-colors underline decoration-secondary/50 underline-offset-4">
                  LOGIN HERE
                </Link>
              </>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
