import { Activity, Heart, Stethoscope, Shield, Clock } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 gradient-hero relative overflow-hidden lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-green-400 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-blue-400 blur-3xl" />
        </div>
        <div className="relative max-w-md space-y-8 px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="gradient-green rounded-xl p-2">
              <Activity className="size-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SHDS</span>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-white">Smart Hospital Digitalization System</h2>
            <p className="mt-3 text-lg text-blue-200">
              A centralized digital healthcare platform that enables hospitals to replace manual processes with efficient digital workflows.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: Stethoscope, text: "Patient Registration & Management" },
              { icon: Clock, text: "Appointment Scheduling" },
              { icon: Heart, text: "Electronic Medical Records" },
              { icon: Shield, text: "Role-Based Access Control" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="rounded-lg bg-white/10 p-1.5">
                  <item.icon className="size-4 text-green-400" />
                </div>
                <span className="text-blue-100">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            {[{ icon: Stethoscope, label: "Cardiology" }, { icon: Heart, label: "Neurology" }, { icon: Activity, label: "Orthopedics" }].map(({ label }) => (
              <span key={label} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-blue-200">{label}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center bg-white lg:w-1/2">
        <div className="w-full max-w-md px-8">{children}</div>
      </div>
    </div>
  );
}
