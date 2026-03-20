import { AuthForm } from "@/components/auth/auth-form";
import Logo from "@/components/Logo";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background relative overflow-hidden p-4 gap-8">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] rounded-full bg-primary/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] rounded-full bg-secondary/10 blur-[130px] pointer-events-none -z-10" />
      <Link href="/" className="relative z-10 hover:opacity-80 transition-opacity">
        <Logo size={48} className="scale-125" />
      </Link>
      <div className="relative z-10">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
