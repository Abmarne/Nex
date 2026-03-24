"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Logo from "@/components/Logo";
import Link from "next/link";
import { ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Matrices mismatch (Passwords don't match)");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
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
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />
        
        <CardHeader className="border-b border-white/5 pb-8 relative z-10 bg-black/20">
          <CardTitle className="text-3xl font-black text-white text-center tracking-tight">
            New Matrix
          </CardTitle>
          <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-center text-muted-foreground/80 mt-2">
            Configure your new access credentials
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="relative z-10">
          <CardContent className="space-y-5 pt-8 px-8">
            {!success ? (
              <>
                <div className="space-y-2 group/input">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-white/50 group-focus-within/input:text-secondary transition-colors">New Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    className="h-12 bg-black/50 border-white/10 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-secondary/50 focus-visible:border-secondary/50 shadow-inner px-4 font-medium placeholder:text-muted-foreground/40 transition-all text-xs font-black tracking-widest"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2 group/input">
                  <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-white/50 group-focus-within/input:text-secondary transition-colors">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••"
                    className="h-12 bg-black/50 border-white/10 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-secondary/50 focus-visible:border-secondary/50 shadow-inner px-4 font-medium placeholder:text-muted-foreground/40 transition-all text-xs font-black tracking-widest"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                  />
                </div>
              </>
            ) : (
              <div className="bg-secondary/10 border border-secondary/20 text-secondary text-[11px] uppercase font-black tracking-widest p-6 rounded-2xl text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <CheckCircle2 size={24} className="text-secondary" />
                </div>
                <span>Sync Complete.<br/>Redirecting to terminal...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-bold tracking-widest p-3 rounded-lg text-center animate-in slide-in-from-top-2 flex items-center justify-center gap-2">
                <ShieldAlert size={14} />
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-6 pb-8 pt-4 px-8 border-t border-white/5 mt-4">
            {!success ? (
              <Button 
                type="submit" 
                className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-bold tracking-wide rounded-xl shadow-[0_0_20px_-5px_var(--color-secondary)] hover:shadow-[0_0_30px_-5px_var(--color-secondary)] transition-all uppercase text-xs" 
                disabled={loading}
              >
                {loading ? "Re-encrypting..." : "Update Password"}
              </Button>
            ) : (
                <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-white/10 bg-white/5 hover:bg-white/10 transition-all">Manual Redirect</Button>
                </Link>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
