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
      <Card className="w-full max-w-sm border-2 border-green-200 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-6 text-center space-y-3">
          <CheckCircle2 size={40} className="mx-auto text-green-500" />
          <h4 className="font-black text-green-800 text-lg">Pre-boarding Complete!</h4>
          <p className="text-sm text-green-700/80">
            Your information has been submitted. The staff will have it ready when it's your turn.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-green-200 text-green-700 hover:bg-green-50"
            onClick={() => setSubmitted(false)}
          >
            Edit Responses
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm border-2 border-violet-200 shadow-xl overflow-hidden bg-gradient-to-br from-violet-50 to-fuchsia-50">
      <CardHeader className="bg-violet-600 text-white text-center pb-6">
        <CardTitle className="flex items-center justify-center gap-2 text-xl font-black">
          <ClipboardList size={24} />
          Pre-boarding Form
        </CardTitle>
        <CardDescription className="text-violet-100 font-medium mt-1">
          Fill this out while you wait to save time!
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label className="text-sm font-bold text-violet-900">
                {field.label}
                {field.required && <span className="text-red-400 ml-0.5">*</span>}
              </Label>

              {field.type === "text" && (
                <Input
                  className="rounded-xl border-violet-200 bg-white focus-visible:ring-violet-400"
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  className="flex w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400 min-h-[80px] resize-none"
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}

              {field.type === "select" && field.options && (
                <select
                  className="flex h-10 w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                >
                  <option value="">Select...</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          <Button
            type="submit"
            className="w-full rounded-xl h-12 font-black bg-violet-600 hover:bg-violet-700 shadow-lg gap-2"
            disabled={submitting}
          >
            <Send size={16} />
            {submitting ? "Submitting..." : "Submit Pre-boarding"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
