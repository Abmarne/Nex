"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardList, CheckCircle2, Send } from "lucide-react";

type Field = {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  options?: string[]; // for select type
  required?: boolean;
};

export default function PreboardingForm({
  tokenId,
  fields,
  existingData,
}: {
  tokenId: string;
  fields: Field[];
  existingData: Record<string, string> | null;
}) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
      setSubmitted(true);
    }
  }, [existingData]);

  function handleChange(fieldId: string, value: string) {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("tokens")
        .update({ preboarding_data: formData })
        .eq("id", tokenId);

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting pre-boarding form:", err);
      alert("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Card className="w-full max-w-sm border border-emerald-500/30 bg-[#121212]/80 backdrop-blur-2xl shadow-[0_0_30px_rgba(16,185,129,0.1)] rounded-[2rem] overflow-hidden text-white relative">
        <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full z-0 pointer-events-none" />
        <CardContent className="p-8 text-center space-y-4 relative z-10">
          <div className="inline-flex p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-2">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h4 className="font-black text-white text-xl tracking-tight">Sequence Logged</h4>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            Data transmission successful. Handlers will access upon engagement.
          </p>
          <Button
            variant="outline"
            className="mt-6 w-full rounded-xl h-12 font-black uppercase tracking-widest text-[10px] border border-white/10 bg-black/40 hover:bg-white/10 text-white transition-all shadow-inner"
            onClick={() => setSubmitted(false)}
          >
            Modify Package
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm border border-white/5 bg-[#121212]/80 backdrop-blur-2xl shadow-2xl rounded-[2rem] overflow-hidden text-white relative">
      <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 blur-[80px] rounded-full pointer-events-none" />
      
      <CardHeader className="bg-black/50 border-b border-white/5 pb-6 text-center relative z-10">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl font-black text-white tracking-tight mb-2">
          <div className="p-2.5 rounded-xl bg-secondary/20 text-secondary border border-secondary/30 shadow-[inset_0_0_15px_rgba(var(--color-secondary),0.2)]">
            <ClipboardList size={22} />
          </div>
          Pre-entry Payload
        </CardTitle>
        <CardDescription className="text-muted-foreground/80 font-medium">
          Upload required protocol data.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1 group-focus-within:text-white transition-colors">
                {field.label}
                {field.required && <span className="text-red-500 text-sm">*</span>}
              </Label>

              {field.type === "text" && (
                <Input
                  className="rounded-xl border border-white/10 bg-black/50 px-4 py-6 text-sm shadow-inner focus-visible:ring-1 focus-visible:ring-secondary/50 focus-visible:border-secondary/50 text-white placeholder:text-muted-foreground/30 transition-all font-medium"
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                  placeholder={`Input ${field.label.toLowerCase()}`}
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  className="flex w-full rounded-xl border border-white/10 bg-black/50 px-4 py-4 text-sm shadow-inner focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary/50 text-white placeholder:text-muted-foreground/30 transition-all min-h-[100px] resize-none font-medium"
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                  placeholder={`Input ${field.label.toLowerCase()}`}
                />
              )}

              {field.type === "select" && field.options && (
                <div className="relative">
                  <select
                    className="flex h-12 w-full appearance-none rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm shadow-inner focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary/50 text-white transition-all font-medium cursor-pointer"
                    value={formData[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    required={field.required}
                  >
                    <option value="" disabled className="bg-black text-muted-foreground">Authorize selection...</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#1a1a1a] text-white py-2">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Button
            type="submit"
            className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-[12px] bg-secondary text-white border border-secondary/50 hover:bg-secondary/90 shadow-[0_0_20px_-5px_var(--color-secondary)] hover:shadow-[0_0_30px_-5px_var(--color-secondary)] hover:scale-[1.02] transition-all gap-3 mt-4 relative overflow-hidden group"
            disabled={submitting}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <Send size={16} className={submitting ? "animate-pulse" : "group-hover:translate-x-1 transition-transform"} />
            {submitting ? "Transmitting..." : "Submit Payload"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
