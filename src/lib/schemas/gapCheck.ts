import { z } from "zod";

export const GapCheckResponseSchema = z.object({
  topic: z.string(),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  misconceptions: z.array(z.string()),
  repairLesson: z.string(),
  nextStudyActions: z.array(z.string()),
  followUpQuestions: z.array(z.string()),
  confidenceScore: z.number().min(0).max(100),
});

export type GapCheckResponse = z.infer<typeof GapCheckResponseSchema>;
