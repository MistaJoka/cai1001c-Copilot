import { z } from "zod";

export const FlashcardSchema = z.object({
  front: z.string(),
  back: z.string(),
  type: z.enum([
    "definition",
    "example",
    "compare",
    "scenario",
    "common_mistake",
    "exam_trap",
  ]),
});

export const FlashcardsResponseSchema = z.object({
  topic: z.string(),
  cards: z.array(FlashcardSchema),
});

export type FlashcardsResponse = z.infer<typeof FlashcardsResponseSchema>;
