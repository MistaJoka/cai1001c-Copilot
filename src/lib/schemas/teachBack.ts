import { z } from "zod";

export const TeachBackResponseSchema = z.object({
  score: z.number().min(0).max(10),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  improvedAnswer: z.string(),
  nextAttemptPrompt: z.string(),
});

export type TeachBackResponse = z.infer<typeof TeachBackResponseSchema>;
