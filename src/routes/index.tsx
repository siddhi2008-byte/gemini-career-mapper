import { createFileRoute } from "@tanstack/react-router";
import {
  Upload,
  Sparkles,
  LineChart,
  FileText,
  CheckCircle2,
  Target,
  ArrowRight,
  Compass,
  Code2,
  Trophy,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { useReveal } from "../hooks/use-reveal";
import { useResumeAnalysis, AnalysisSection } from "../components/resume-analysis";
import heroBg from "../assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Career Compass — AI Career Navigator" },
      {
        name: "description",
        content:
          "Upload your resume and let Gemini AI guide your career. Get top 3 career matches, a 90-day roadmap, and an ATS score instantly.",
      },
      { property: "og:title", content: "Career Compass — AI Career Navigator" },
      {
        property: "og:description",
        content:
          "Upload your resume and let Gemini AI guide your career. Get top 3 career matches, a 90-day roadmap, and an ATS score instantly.",
      },
    ],
  }),
  component: CareerCompass,
});

function CareerCompass() {
  useReveal();
  const { openPicker, fileInput, status, error, result, fileName, busy } =
    useResumeAnalysis();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {fileInput}
      <NavBar onUpload={openPicker} busy={busy} />
      <Hero onUpload={openPicker} busy={busy} />
      <AnalysisSection status={status} error={error} result={result} fileName={fileName} />
      <HowItWorks />
      <DashboardMockup />
      <SiteFooter />
    </div>
  );
}

/* ============================================================ */
/* NAV BAR                                                       */
/* ============================================================ */
function NavBar({ onUpload, busy }: { onUpload: () => void; busy: boolean }) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Compass className="h-7 w-7 text-primary" />
          <span className="font-display text-lg font-bold tracking-tight">
            Career<span className="text-primary">Compass</span>
          </span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How it Works
          </a>
          <a href="#dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </a>
          <button
            type="button"
            onClick={onUpload}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload Resume
          </button>
        </div>
      </nav>
    </header>
  );
}

