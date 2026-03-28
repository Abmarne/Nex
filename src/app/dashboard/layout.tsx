"use client";

import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, ListOrdered, BarChart3, Menu, X, Calendar, Users, Gift } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading, signOut } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Exact match for /dashboard, prefix match for sub-routes
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-t-2 border-r-2 border-primary animate-spin" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50 animate-pulse">
            Initializing...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/queues", icon: ListOrdered, label: "My Queues" },
    { href: "/dashboard/appointments", icon: Calendar, label: "Appointments" },
    { href: "/dashboard/staff", icon: Users, label: "Staff Management" },
    { href: "/dashboard/loyalty", icon: Gift, label: "Loyalty Program" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="flex min-h-screen bg-background relative selection:bg-primary/30">
      {/* Immersive Glows */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] rounded-full bg-primary/10 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vh] rounded-full bg-secondary/5 blur-[150px] pointer-events-none z-0" />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 z-40 shadow-sm">
        <Logo size={28} />
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="text-white hover:bg-white/5">
          <Menu size={24} />
        </Button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Built like a Command Deck */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-[#121212]/90 backdrop-blur-2xl border-r border-white/5 flex flex-col z-50 transition-transform duration-500 lg:relative lg:translate-x-0 shadow-2xl
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-8 pb-4 flex items-center justify-between">
          <Logo size={40} className="scale-110 origin-left" />
          <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground hover:text-white hover:bg-white/5" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </Button>
        </div>
        
        <div className="px-6 pb-6 pt-2">
          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/50 pl-2 mb-4 mt-2">Navigation</p>
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link key={link.href} href={link.href} onClick={() => setIsSidebarOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-4 h-12 transition-all rounded-xl border font-bold tracking-wide relative overflow-hidden
                      ${
                        active
                          ? "text-white bg-primary/10 border-primary/20 shadow-[inset_0_0_20px_rgba(0,112,243,0.05)]"
                          : "text-muted-foreground hover:text-white hover:bg-white/[0.04] border-transparent hover:border-white/5"
                      }
                    `}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full shadow-[0_0_8px_var(--color-primary)]" />
                    )}
                    <div className={`p-1.5 rounded-lg transition-colors ${active ? "bg-primary/20 text-primary" : "bg-white/5 text-primary"}`}>
                      <link.icon size={16} />
                    </div>
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5 space-y-5 bg-black/20">
          <div className="px-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-black text-white shadow-lg shadow-primary/20">
               {(profile?.name || "B")[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-white truncate">{profile?.name || "Business Account"}</p>
              <p className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-widest">{user.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-center gap-2 h-11 text-red-400 border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30 transition-all rounded-xl font-bold tracking-widest uppercase text-[10px]" 
            onClick={() => signOut()}
          >
            <LogOut size={14} />
            Terminate Session
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 pt-24 lg:pt-12 w-full max-w-7xl mx-auto overflow-x-hidden relative z-10">
        {children}
      </main>
    </div>
  );
}
