import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  resumeText: z.string().min(30, "Resume text is too short to analyze"),
});

export type AnalysisResult = {
  atsScore: number;
  atsFeedback: string[];
  skills: string[];
  careers: { title: string; match: number; why: string }[];
  roadmap: { phase: string; title: string; items: string[] }[];
};

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["atsScore", "atsFeedback", "skills", "careers", "roadmap"],
  properties: {
    atsScore: { type: "number" },
    atsFeedback: { type: "array", items: { type: "string" } },
    skills: { type: "array", items: { type: "string" } },
    careers: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "match", "why"],
        properties: {
          title: { type: "string" },
          match: { type: "number" },
          why: { type: "string" },
        },
      },
    },
    roadmap: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["phase", "title", "items"],
        properties: {
          phase: { type: "string" },
          title: { type: "string" },
          items: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
} as const;

export const analyzeResume = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<AnalysisResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured for this app.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a career advisor. Analyze the resume and return JSON only. Give exactly 3 careers ranked by match percentage (0-100), an ATS score out of 100, 2-4 short ATS feedback points, up to 8 key skills, and exactly 3 roadmap phases labelled 'Week 1-4', 'Week 5-8', 'Week 9-12' with 3 items each.",
          },
          { role: "user", content: data.resumeText.slice(0, 20000) },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "career_analysis", strict: true, schema },
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429)
        throw new Error("Too many requests right now. Please try again in a moment.");
      if (res.status === 402)
        throw new Error("AI credits are exhausted. Please add credits to continue.");
      throw new Error(`AI request failed (${res.status}): ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("The AI returned an empty result. Please try again.");
    return JSON.parse(content) as AnalysisResult;
  });