/* ============================================================ */
/* HERO SECTION                                                  */
/* ============================================================ */
function Hero({ onUpload, busy }: { onUpload: () => void; busy: boolean }) {
  return (
    <section
      id="hero-upload"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1080}
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
      </div>

      {/* Floating decorative orbs */}
      <div className="absolute left-10 top-32 h-24 w-24 rounded-full bg-primary/20 blur-2xl animate-float" />
      <div
        className="absolute right-16 top-48 h-32 w-32 rounded-full bg-accent/20 blur-3xl animate-float"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute bottom-20 left-1/4 h-20 w-20 rounded-full bg-primary/15 blur-2xl animate-float"
        style={{ animationDelay: "0.8s" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div
          className="fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary"
          style={{ animationDelay: "0.1s" }}
        >
          <Sparkles className="h-4 w-4" />
          Powered by Gemini AI
        </div>

        <h1
          className="fade-up font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ animationDelay: "0.25s" }}
        >
          Confused about your career?
          <br />
          <span className="text-gradient">Let AI guide you.</span>
        </h1>

        <p
          className="fade-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          style={{ animationDelay: "0.4s" }}
        >
          Upload your resume, get Top 3 career matches with 90-day roadmap and
          ATS score.
        </p>

        <div
          className="fade-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          style={{ animationDelay: "0.55s" }}
        >
          <button
            type="button"
            onClick={onUpload}
            disabled={busy}
            className="animate-pulse-glow inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
            {busy ? "Analyzing…" : "Upload Resume"}
          </button>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 text-base font-medium text-foreground transition-colors hover:bg-secondary"
          >
            See How It Works
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>

        {/* Trust indicators */}
        <div
          className="fade-up mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
          style={{ animationDelay: "0.7s" }}
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            Free to use
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            AI-powered analysis
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            Instant results
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-muted-foreground/40 p-1">
          <div className="h-2 w-1 rounded-full bg-muted-foreground animate-scroll-bounce" />
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* HOW IT WORKS                                                  */
/* ============================================================ */
function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      number: "01",
      title: "Upload Resume",
      desc: "Simply drag and drop your resume in PDF or DOCX format. Our system processes it instantly and securely.",
    },
    {
      icon: Sparkles,
      number: "02",
      title: "Gemini AI Analysis",
      desc: "Google's Gemini AI analyzes your skills, experience, and interests to identify the best career paths for you.",
    },
    {
      icon: LineChart,
      number: "03",
      title: "Get Roadmap + ATS Score",
      desc: "Receive your top 3 career matches, a personalized 90-day roadmap, and an ATS compatibility score.",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 md:py-32">
      <div className="grid-pattern absolute inset-0 opacity-30" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="reveal text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Three simple steps to your{" "}
            <span className="text-gradient">dream career</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From resume upload to actionable roadmap — powered by AI in under a
            minute.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="reveal group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-8 transition-all hover:border-primary/50 hover:bg-card"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Glow on hover */}
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:bg-primary/10" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="font-display text-5xl font-bold text-border/50">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-xl font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>

                {/* Connector line (hidden on mobile) */}
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden h-px w-8 translate-x-full bg-gradient-to-r from-primary/40 to-transparent md:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* DASHBOARD MOCKUP                                              */
/* ============================================================ */
function DashboardMockup() {
  return (
    <section id="dashboard" className="relative py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="reveal text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Dashboard Preview
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Your personalized{" "}
            <span className="text-gradient">career dashboard</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            See what you get instantly after uploading your resume.
          </p>
        </div>

        <div className="reveal mt-16 overflow-hidden rounded-3xl border border-border bg-card/50 shadow-2xl glow-primary">
          {/* Mock browser bar */}
          <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-6 py-3">
            <div className="h-3 w-3 rounded-full bg-destructive/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
            <div className="ml-4 flex-1 rounded-md bg-background/50 px-4 py-1 text-center text-xs text-muted-foreground">
              careercompass.app/dashboard
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[2fr_3fr] lg:p-8">
            {/* LEFT — Resume Preview */}
            <div className="rounded-2xl border border-border bg-background/50 p-6">
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Resume Preview
                </h3>
              </div>

              <div className="mt-4 space-y-3">
                {/* Name block */}
                <div className="space-y-1">
                  <div className="h-4 w-3/4 rounded bg-foreground/20" />
                  <div className="h-2 w-1/2 rounded bg-muted-foreground/30" />
                </div>
                {/* Lines simulating text */}
                {["100%", "83%", "66%", "100%", "75%", "50%"].map((w, i) => (
                  <div
                    key={i}
                    className="h-2 rounded bg-muted-foreground/20"
                    style={{ width: w }}
                  />
                ))}

                <div className="pt-3">
                  <div className="h-3 w-1/3 rounded bg-primary/30" />
                </div>
                {["100%", "83%", "66%"].map((w, i) => (
                  <div
                    key={i}
                    className="mt-2 h-2 rounded bg-muted-foreground/20"
                    style={{ width: w }}
                  />
                ))}

                <div className="pt-3">
                  <div className="h-3 w-1/4 rounded bg-accent/30" />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Python", "SQL", "Excel", "Tableau", "Statistics"].map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT — Results */}
            <div className="space-y-6">
              {/* Top 3 Careers */}
              <div className="rounded-2xl border border-border bg-background/50 p-6">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Top 3 Career Matches
                  </h3>
                </div>

                <div className="mt-4 space-y-4">
                  <CareerMatch
                    rank={1}
                    title="Data Analyst"
                    match={92}
                    accent="primary"
                  />
                  <CareerMatch
                    rank={2}
                    title="Business Analyst"
                    match={85}
                    accent="accent"
                  />
                  <CareerMatch
                    rank={3}
                    title="Product Manager"
                    match={78}
                    accent="chart-3"
                  />
                </div>
              </div>

              {/* ATS Score */}
              <div className="rounded-2xl border border-border bg-background/50 p-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      ATS Score
                    </h3>
                  </div>
                  <span className="font-display text-2xl font-bold text-foreground">
                    68<span className="text-muted-foreground">/100</span>
                  </span>
                </div>

                <div className="mt-5">
                  <div className="h-4 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="animate-shimmer h-full rounded-full"
                      style={{ width: "68%" }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Needs improvement</span>
                    <span className="text-primary">68%</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">Good keyword density</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-4 w-4 rounded-full border-2 border-yellow-500/50" />
                    <span className="text-muted-foreground">Add measurable achievements</span>
                  </div>
                </div>
              </div>

              {/* 90-Day Roadmap */}
              <div className="rounded-2xl border border-border bg-background/50 p-6">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <Compass className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    90-Day Roadmap
                  </h3>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <RoadmapPhase
                    weeks="Week 1-4"
                    title="Foundation"
                    items={["SQL fundamentals", "Excel mastery", "Statistics basics"]}
                  />
                  <RoadmapPhase
                    weeks="Week 5-8"
                    title="Build & Practice"
                    items={["Python for data", "Tableau projects", "Portfolio building"]}
                  />
                  <RoadmapPhase
                    weeks="Week 9-12"
                    title="Apply & Interview"
                    items={["Mock interviews", "Resume optimization", "Job applications"]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type AccentKey = "primary" | "accent" | "chart-3";

const accentClasses: Record<
  AccentKey,
  { bg: string; bgSoft: string; text: string }
> = {
  primary: {
    bgSoft: "bg-primary/15",
    text: "text-primary",
    bg: "bg-primary",
  },
  accent: {
    bgSoft: "bg-accent/15",
    text: "text-accent",
    bg: "bg-accent",
  },
  "chart-3": {
    bgSoft: "bg-chart-3/15",
    text: "text-chart-3",
    bg: "bg-chart-3",
  },
};

function CareerMatch({
  rank,
  title,
  match,
  accent,
}: {
  rank: number;
  title: string;
  match: number;
  accent: AccentKey;
}) {
  const c = accentClasses[accent];
  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${c.bgSoft} font-display text-lg font-bold ${c.text}`}
      >
        {rank}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">{title}</span>
          <span className={`font-display text-lg font-bold ${c.text}`}>
            {match}%
          </span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full rounded-full ${c.bg} transition-all duration-1000`}
            style={{ width: `${match}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function RoadmapPhase({
  weeks,
  title,
  items,
}: {
  weeks: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        {weeks}
      </p>
      <h4 className="mt-1 font-display text-sm font-semibold">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
            <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================ */
/* FOOTER                                                        */
/* ============================================================ */
function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-secondary/30">
      <div className="grid-pattern absolute inset-0 opacity-20" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold tracking-tight">
              Career<span className="text-primary">Compass</span>
            </span>
          </div>

          <p className="max-w-md text-sm text-muted-foreground">
            Your AI-powered career navigator. Upload your resume and let Gemini
            AI chart your path forward.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <a href="#hero-upload" className="text-muted-foreground transition-colors hover:text-foreground">
              Home
            </a>
            <a href="#how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">
              How it Works
            </a>
            <a href="#dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </a>
          </div>

          <div className="h-px w-full max-w-xs bg-border" />

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Code2 className="h-4 w-4 text-primary" />
              Built with Gemini API
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="text-sm font-semibold text-foreground">
              Team: Idea Engineer
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="text-sm text-muted-foreground">
              HackDays Solan 2026
            </span>
          </div>

          <p className="text-xs text-muted-foreground/60">
            © 2026 Career Compass · Idea Engineer · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
