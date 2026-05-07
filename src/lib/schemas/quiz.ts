import { z } from "zod";

export const QuizQuestionSchema = z.object({
  id: z.string(),
  type: z.enum([
    "multiple_choice",
    "true_false",
    "short_answer",
    "scenario",
  ]),
  question: z.string(),
  choices: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  explanation: z.string(),
  commonTrap: z.string(),
});

export const QuizResponseSchema = z.object({
  topic: z.string(),
  questions: z.array(QuizQuestionSchema),
});

export type QuizResponse = z.infer<typeof QuizResponseSchema>;
