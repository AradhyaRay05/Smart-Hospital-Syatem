import { Activity, Heart, Stethoscope, Shield, Clock } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }) {
  const features = [
    { icon: Stethoscope, text: "Patient Registration & Management" },
    { icon: Clock, text: "Appointment Scheduling" },
    { icon: Heart, text: "Electronic Medical Records" },
    { icon: Shield, text: "Role-Based Access Control" },
  ];

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.15),transparent_30%),linear-gradient(180deg,_rgba(240,244,248,0.97),_rgba(226,232,240,0.98))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.14),transparent_32%),linear-gradient(180deg,_rgba(9,14,23,0.98),_rgba(15,23,42,0.96))]">
      <div className="pointer-events-none absolute inset-0 bg-white/10 dark:bg-slate-950/10 backdrop-blur-[2px]" />

      {/* Left Side - Visual Hero (Hidden on Mobile) */}
      <div className="hidden w-1/2 gradient-hero relative overflow-hidden lg:flex lg:flex-col lg:items-center lg:justify-center shadow-2xl z-10 rounded-r-[2rem] border-r border-white/10">
        {/* Animated Glowing Orbs */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full bg-teal-400 blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute -left-32 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500 blur-[120px] mix-blend-screen" />
        </div>

        <div className="relative z-20 max-w-lg space-y-10 px-12">
          <Link href="/" className="inline-flex items-center gap-3 transition-transform hover:scale-105 duration-300">
            <div className="gradient-accent rounded-xl p-2.5 shadow-lg shadow-teal-900/50">
              <Activity className="size-8 text-white" />
            </div>
            <span className="text-3xl font-extrabold text-white tracking-tight">SHDS</span>
          </Link>
          
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Smart Hospital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-200">Digitalization System</span>
            </h2>
            <p className="mt-4 text-lg text-sky-100 leading-relaxed font-medium">
              A centralized digital healthcare platform that enables hospitals to replace manual processes with efficient digital workflows.
            </p>
          </div>
          
          <div className="space-y-5">
            {features.map((item, index) => (
              <div 
                key={item.text} 
                className="flex items-center gap-4 animate-in fade-in slide-in-from-left-8 duration-700 fill-mode-backwards"
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                <div className="rounded-xl bg-white/10 p-2.5 backdrop-blur-sm border border-white/10 shadow-inner">
                  <item.icon className="size-5 text-teal-300" />
                </div>
                <span className="text-sky-50 font-medium text-lg">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-6 animate-in fade-in duration-1000 delay-700">
            {[{ icon: Stethoscope, label: "Cardiology" }, { icon: Heart, label: "Neurology" }, { icon: Activity, label: "Orthopedics" }].map(({ label }) => (
              <span key={label} className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-sm font-semibold text-cyan-100 shadow-sm transition-colors hover:bg-white/20 cursor-default">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex w-full items-center justify-center lg:w-1/2 relative">
        {/* Subtle background element for right side */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-60">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[90px]" />
          <div className="absolute left-10 bottom-0 h-[360px] w-[360px] rounded-full bg-accent/10 blur-[90px]" />
        </div>
        
        <div className="w-full max-w-md px-5 py-9 sm:px-6 sm:py-12 lg:px-8 relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}