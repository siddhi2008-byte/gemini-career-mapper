import { useCallback, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Target, Trophy, Compass, CheckCircle2, AlertCircle } from "lucide-react";
import { analyzeResume, type AnalysisResult } from "../lib/analyze-resume.functions";
import { extractPdfText } from "../lib/pdf-text";

export function useResumeAnalysis() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const run = useServerFn(analyzeResume);
  const [status, setStatus] = useState<"idle" | "reading" | "analyzing">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      setError(null);
      setResult(null);
      setFileName(file.name);

      try {
        setStatus("reading");
        const text = await extractPdfText(file);
        if (text.length < 30) {
          throw new Error(
            "We couldn't read any text from that PDF. It may be a scanned image — try a text-based PDF.",
          );
        }
        setStatus("analyzing");
        const data = await run({ data: { resumeText: text } });
        setResult(data);
        setTimeout(() => {
          document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      } finally {
        setStatus("idle");
      }
    },
    [run],
  );

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="application/pdf,.pdf"
      className="hidden"
      onChange={onFileChange}
    />
  );

  return { openPicker, fileInput, status, error, result, fileName, busy: status !== "idle" };
}

export function AnalysisSection({
  status,
  error,
  result,
  fileName,
}: {
  status: "idle" | "reading" | "analyzing";
  error: string | null;
  result: AnalysisResult | null;
  fileName: string | null;
}) {
  if (status === "idle" && !error && !result) return null;

  return (
    <section id="results" className="relative py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Your Results
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {result ? "Here's your " : "Analyzing your "}
            <span className="text-gradient">career analysis</span>
          </h2>
          {fileName && (
            <p className="mt-3 text-sm text-muted-foreground">{fileName}</p>
          )}
        </div>

        {status !== "idle" && (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card/50 p-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {status === "reading" ? "Reading your resume…" : "Gemini AI is analyzing your resume…"}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <p className="text-sm text-foreground">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-10 space-y-6">
            {result.skills.length > 0 && (
              <div className="rounded-2xl border border-border bg-card/50 p-6">
                <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Detected Skills
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-card/50 p-6">
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Top Career Matches
                </h3>
              </div>
              <div className="mt-4 space-y-5">
                {result.careers.map((career, i) => (
                  <div key={career.title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-lg font-bold text-primary">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-medium">{career.title}</span>
                        <span className="font-display text-lg font-bold text-primary">
                          {Math.round(career.match)}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-1000"
                          style={{ width: `${Math.min(100, Math.max(0, career.match))}%` }}
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{career.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/50 p-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    ATS Score
                  </h3>
                </div>
                <span className="font-display text-2xl font-bold text-foreground">
                  {Math.round(result.atsScore)}
                  <span className="text-muted-foreground">/100</span>
                </span>
              </div>
              <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="animate-shimmer h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, result.atsScore))}%` }}
                />
              </div>
              <ul className="mt-4 space-y-2">
                {result.atsFeedback.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card/50 p-6">
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <Compass className="h-5 w-5 text-primary" />
                <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  90-Day Roadmap
                </h3>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {result.roadmap.map((phase) => (
                  <div
                    key={phase.phase}
                    className="rounded-xl border border-border bg-secondary/30 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {phase.phase}
                    </p>
                    <h4 className="mt-1 font-display text-sm font-semibold">{phase.title}</h4>
                    <ul className="mt-3 space-y-2">
                      {phase.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
