"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { loginAction, registerAction } from "@/app/login/actions";
import { Eye, EyeOff } from "lucide-react";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordRequirements = (pass: string) => {
    return {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass),
    };
  };

  const requirements = getPasswordRequirements(password);
  const isPasswordStrong = Object.values(requirements).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    if (mode === "register") {
      formData.append("name", name);
    }

    try {
      if (mode === "register") {
        if (!isPasswordStrong) {
          setError("Password does not meet security protocols.");
          setLoading(false);
          return;
        }
        const result = await registerAction(formData);
        if (result?.error) {
           setError(result.error);
        } else {
           window.location.href = "/dashboard";
        }
      } else {
        const result = await loginAction(formData);
        if (result?.error) {
           setError(result.error);
        } else {
           window.location.href = "/dashboard";
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-white/50 group-focus-within/input:text-primary transition-colors">Password</Label>
              {mode === "login" && (
                <Link href="/forgot-password" title="Forgot Password?" className="text-[9px] font-black tracking-widest uppercase text-muted-foreground/60 hover:text-primary transition-colors">
                  Forgot Password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="h-12 bg-black/50 border-white/10 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 shadow-inner px-4 font-medium placeholder:text-muted-foreground/40 transition-all pr-12"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-white transition-colors focus:outline-none focus:text-primary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {mode === "register" && password.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-3 animate-in fade-in slide-in-from-top-1 duration-300">
                <Requirement 
                  label="8+ Characters" 
                  met={requirements.length} 
                />
                <Requirement 
                  label="Uppercase" 
                  met={requirements.uppercase} 
                />
                <Requirement 
                  label="Number" 
                  met={requirements.number} 
                />
                <Requirement 
                  label="Symbol" 
                  met={requirements.special} 
                />
              </div>
            )}
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

function Requirement({ label, met }: { label: string; met: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${met ? "text-emerald-500" : "text-white/20"}`}>
      <div className={`h-1 w-1 rounded-full ${met ? "bg-emerald-500" : "bg-white/20"}`} />
      {label}
    </div>
  );
}
