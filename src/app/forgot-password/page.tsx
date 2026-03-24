"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Logo from "@/components/Logo";
import Link from "next/link";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background relative overflow-hidden p-4 gap-8">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] rounded-full bg-primary/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] rounded-full bg-secondary/10 blur-[130px] pointer-events-none -z-10" />
      
      <Link href="/" className="relative z-10 hover:opacity-80 transition-opacity">
        <Logo size={48} className="scale-125" />
      </Link>

      <Card className="w-full max-w-[400px] border-white/5 bg-[#121212]/80 backdrop-blur-2xl shadow-xl rounded-3xl overflow-hidden relative group z-10">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <CardHeader className="border-b border-white/5 pb-8 relative z-10 bg-black/20">
          <CardTitle className="text-3xl font-black text-white text-center tracking-tight">
            Reset Access
          </CardTitle>
          <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-center text-muted-foreground/80 mt-2">
            Enter your email to receive a secure recovery link
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="relative z-10">
          <CardContent className="space-y-5 pt-8 px-8">
            {!success ? (
              <div className="space-y-2 group/input">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-white/50 group-focus-within/input:text-primary transition-colors flex items-center gap-2">
                  <Mail size={12} />
                  Recovery Email
                </Label>
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
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] uppercase font-black tracking-widest p-6 rounded-2xl text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Sparkles size={20} className="text-emerald-500" />
                </div>
                <span>Transmission Sent.<br/>Check your encryption matrix (inbox).</span>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-bold tracking-widest p-3 rounded-lg text-center animate-in slide-in-from-top-2">
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-6 pb-8 pt-4 px-8 border-t border-white/5 mt-4">
            {!success && (
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold tracking-wide rounded-xl shadow-[0_0_20px_-5px_var(--color-primary)] hover:shadow-[0_0_30px_-5px_var(--color-primary)] transition-all uppercase text-xs" 
                disabled={loading}
              >
                {loading ? "Decrypting..." : "Send Reset Link"}
              </Button>
            )}
            
            <Link href="/login" className="flex items-center justify-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/60 hover:text-white transition-colors group/link">
              <ArrowLeft size={14} className="group-hover/link:-translate-x-1 transition-transform" />
              Return to Login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
