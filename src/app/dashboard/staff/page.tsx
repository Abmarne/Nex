"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, Shield, Trash2, Mail } from "lucide-react";
import { toast } from "sonner";

type StaffMember = {
  id: string;
  staff_id: string;
  role: string;
  created_at: string;
  users: {
    name: string;
    email: string;
  };
};

export default function StaffManagementPage() {
  const { user } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (user) {
      fetchStaff();
    }
  }, [user]);

  async function fetchStaff() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("business_staff")
        .select(`
          *,
          users:staff_id(name, email)
        `)
        .eq("business_id", user?.id);

      if (error) throw error;
      setStaff(data as unknown as StaffMember[] || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addStaffMember(e: React.FormEvent) {
    e.preventDefault();
    if (!newStaffEmail.trim()) return;

    setAdding(true);
    try {
      // 1. Find user by email
      const { data: targetUser, error: findError } = await supabase
        .from("users")
        .select("id")
        .eq("email", newStaffEmail)
        .single();

      if (findError || !targetUser) {
        toast.error("User not found.", { description: "They must register on Nex first." });
        return;
      }

      // 2. Add as staff
      const { error: addError } = await supabase
        .from("business_staff")
        .insert([{
          business_id: user?.id,
          staff_id: targetUser.id,
          role: 'staff'
        }]);

      if (addError) throw addError;

      setNewStaffEmail("");
      fetchStaff();
      toast.success("Staff member added!");
    } catch (error: any) {
      console.error("Error adding staff:", error);
      toast.error("Failed to add staff.", { description: "They might already be added." });
    } finally {
      setAdding(false);
    }
  }

  async function removeStaff(id: string) {
    try {
      const { error } = await supabase
        .from("business_staff")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setStaff(prev => prev.filter(s => s.id !== id));
      toast.success("Staff member removed.");
    } catch (error) {
      console.error("Error removing staff:", error);
      toast.error("Failed to remove staff member.");
    }
  }

  if (loading) return <div className="p-8">Loading staff...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
        <p className="text-muted-foreground">Add and manage staff members who can help manage your queues.</p>
      </div>

      <Card className="border-primary/10 shadow-sm bg-primary/[0.02]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus size={20} className="text-primary" />
            Add Staff Member
          </CardTitle>
          <CardDescription>Enter the email address of the person you'd like to invite as staff.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addStaffMember} className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                type="email" 
                placeholder="staff@example.com" 
                className="pl-10 h-11"
                value={newStaffEmail}
                onChange={(e) => setNewStaffEmail(e.target.value)}
                required
              />
            </div>
            <Button className="h-11 px-6 font-bold" disabled={adding}>
              {adding ? "Adding..." : "Add Staff"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <h3 className="text-xl font-bold flex items-center gap-2 px-2">
          <Users size={20} />
          Your Team ({staff.length})
        </h3>
        
        {staff.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl uppercase tracking-widest text-xs font-bold">
            No staff members added yet.
          </p>
        ) : (
          staff.map((member) => (
            <Card key={member.id} className="group hover:shadow-md transition-all border-l-4 border-l-primary/30 hover:border-l-primary">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {member.users?.name?.[0]?.toUpperCase() || "S"}
                  </div>
                  <div>
                    <p className="font-bold">{member.users?.name || "Unnamed Staff"}</p>
                    <p className="text-xs text-muted-foreground">{member.users?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Shield size={12} />
                    {member.role}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeStaff(member.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
