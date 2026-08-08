import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Activity, Calendar, FileText, Shield, Users, Building2, Heart, Stethoscope, Clock, ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const features = [
    { icon: Users, title: "Patient Management", description: "Register patients, maintain records, and track medical history efficiently.", color: "bg-blue-50 text-blue-600" },
    { icon: Calendar, title: "Appointment Scheduling", description: "Book, reschedule, and manage appointments with doctor availability.", color: "bg-green-50 text-green-600" },
    { icon: FileText, title: "Medical Records", description: "Centralized electronic medical records with diagnosis and treatment history.", color: "bg-orange-50 text-orange-600" },
    { icon: Building2, title: "Department Management", description: "Organize doctors by departments and manage hospital structure.", color: "bg-purple-50 text-purple-600" },
    { icon: Activity, title: "Prescriptions", description: "Digital prescription creation with medicine tracking and dosage details.", color: "bg-teal-50 text-teal-600" },
    { icon: Shield, title: "Role-Based Access", description: "Secure access control for admins, doctors, receptionists, and patients.", color: "bg-red-50 text-red-600" },
  ];

  const stats = [
    { value: "10+", label: "Modules" },
    { value: "4", label: "User Roles" },
    { value: "24/7", label: "Availability" },
    { value: "100%", label: "Digital" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="gradient-primary rounded-lg p-1.5">
              <Activity className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">SHDS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link href="/sign-up"><Button size="sm" className="gradient-primary border-0">Get Started</Button></Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-green-400 blur-3xl" />
            <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-blue-400 blur-3xl" />
          </div>
          <div className="container relative mx-auto flex flex-col items-center px-4 py-20 text-center lg:py-28">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              <Heart className="size-3.5" />
              Smart Hospital Digitalization System
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Modern Healthcare<br /><span className="text-green-400">Management</span> Platform
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-blue-100">
              Digitize hospital operations, manage patient records, schedule appointments, and streamline clinical workflows — all from a single centralized platform.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/sign-up"><Button size="lg" className="gradient-green border-0 text-white font-semibold px-8">Start Free<ArrowRight className="ml-2 size-4" /></Button></Link>
              <Link href="/sign-in"><Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 font-semibold">Sign In</Button></Link>
            </div>

            <div className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-blue-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto grid gap-6 px-4 py-20 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="group rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1">
              <div className={`mb-4 inline-flex rounded-xl p-3 ${feature.color}`}>
                <feature.icon className="size-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold">Trusted by Healthcare Professionals</h2>
            <p className="mt-2 text-muted-foreground">Built with modern technology for reliability and security</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
              {[{ icon: Stethoscope, label: "Verified Doctors" }, { icon: Clock, label: "24/7 Access" }, { icon: Shield, label: "Secure Data" }, { icon: Heart, label: "Patient First" }].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-muted-foreground">
                  <item.icon className="size-5 text-primary" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Smart Hospital Digitalization System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
