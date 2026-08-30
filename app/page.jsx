"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity, Calendar, FileText, Shield, Users, Building2, Heart, Stethoscope, Clock, ArrowRight,
  Sparkles, PhoneCall, UserCheck, ShieldCheck, Pill, ArrowUpRight, Plus, Minus,
  Mail, MapPin, Phone, ChevronDown, Headset, Brain, Bone, Baby, Scissors, FlaskConical,
  Zap, Eye, Star, Quote, Smile, Search, Menu, X
} from "lucide-react";
import {
  ScrollFadeIn,
  ZoomHover,
  GlowHover,
  TextReveal,
  ShimmerText,
} from "@/components/shared/motion-fx";

export default function HomePage() {
  // Accordion States
  const [openFaq, setOpenFaq] = useState(null);
  const [openMissionVision, setOpenMissionVision] = useState(null);
  
  // Tab State (testimonials)
  const [activeTab, setActiveTab] = useState("video");

  // Navigation Dropdown State with Hover Delay Protection
  const [showClinicalMenu, setShowClinicalMenu] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const clinicalTimeoutRef = useRef(null);

  const openMenu = () => {
    if (clinicalTimeoutRef.current) clearTimeout(clinicalTimeoutRef.current);
    setShowClinicalMenu(true);
  };

  const closeMenu = () => {
    if (clinicalTimeoutRef.current) clearTimeout(clinicalTimeoutRef.current);
    clinicalTimeoutRef.current = setTimeout(() => {
      setShowClinicalMenu(false);
    }, 150); // 150ms buffer prevents accidental closure
  };

  // Mobile / Tablet Navigation Drawer State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileClinicalOpen, setMobileClinicalOpen] = useState(false);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (clinicalTimeoutRef.current) clearTimeout(clinicalTimeoutRef.current);
    };
  }, []);

  // Animated Counter States
  const [patientsCount, setPatientsCount] = useState(0);
  const [consultCount, setConsultCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [transparencyCount, setTransparencyCount] = useState(0);

  // Ref for Intersection Observer Counter
  const statsRef = useRef(null);

  // Hospital Branches Data
  const branches = ["SALT LAKE", "BERHAMPORE", "MIDNAPORE", "SILIGURI", "KOLKATA CENTRAL", "PURULIA", "BHAGALPUR", "DURGAPUR"];

  // Scroll-Triggered Animated Counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          runCounterAnimation();
        }
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const runCounterAnimation = () => {
    const duration = 2000;
    const steps = 60;
    const intervalTime = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeProgress = 1 - (1 - progress) * (1 - progress);

      setPatientsCount(Math.floor(easeProgress * 50));
      setConsultCount(Math.floor(easeProgress * 100));
      setStaffCount(Math.floor(easeProgress * 500));
      setTransparencyCount(Math.floor(easeProgress * 100));

      if (step >= steps) {
        clearInterval(timer);
        setPatientsCount(50);
        setConsultCount(100);
        setStaffCount(500);
        setTransparencyCount(100);
      }
    }, intervalTime);
  };

  const stats = [
    { value: "10+", label: "Integrated Modules" },
    { value: "4", label: "Dedicated User Roles" },
    { value: "24/7", label: "Real-time Access" },
    { value: "100%", label: "Digital Workflow" },
  ];

  const servicePills = [
    "All Services", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", 
    "General Surgery", "Oncology", "Gastroenterology", "Nephrology", "Dermatology", "Pathology"
  ];

  const clinicalTreatments = [
    [
      { icon: Heart, name: "Cardiology", desc: "Comprehensive heart care, ECG & angioplasty diagnostics." },
      { icon: Brain, name: "Neurology", desc: "Advanced brain, spine & peripheral nerve care." },
      { icon: Bone, name: "Orthopedics", desc: "Joint replacement, fracture care & spine surgery." },
      { icon: Baby, name: "Pediatrics", desc: "Specialized healthcare for infants, children & teens." }
    ],
    [
      { icon: Scissors, name: "General Surgery", desc: "Minimally invasive laparoscopic & emergency surgical care." },
      { icon: Zap, name: "Oncology Care", desc: "Comprehensive cancer diagnosis, chemotherapy & surgery." },
      { icon: Activity, name: "Gastroenterology", desc: "Digestive health, liver care & advanced endoscopy." },
      { icon: Pill, name: "Nephrology & Dialysis", desc: "Kidney disease management & 24/7 dialysis units." }
    ],
    [
      { icon: Stethoscope, name: "Dermatology", desc: "Advanced skin, hair & cosmetic laser treatments." },
      { icon: Activity, name: "Pulmonology", desc: "Respiratory care, asthma & lung disease treatment." },
      { icon: Eye, name: "Ophthalmology", desc: "Cataract, LASIK, glaucoma & pediatric vision care." },
      { icon: FlaskConical, name: "Pathology & Imaging", desc: "24/7 automated lab, MRI, CT Scan & X-Ray diagnostics." }
    ]
  ];

  const bookingSteps = [
    { num: "01", icon: Search, title: "Search For Doctors", desc: "Search for a doctor based on specialization, department, or location." },
    { num: "02", icon: UserCheck, title: "Check Doctor Profile", desc: "Explore detailed doctor profiles, qualifications & available time slots." },
    { num: "03", icon: Calendar, title: "Schedule Appointment", desc: "Pick your preferred doctor, select a date & confirm your consultation slot." },
    { num: "04", icon: Heart, title: "Get Medical Solution", desc: "Discuss health concerns with verified specialists & receive digital prescriptions." }
  ];

  const videoTestimonials = [
    { name: "Mr. Sabuj Sathi", treatment: "Orthopedic Care", quote: "I had joint pain for months. Thanks to SHDS doctors and digital appointment booking, my surgery and recovery were seamless." },
    { name: "Mr. S M Mahrul Islam", treatment: "Cardiology Consultation", quote: "The online record access and doctor response speed was incredible. I got my reports and prescription right on my phone." },
    { name: "Mrs. Ankita Ray", treatment: "General Surgery", quote: "Very professional staff and transparent billing system. The entire admission to discharge workflow was digitized and hassle-free." }
  ];

  const googleReviews = [
    { name: "Dr. A. K. Banerjee", rating: 5, quote: "SHDS is setting new standards in digital healthcare infrastructure. Seamless, fast, and highly reliable." },
    { name: "Priya Sharma", rating: 5, quote: "Extremely easy to book appointments for elderly parents. Excellent patient support and clean facility." },
    { name: "Rahul Verma", rating: 5, quote: "Digital prescriptions and instant billing made my hospital visit effortless. Highly recommended!" }
  ];

  const faqs = [
    { q: "How do I book an appointment with a doctor?", a: "Simply visit our website, log in or create an account, search for a doctor based on specialization or department, and select your preferred date & time slot." },
    { q: "Can I request a specific doctor when booking my appointment?", a: "Yes, you can browse all verified doctors by department, specialization, and real-time schedule to choose your preferred physician." },
    { q: "What should I do if I need to cancel or reschedule my appointment?", a: "You can manage your appointments directly from your patient dashboard with a single click." },
    { q: "What if I'm running late for my appointment?", a: "Please contact our customer support hotline as soon as possible. We will do our best to adjust or hold your consultation slot." },
    { q: "Can I book appointments for family members or dependents?", a: "Yes, you can manage family profiles and book consultation slots for them directly through your account." }
  ];

  const quickActions = [
    { icon: Calendar, title: "Book Appointment", desc: "Schedule a doctor visit online in 3 easy steps", href: "/sign-in", color: "from-blue-500 to-cyan-500" },
    { icon: UserCheck, title: "Patient Registration", desc: "Register new patients or manage existing medical ID", href: "/sign-up", color: "from-teal-500 to-emerald-500" },
    { icon: FileText, title: "Electronic Records", desc: "Access prescriptions, diagnosis & lab reports 24/7", href: "/sign-in", color: "from-indigo-500 to-blue-600" },
    { icon: PhoneCall, title: "Emergency & Helpline", desc: "Immediate assistance and 24x7 hospital support", href: "#contact", color: "from-sky-500 to-teal-600" },
  ];

  const features = [
    { icon: Users, title: "Patient Management", description: "Register patients, maintain digital health profiles, and track medical history seamlessly.", color: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
    { icon: Calendar, title: "Smart Scheduling", description: "Book, reschedule, and manage doctor availability with real-time slot tracking.", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300" },
    { icon: FileText, title: "Medical Records", description: "Centralized electronic medical records with diagnosis, allergies, and treatment details.", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
    { icon: Building2, title: "Department Portal", description: "Organize medical staff by specialty, manage hospital departments and schedules.", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" },
    { icon: Pill, title: "Digital Prescriptions", description: "Generate digital prescriptions with medicine tracking, dosage, and frequency guidance.", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
    { icon: Shield, title: "Role-Based Security", description: "Secure access controls tailored specifically for Admins, Doctors, Receptionists & Patients.", color: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toggleMissionVision = (key) => {
    setOpenMissionVision(openMissionVision === key ? null : key);
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-transparent font-sans">
      
      {/* 1. FIXED TOP HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full glass-panel shadow-soft transition-all duration-300 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        
        {/* Centered Top Utility Bar (desktop / large tablet only) */}
        <div className="hidden border-b border-border/30 bg-muted/40 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 xl:block">
          <div className="container mx-auto flex items-center justify-center gap-6 2xl:gap-10 px-6 flex-wrap">
            <a href="#who-we-are" className="hover:text-primary transition-colors cursor-pointer">Who We Are</a>
            <span className="hover:text-primary transition-colors cursor-pointer">Media Center</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Testimonial</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Annual Report</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Training</span>
            <span className="hover:text-primary transition-colors cursor-pointer">e-Magazine</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Career</span>
            <div className="flex items-center gap-1.5 text-foreground font-bold">
              <span>Call US:</span>
              <a href="tel:03340506500" className="text-sky-500 hover:underline">033 4050 6500</a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="container mx-auto flex h-18 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-12 relative">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="gradient-primary rounded-2xl p-2 sm:p-2.5 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Activity className="size-5 sm:size-6 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">SHDS</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest -mt-1 hidden sm:block">Smart Hospital System</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-bold text-foreground">
            <Link href="/" onClick={() => setActiveNav("branches")} className={`whitespace-nowrap transition-colors ${activeNav === "branches" ? "text-primary" : "hover:text-primary"}`}>Our Branches</Link>
            <Link href="/sign-in" onClick={() => setActiveNav("doctor")} className={`whitespace-nowrap transition-colors ${activeNav === "doctor" ? "text-primary" : "hover:text-primary"}`}>Doctor</Link>

            {/* Mega Dropdown Trigger with Hover Bridge */}
            <div 
              className="py-6 cursor-pointer"
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
              onClick={() => setActiveNav("clinical")}
            >
              <div className={`flex items-center gap-1.5 whitespace-nowrap transition-colors ${activeNav === "clinical" || showClinicalMenu ? "text-primary" : "hover:text-primary"}`}>
                <span>Clinical Service</span>
                <ChevronDown className={`size-3.5 transition-transform duration-300 ${showClinicalMenu ? 'rotate-180 text-primary' : ''}`} />
              </div>

              {showClinicalMenu && (
                <div 
                  className="fixed left-1/2 -translate-x-1/2 top-[72px] sm:top-[76px] xl:top-[106px] w-[min(980px,94vw)] bg-card rounded-3xl border border-border/60 shadow-2xl p-6 sm:p-8 z-50 animate-in fade-in slide-in-from-top-2 duration-200 cursor-default before:absolute before:-top-6 before:left-0 before:right-0 before:h-6 before:content-['']"
                  onMouseEnter={openMenu}
                  onMouseLeave={closeMenu}
                >
                  <div className="mb-6 pb-3 border-b border-border/40 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground">
                      Our <span className="text-primary border-b-2 border-primary pb-0.5">Clinical</span> Services
                    </h3>
                    <Badge variant="outline" className="text-xs font-semibold px-3 py-0.5 rounded-full border-primary/30 text-primary bg-primary/5">
                      24/7 Multi-Specialty
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {clinicalTreatments.map((col, colIdx) => (
                      <div key={colIdx} className="space-y-4">
                        {col.map((item) => (
                          <div 
                            key={item.name} 
                            className="group/item flex items-start gap-3.5 p-2 rounded-2xl border border-transparent hover:border-border/50 hover:bg-muted/40 transition-all duration-200 cursor-pointer"
                          >
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all duration-200 shrink-0 mt-0.5">
                              <item.icon className="size-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-foreground group-hover/item:text-primary transition-colors">
                                {item.name}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 font-medium leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* Right Promo Card */}
                    <div className="hidden xl:flex rounded-2xl overflow-hidden border border-border/50 bg-gradient-to-br from-primary/10 via-card to-card p-4 flex-col justify-between shadow-soft">
                      <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-800 border border-white/20">
                        <div className="absolute inset-0 gradient-hero flex items-center justify-center p-4 text-center">
                          <div className="space-y-1">
                            <Building2 className="size-8 text-cyan-300 mx-auto opacity-80" />
                            <p className="text-xs font-bold text-white tracking-wide">SHDS Super Specialty Facility</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs font-bold text-foreground">24x7 Multi-Specialty Care</p>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                          Equipped with modular OT, ICU, & digital diagnostics.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="#features" onClick={() => setActiveNav("partnership")} className={`whitespace-nowrap transition-colors ${activeNav === "partnership" ? "text-primary" : "hover:text-primary"}`}>Partnership Opportunity</Link>
            <Link href="#features" onClick={() => setActiveNav("outreach")} className={`whitespace-nowrap transition-colors ${activeNav === "outreach" ? "text-primary" : "hover:text-primary"}`}>Social Outreach</Link>
            <Link href="#contact" onClick={() => setActiveNav("contact")} className={`whitespace-nowrap transition-colors ${activeNav === "contact" ? "text-primary" : "hover:text-primary"}`}>Contact Us</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/sign-in" className="hidden lg:block">
              <Button className="gradient-primary border-0 rounded-full px-4 xl:px-6 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold h-9 xl:h-11 text-sm whitespace-nowrap">
                Book An Appointment
              </Button>
            </Link>
            <Link href="/sign-in" className="hidden lg:block">
              <Button variant="outline" className="rounded-full px-4 xl:px-6 font-bold border-primary/30 text-primary hover:bg-primary/10 h-9 xl:h-11 transition-all text-sm whitespace-nowrap">
                Login
              </Button>
            </Link>

            {/* Mobile / Tablet Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="lg:hidden inline-flex items-center justify-center rounded-xl h-11 w-11 border border-border/50 bg-card text-foreground hover-zoom active:scale-95 transition-transform"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>

      </header>

      {/* MOBILE / TABLET NAVIGATION DRAWER */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[86vw] max-w-sm bg-card shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-18 sm:h-20 px-5 border-b border-border/40 shrink-0">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
              <div className="gradient-primary rounded-xl p-2 shadow-md">
                <Activity className="size-5 text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-foreground">SHDS</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="inline-flex items-center justify-center rounded-xl h-10 w-10 hover:bg-muted transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-1 text-base font-bold text-foreground">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-3.5 hover:bg-muted/60 hover:text-primary transition-colors">
              Our Branches
            </Link>
            <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-3.5 hover:bg-muted/60 hover:text-primary transition-colors">
              Doctor
            </Link>

            {/* Collapsible Clinical Services */}
            <div className="rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileClinicalOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/60 hover:text-primary transition-colors rounded-xl"
              >
                <span>Clinical Service</span>
                <ChevronDown className={`size-4 transition-transform duration-300 ${mobileClinicalOpen ? "rotate-180 text-primary" : ""}`} />
              </button>
              {mobileClinicalOpen && (
                <div className="pl-2 pr-1 pb-2 pt-1 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  {clinicalTreatments.flat().map((item) => (
                    <div key={item.name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted/50 hover:text-primary transition-colors">
                      <item.icon className="size-4 text-primary shrink-0" />
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-3.5 hover:bg-muted/60 hover:text-primary transition-colors">
              Partnership Opportunity
            </Link>
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-3.5 hover:bg-muted/60 hover:text-primary transition-colors">
              Social Outreach
            </Link>
            <Link href="#contact" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-4 py-3.5 hover:bg-muted/60 hover:text-primary transition-colors">
              Contact Us
            </Link>

            <div className="pt-3 flex items-center gap-2 px-4 text-sm font-bold text-foreground">
              <Phone className="size-4 text-primary shrink-0" />
              <a href="tel:03340506500" className="hover:text-primary">033 4050 6500</a>
            </div>
          </nav>

          <div className="p-5 border-t border-border/40 space-y-3 shrink-0">
            <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button className="gradient-primary border-0 rounded-full w-full font-bold h-12 text-base shadow-md">
                Book An Appointment
              </Button>
            </Link>
            <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button variant="outline" className="rounded-full w-full font-bold border-primary/30 text-primary h-12 text-base">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN SCROLLABLE CONTENT */}
      <main className="flex-1 pt-18 sm:pt-20 xl:pt-[112px]">
        
        {/* HOSPITAL LOCATIONS BAR */}
        <div className="bg-slate-900 text-slate-300 py-2.5 text-sm font-bold border-b border-slate-800 overflow-hidden">

          {/* MOBILE: infinite auto-rotating marquee */}
          <div className="sm:hidden">
            <div className="marquee-track gap-6 px-0">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex items-center gap-6 px-4 shrink-0">
                  <span className="text-cyan-400 uppercase tracking-wider shrink-0">HOSPITAL LOCATIONS:</span>
                  {branches.map((b) => (
                    <span key={`${copy}-${b}`} className="hover:text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap">
                      {b}
                    </span>
                  ))}
                  <span className="text-slate-600 shrink-0">•</span>
                </div>
              ))}
            </div>
          </div>

          {/* DESKTOP: static centered row */}
          <div className="hidden sm:block container mx-auto px-6">
            <div className="flex flex-wrap items-center justify-center gap-4 text-center">
              <span className="text-cyan-400 uppercase tracking-wider shrink-0">HOSPITAL LOCATIONS:</span>
              {branches.map((b) => (
                <span key={b} className="hover:text-white transition-colors cursor-pointer shrink-0">{b}</span>
              ))}
            </div>
          </div>

        </div>

        {/* HERO SECTION */}
        <section className="gradient-hero relative overflow-hidden rounded-b-[2rem] sm:rounded-b-[2.5rem] lg:rounded-b-[4rem] shadow-soft">
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <div className="absolute -right-20 -top-20 h-[550px] w-[500px] rounded-full bg-teal-400 blur-[120px] mix-blend-screen animate-pulse" />
            <div className="absolute -left-32 bottom-0 h-[450px] w-[450px] rounded-full bg-cyan-400 blur-[120px] mix-blend-screen" />
          </div>

          <div className="container relative mx-auto flex flex-col items-center px-4 sm:px-6 py-14 sm:py-20 text-center lg:py-28">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 sm:px-5 py-2 text-sm font-semibold text-white backdrop-blur-md shadow-inner">
              <Sparkles className="size-4 text-teal-300 shrink-0" />
              <span>Smart Hospital Digitalization System</span>
            </div>

            <h1 className="mt-6 sm:mt-8 max-w-5xl text-[clamp(2.1rem,6vw,4.5rem)] font-black tracking-tight text-white leading-[1.22] sm:leading-[1.18] overflow-visible">
              <TextReveal text="Modern Healthcare" as="span" className="block pb-1" staggerMs={45} />
              <ShimmerText as="span" className="block pb-3 sm:pb-4 pt-1 bg-gradient-to-r from-teal-300 via-sky-200 to-teal-300">
                Management Platform
              </ShimmerText>
            </h1>

            <p className="animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-5 sm:mt-6 max-w-2xl text-base sm:text-lg text-sky-100 font-medium leading-relaxed">
              Digitize hospital operations, manage patient records, schedule appointments, and streamline clinical workflows — all from a single centralized platform.
            </p>

            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button size="lg" className="gradient-accent h-13 sm:h-14 rounded-full border-0 text-white font-extrabold px-9 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-base w-full sm:w-auto">
                  Start Free Trial <ArrowRight className="ml-2 size-5" />
                </Button>
              </Link>
              <Link href="/sign-in" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="h-13 sm:h-14 rounded-full border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 font-bold px-9 transition-all hover:scale-105 duration-300 text-base w-full sm:w-auto">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>

            {/* Live Stats */}
            <div className="animate-in fade-in duration-1000 delay-300 mt-10 sm:mt-16 grid w-full max-w-4xl grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-4">
              {stats.map((stat) => (
                <ZoomHover key={stat.label} strength="sm" lift={false} className="group rounded-2xl sm:rounded-3xl border border-white/15 bg-white/10 p-4 sm:p-6 backdrop-blur-xl hover:bg-white/20 hover:border-white/40 shadow-soft">
                  <p className="text-2xl sm:text-4xl font-black text-white group-hover:text-teal-300 transition-colors">{stat.value}</p>
                  <p className="text-xs sm:text-sm font-semibold text-teal-100/80 uppercase tracking-wider mt-1">{stat.label}</p>
                </ZoomHover>
              ))}
            </div>
          </div>
        </section>

        {/* INSTANT ACCESS QUICK ACTIONS */}
        <ScrollFadeIn className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 relative z-20">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((item) => (
              <Link key={item.title} href={item.href} className="group block">
                <GlowHover color="primary" className="h-full rounded-3xl">
                  <ZoomHover strength="sm" className="h-full rounded-3xl border border-border/40 bg-card/75 backdrop-blur-xl supports-[backdrop-filter]:bg-card/65 p-6 shadow-soft hover:shadow-hover hover:border-primary/40 relative overflow-hidden">
                    <div className="flex items-start justify-between">
                      <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <item.icon className="size-6" />
                      </div>
                      <ArrowUpRight className="size-5 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mt-4 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
                  </ZoomHover>
                </GlowHover>
              </Link>
            ))}
          </div>
        </ScrollFadeIn>

        {/* WHO WE ARE & MISSION/VISION SECTION */}
        <ScrollFadeIn>
          <section id="who-we-are" className="border-y border-border/40 bg-card/40 backdrop-blur-md py-14 sm:py-20 scroll-mt-36">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12 grid gap-10 lg:gap-12 lg:grid-cols-2 items-center">
              
              <div className="space-y-6">
                <Badge className="px-3.5 py-1 rounded-full font-bold bg-primary text-white border-0">
                  Who We Are
                </Badge>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
                  <TextReveal text="Providing Excellence In" /> <span className="text-primary">Healthcare</span>
                </h2>
                <p className="text-muted-foreground font-medium leading-relaxed text-base">
                  SHDS has stood at the forefront of compassionate, cutting-edge digital healthcare. Our mission is to seamlessly connect doctors, administrative workflows, and patient care with 100% digital transparency.
                </p>

                {/* Accordion */}
                <div className="space-y-4 pt-2">
                  <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/70 overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() => toggleMissionVision("mission")}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-base text-foreground hover:text-primary transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary"><ShieldCheck className="size-5" /></div>
                        Our Mission
                      </span>
                      <div className={`p-1 rounded-lg border ${openMissionVision === "mission" ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                        {openMissionVision === "mission" ? <Minus className="size-4" /> : <Plus className="size-4" />}
                      </div>
                    </button>
                    {openMissionVision === "mission" && (
                      <div className="px-6 pb-5 text-sm font-medium text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                        1. Striving for holistic patient satisfaction.<br />
                        2. Ensuring transparency for patients and healthcare professionals.<br />
                        3. Continuous quality improvement through digital workflows and training.
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/70 overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() => toggleMissionVision("vision")}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-base text-foreground hover:text-primary transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"><Eye className="size-5" /></div>
                        Our Vision
                      </span>
                      <div className={`p-1 rounded-lg border ${openMissionVision === "vision" ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                        {openMissionVision === "vision" ? <Minus className="size-4" /> : <Plus className="size-4" />}
                      </div>
                    </button>
                    {openMissionVision === "vision" && (
                      <div className="px-6 pb-5 text-sm font-medium text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                        To become the most trusted digital hospital ecosystem, empowering medical staff with automated tools and offering patients friction-free access to health services.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <GlowHover color="accent" className="rounded-3xl">
                <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-hover gradient-hero p-6 sm:p-8 text-white min-h-[340px] sm:min-h-[380px] flex flex-col justify-between">
                  <div className="space-y-3 relative z-10">
                    <Badge className="bg-white/10 text-white backdrop-blur-md border border-white/20">Super Specialty Hub</Badge>
                    <h3 className="text-2xl font-bold">Integrated Digital Hospital Infrastructure</h3>
                    <p className="text-sky-100 text-sm sm:text-base font-medium leading-relaxed">
                      Serving thousands of daily consultations across multiple locations with cloud medical records, real-time doctor availability, and smart billing.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-6 border-t border-white/15 relative z-10 text-sm font-semibold text-teal-200">
                    <span>📍 Salt Lake City, Kolkata</span>
                    <span>24/7 Digital Operations</span>
                  </div>
                </div>
              </GlowHover>

            </div>
          </section>
        </ScrollFadeIn>

        {/* HORIZONTAL SERVICE PILLS BAR */}
        <section className="border-y border-border/50 bg-gradient-to-r from-primary/10 via-accent/15 to-primary/10 backdrop-blur-xl py-4 sm:py-5 shadow-inner overflow-hidden">
          <div className="sm:hidden">
            <div className="marquee-track gap-3" style={{ pointerEvents: "none" }}>
              {[0, 1].map((copy) => (
                <div key={copy} className="flex items-center gap-3 px-3 shrink-0">
                  {servicePills.map((pill, idx) => (
                    <span
                      key={`${copy}-${pill}`}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap select-none transition-all duration-300 ${
                        idx === 0
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "border border-border/60 bg-card/85 text-foreground backdrop-blur-md hover:border-primary/40 hover:bg-card"
                      }`}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex container mx-auto px-6 items-center justify-center gap-3" style={{ pointerEvents: "none" }}>
            {servicePills.map((pill, idx) => (
              <span
                key={pill}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap select-none transition-all duration-300 ${
                  idx === 0
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "border border-border/60 bg-card/85 text-foreground backdrop-blur-md hover:border-primary/40 hover:bg-card"
                }`}
              >
                {pill}
              </span>
            ))}
          </div>
        </section>

        {/* COMPELLING REASONS TO CHOOSE */}
        <ScrollFadeIn className="container mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="text-center mb-10 sm:mb-12 space-y-2">
            <Badge variant="outline" className="px-4 py-1 rounded-full font-bold border-cyan-500/30 text-cyan-500 bg-cyan-500/10">
              &bull; Why Book With Us &bull;
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Compelling Reasons to Choose
            </h2>
          </div>

          <div className="grid gap-5 sm:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Heart, title: "Affordable Healthcare", desc: "High quality medical care at transparent and affordable costs." },
              { icon: Zap, title: "State-of-the-Art Tech", desc: "Equipped with modern digital diagnostics and modular OT infrastructure." },
              { icon: ShieldCheck, title: "Comprehensive Services", desc: "All medical specialties and lab diagnostics under a single roof." },
              { icon: Smile, title: "Patient-Centric Approach", desc: "Empathetic doctors and personalized clinical attention for every patient." }
            ].map((pillar, idx) => (
              <ScrollFadeIn key={pillar.title} delay={idx * 100}>
                <GlowHover color="primary" className="h-full rounded-3xl">
                  <ZoomHover strength="sm" className="group h-full rounded-3xl border border-border/50 bg-card/75 backdrop-blur-xl supports-[backdrop-filter]:bg-card/65 p-7 sm:p-8 shadow-soft hover:shadow-hover text-center">
                    <div className="p-4 rounded-2xl bg-primary/10 text-primary mx-auto w-fit mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                      <pillar.icon className="size-8" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{pillar.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">{pillar.desc}</p>
                  </ZoomHover>
                </GlowHover>
              </ScrollFadeIn>
            ))}
          </div>
        </ScrollFadeIn>

        {/* 4-STEP BOOKING WORKFLOW */}
        <ScrollFadeIn className="container mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="text-center mb-10 sm:mb-16 space-y-2">
            <Badge variant="outline" className="px-4 py-1 rounded-full font-bold border-primary/30 text-primary bg-primary/5">
              Frictionless Access
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Get Medical Care in 4 Easy Steps
            </h2>
          </div>

          <div className="grid gap-5 sm:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
            {bookingSteps.map((step, idx) => (
              <ScrollFadeIn key={step.num} delay={idx * 100}>
                <GlowHover color="accent" className="h-full rounded-3xl">
                  <ZoomHover strength="sm" className="group h-full rounded-3xl border border-border/50 bg-card/75 backdrop-blur-xl supports-[backdrop-filter]:bg-card/65 p-6 shadow-soft hover:shadow-hover relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-primary/40 group-hover:text-primary transition-colors">{step.num}</span>
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <step.icon className="size-6" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">{step.desc}</p>
                  </ZoomHover>
                </GlowHover>
              </ScrollFadeIn>
            ))}
          </div>
        </ScrollFadeIn>

        {/* FEATURE CARDS GRID */}
        <ScrollFadeIn className="container mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <div className="text-center mb-10 sm:mb-16 space-y-3">
            <Badge variant="outline" className="px-4 py-1 rounded-full font-bold border-primary/30 text-primary bg-primary/5">
              Comprehensive Care
            </Badge>
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Complete Hospital Management Solution
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base font-medium">
              Designed to optimize hospital operational efficiency, clinical workflows, and patient experiences.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <ScrollFadeIn key={feature.title} delay={idx * 100}>
                <GlowHover color="primary" className="h-full rounded-3xl">
                  <ZoomHover strength="sm" className="group h-full rounded-3xl border border-border/50 bg-card/75 backdrop-blur-xl supports-[backdrop-filter]:bg-card/65 p-7 sm:p-8 shadow-soft hover:shadow-hover relative overflow-hidden">
                    <div className={`mb-6 inline-flex rounded-2xl p-4 transition-transform duration-500 group-hover:scale-110 ${feature.color}`}>
                      <feature.icon className="size-7" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-sm sm:text-base font-medium text-muted-foreground leading-relaxed">{feature.description}</p>

                    <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
                  </ZoomHover>
                </GlowHover>
              </ScrollFadeIn>
            ))}
          </div>
        </ScrollFadeIn>

        {/* TESTIMONIALS */}
        <ScrollFadeIn className="border-t border-border/40 bg-card/30 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center mb-10 space-y-3">
              <Badge className="px-4 py-1 rounded-full font-bold bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-0 uppercase tracking-widest text-xs">
                &bull; Testimonials &bull;
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
                Gratitude Like This Fuels Our Passion
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-10 sm:mb-12">
              <button
                type="button"
                onClick={() => setActiveTab("video")}
                className={`px-5 sm:px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover-zoom ${
                  activeTab === "video" 
                    ? "bg-primary text-white shadow-md scale-105" 
                    : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                Patient Stories
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("google")}
                className={`px-5 sm:px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover-zoom ${
                  activeTab === "google" 
                    ? "bg-primary text-white shadow-md scale-105" 
                    : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                Verified Google Reviews
              </button>
            </div>

            <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-3">
              {activeTab === "video" ? (
                videoTestimonials.map((item, idx) => (
                  <ScrollFadeIn key={item.name} delay={idx * 100}>
                    <GlowHover color="accent" className="h-full rounded-3xl">
                      <ZoomHover strength="sm" lift className="group h-full rounded-3xl border border-border/50 bg-card p-6 shadow-soft hover:shadow-hover">
                        <Quote className="size-8 text-primary/30 mb-3 group-hover:text-primary transition-colors" />
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed italic mb-6">"{item.quote}"</p>
                        <div className="pt-4 border-t border-border/40">
                          <p className="font-bold text-foreground text-sm">{item.name}</p>
                          <p className="text-xs font-semibold text-primary mt-0.5">{item.treatment}</p>
                        </div>
                      </ZoomHover>
                    </GlowHover>
                  </ScrollFadeIn>
                ))
              ) : (
                googleReviews.map((item, idx) => (
                  <ScrollFadeIn key={item.name} delay={idx * 100}>
                    <GlowHover color="accent" className="h-full rounded-3xl">
                      <ZoomHover strength="sm" lift className="group h-full rounded-3xl border border-border/50 bg-card p-6 shadow-soft hover:shadow-hover">
                        <div className="flex items-center gap-1 text-amber-400 mb-3">
                          {[...Array(item.rating)].map((_, i) => <Star key={i} className="size-4 fill-amber-400" />)}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed italic mb-6">"{item.quote}"</p>
                        <div className="pt-4 border-t border-border/40">
                          <p className="font-bold text-foreground text-sm">{item.name}</p>
                          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">Verified Patient Review</p>
                        </div>
                      </ZoomHover>
                    </GlowHover>
                  </ScrollFadeIn>
                ))
              )}
            </div>
          </div>
        </ScrollFadeIn>

        {/* ANIMATED COUNTER STATS BAR */}
        <section ref={statsRef} className="gradient-hero text-white py-14 sm:py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center relative z-10">
            <div className="space-y-1">
              <p className="text-3xl sm:text-6xl font-black tracking-tight">{patientsCount}K+</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal-200 mt-2">Happy Patients</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-6xl font-black tracking-tight">{consultCount}K+</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal-200 mt-2">Consultations Completed</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-6xl font-black tracking-tight">{staffCount}+</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal-200 mt-2">Medical Professionals</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-6xl font-black tracking-tight">{transparencyCount}%</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal-200 mt-2">Digital Transparency</p>
            </div>
          </div>
        </section>

        {/* PARTNER ACCREDITATIONS STRIP */}
        <ScrollFadeIn className="py-10 sm:py-12 bg-card border-y border-border/40">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <Badge variant="outline" className="px-4 py-1 rounded-full font-bold border-primary/30 text-primary bg-primary/5 mb-6">
              &bull; Together in Care, Stronger in Purpose &bull;
            </Badge>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8 lg:gap-x-12 opacity-70 hover:opacity-100 transition-all duration-300">
              <span className="font-extrabold text-sm tracking-wider">NABH ACCREDITED</span>
              <span className="font-extrabold text-sm tracking-wider">NABL LABS</span>
              <span className="font-extrabold text-sm tracking-wider">ISO 9001:2015</span>
              <span className="font-extrabold text-sm tracking-wider">HEALTHCARE TRUST</span>
              <span className="font-extrabold text-sm tracking-wider">DIGITAL HEALTH NETWORK</span>
            </div>
          </div>
        </ScrollFadeIn>

        {/* FAQ ACCORDION SECTION */}
        <ScrollFadeIn className="border-t border-border/40 bg-card/30 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="text-center mb-10 sm:mb-12 space-y-3">
              <Badge className="px-4 py-1 rounded-full font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-sm border-0 uppercase tracking-widest text-xs">
                &bull; FAQ&apos;S &bull;
              </Badge>
              <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
                Your Questions are Answered
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <GlowHover
                    key={faq.q}
                    color="primary"
                    intensity="sm"
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs ${isOpen ? 'border-primary/50 bg-card' : 'border-border/50 bg-card/60'}`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-bold text-base sm:text-lg text-foreground hover:text-primary transition-colors"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <div className={`p-1.5 rounded-lg border shrink-0 transition-all duration-300 ${isOpen ? 'bg-primary text-white border-primary' : 'bg-muted/50 border-border/50 text-muted-foreground'}`}>
                        {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-0 text-sm sm:text-base font-medium text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300 border-t border-border/30 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </GlowHover>
                );
              })}
            </div>
          </div>
        </ScrollFadeIn>

      </main>

      {/* DETAILED FOOTER */}
      <footer id="contact" className="bg-card pt-12 sm:pt-16 pb-10 sm:pb-12">
        <ScrollFadeIn className="container mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Callout Banner */}
          <div className="gradient-hero rounded-[1.75rem] sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 text-white shadow-xl relative overflow-hidden mb-12 sm:mb-16">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
              <div className="max-w-xl space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Smart Care, Modern Health — Since 2024
                </h3>
                <p className="text-sky-100 text-sm sm:text-base font-medium leading-relaxed">
                  Thousands of Smiles, Millions of Clearer Tomorrows. For over a decade, SHDS has stood at the forefront of compassionate, cutting-edge digital healthcare.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full lg:w-auto">
                <ZoomHover strength="sm" lift={false} className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                  <div className="p-3 bg-white/20 rounded-xl text-white shrink-0">
                    <Headset className="size-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-teal-200 uppercase tracking-wider">Customer Support</p>
                    <p className="text-base font-extrabold text-white">033 4050 6500</p>
                  </div>
                </ZoomHover>

                <ZoomHover strength="sm" lift={false} className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                  <div className="p-3 bg-white/20 rounded-xl text-white shrink-0">
                    <Mail className="size-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-teal-200 uppercase tracking-wider">Drop Us an Email</p>
                    <p className="text-sm font-bold text-white break-all">contactus@shds.org</p>
                  </div>
                </ZoomHover>
              </div>
            </div>
          </div>

          {/* Footer Grid */}
          <div className="grid gap-8 sm:gap-10 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 text-sm">
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h4 className="font-extrabold text-foreground text-base mb-4">Quick Links</h4>
              <ul className="space-y-2.5 font-medium text-muted-foreground text-sm">
                <li><a href="#who-we-are" className="hover:text-primary transition-colors">About Us</a></li>
                <li><Link href="/sign-in" className="hover:text-primary transition-colors">Doctors</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Our Branches</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div className="space-y-3 lg:pt-9">
              <h4 className="font-extrabold text-foreground text-base mb-4 sm:hidden">Policies</h4>
              <ul className="space-y-2.5 font-medium text-muted-foreground text-sm">
                <li><Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Terms and Conditions</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Cancellation Policy</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Refund Policy</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-extrabold text-foreground text-base mb-4">Clinical Services</h4>
              <ul className="space-y-2.5 font-medium text-muted-foreground text-sm">
                <li><Link href="/" className="hover:text-primary transition-colors">Cardiology</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Neurology</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Retina & Ophthalmology</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Orthopedics</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Pediatric Care</Link></li>
              </ul>
            </div>

            <div className="space-y-3 lg:pt-9">
              <h4 className="font-extrabold text-foreground text-base mb-4 sm:hidden">More Services</h4>
              <ul className="space-y-2.5 font-medium text-muted-foreground text-sm">
                <li><Link href="/" className="hover:text-primary transition-colors">General Medicine</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Laser Correction</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Radiology</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Pathology Lab Services</Link></li>
              </ul>
            </div>

            <div className="space-y-4 col-span-2 sm:col-span-2 lg:col-span-1">
              <h4 className="font-extrabold text-foreground text-base mb-4">Contact Us</h4>
              <div className="flex items-start gap-3 text-muted-foreground text-sm font-medium">
                <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                <span>HB-36/A/1, Sec.-III, Salt Lake City, Kolkata – 700106</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                <Mail className="size-4 text-primary shrink-0" />
                <span className="break-all">contactus@shds.org</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                <Phone className="size-4 text-primary shrink-0" />
                <span className="font-bold text-foreground">033 4050 6500</span>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="p-2.5 rounded-full bg-muted/60 hover:bg-primary hover:text-white transition-all text-foreground hover-zoom" aria-label="Facebook">
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-4.873-12-10.875-12S2.25 5.446 2.25 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H9.703v-3.47h2.672V9.423c0-2.637 1.616-4.08 3.97-4.08 1.127 0 2.304.2 2.304.2v2.53h-1.296c-1.297 0-1.701.806-1.701 1.632v1.958h2.852l-.456 3.47h-2.396v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="p-2.5 rounded-full bg-muted/60 hover:bg-primary hover:text-white transition-all text-foreground hover-zoom" aria-label="X">
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="p-2.5 rounded-full bg-muted/60 hover:bg-primary hover:text-white transition-all text-foreground hover-zoom" aria-label="Instagram">
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="p-2.5 rounded-full bg-muted/60 hover:bg-primary hover:text-white transition-all text-foreground hover-zoom" aria-label="YouTube">
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.016 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          <div className="border-t border-border/40 mt-10 sm:mt-12 pt-6 text-center text-xs sm:text-sm font-semibold text-muted-foreground">
            &copy; {new Date().getFullYear()} Smart Hospital Digitalization System (SHDS). All rights reserved.
          </div>

        </ScrollFadeIn>
      </footer>

    </div>
  );
}