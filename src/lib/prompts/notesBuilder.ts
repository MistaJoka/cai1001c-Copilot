import { BASE_STUDY_BUDDY_PROMPT } from "./base";

export function buildNotesPrompt(input: { sourceText: string }) {
  return `
${BASE_STUDY_BUDDY_PROMPT}

Turn the following course content into clean CAI1001C study notes.

Source text:
${input.sourceText}

Return this format:

## Summary

## Key Terms

## Simple Explanation

## Examples

## Common Mistakes

## Quiz Questions

## Flashcard Ideas

## Exam Memory

## Portfolio Artifact Idea
`.trim();
}
