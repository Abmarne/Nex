"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// Define strict schemas for data ingress
const joinQueueSchema = z.object({
  queueId: z.string().uuid(),
  customerId: z.string().uuid().optional().nullable(),
  guestName: z.string().min(2, "Name must be at least 2 characters").max(50),
  customerEmail: z.string().email().optional().or(z.literal("")),
  partySize: z.number().int().min(1).max(50),
});

const scheduleSchema = z.object({
  queueId: z.string().uuid(),
  businessId: z.string().uuid(),
  customerId: z.string().uuid().optional().nullable(),
  guestName: z.string().min(2, "Name must be at least 2 characters").max(50),
  customerEmail: z.string().email().optional().or(z.literal("")),
  partySize: z.number().int().min(1).max(50),
  scheduledAt: z.string().datetime(), // ISO 8601 string
});

export async function joinQueueAction(formData: FormData) {
  const supabase = await createClient();

  try {
    // 1. Validate data via Zod
    const validatedData = joinQueueSchema.parse({
      queueId: formData.get("queueId"),
      customerId: formData.get("customerId"),
      guestName: formData.get("guestName"),
      customerEmail: formData.get("customerEmail"),
      partySize: parseInt(formData.get("partySize") as string || "1", 10),
    });

    // 2. Compute Next Position securely on the server
    const { data: lastToken } = await supabase
      .from("tokens")
      .select("position")
      .eq("queue_id", validatedData.queueId)
      .order("position", { ascending: false })
      .limit(1);

    const nextPosition = (lastToken?.[0]?.position || 0) + 1;

    // 3. Insert specific valid fields to prevent arbitrary table mutation
    const { data: token, error } = await supabase
      .from("tokens")
      .insert([
        {
          queue_id: validatedData.queueId,
          customer_id: validatedData.customerId || null,
          guest_name: validatedData.guestName,
          customer_email: validatedData.customerEmail || null,
          party_size: validatedData.partySize,
          position: nextPosition,
          status: "waiting",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, token };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Error:", error.issues);
      return { success: false, error: "Invalid data submitted." };
    }


    console.error("Error joining queue via action:", error);
    return { success: false, error: "Server encountered an error while joining." };
  }
}

export async function scheduleAppointmentAction(formData: FormData) {
  const supabase = await createClient();

  try {
    const validatedData = scheduleSchema.parse({
      queueId: formData.get("queueId"),
      businessId: formData.get("businessId"),
      customerId: formData.get("customerId"),
      guestName: formData.get("guestName"),
      customerEmail: formData.get("customerEmail"),
      partySize: parseInt(formData.get("partySize") as string || "1", 10),
      scheduledAt: formData.get("scheduledAt"),
    });

    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          business_id: validatedData.businessId,
          queue_id: validatedData.queueId,
          customer_id: validatedData.customerId || null,
          guest_name: validatedData.guestName,
          guest_email: validatedData.customerEmail || null,
          party_size: validatedData.partySize,
          scheduled_at: validatedData.scheduledAt,
          status: "scheduled",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, appointment: data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Invalid input" };
    }

    console.error("Error scheduling appointment:", error);
    return { success: false, error: "Failed to schedule appointment." };
  }
}
