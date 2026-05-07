import { BASE_STUDY_BUDDY_PROMPT } from "./base";

export function buildFinalExamPrompt(input: { weakTopics?: string[] }) {
  return `
${BASE_STUDY_BUDDY_PROMPT}

Create a CAI1001C final exam prep plan.

Known weak topics:
${input.weakTopics?.join(", ") || "Not specified"}

Return this format:

## Topic Checklist

## High-Yield Definitions

## Scenario Questions

## Practice Test

## Answer Key

## Weak-Area Review Plan

## 48-Hour Cram Plan
`.trim();
}
