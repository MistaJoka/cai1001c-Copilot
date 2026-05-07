import { BASE_STUDY_BUDDY_PROMPT } from "./base";

export function buildStudyBuddyPrompt(input: {
  message: string;
  topic?: string;
  action?: string;
}) {
  const isTeachBack = input.action === "teach-back";
  if (isTeachBack) {
    return `
${BASE_STUDY_BUDDY_PROMPT}

You are running Teach-Back Mode: the student explains the topic in their own words. Grade gently but honestly.

Current topic:
${input.topic || "Not specified"}

Student explanation:
${input.message}

Return Markdown with these sections:

## How You Did (score X/10 vibes)

## What You Got Right

## Gaps To Fix

## Tighter Version (model answer sketch)

## Next Try (one prompt for them to re-explain)
`.trim();
  }

  return `
${BASE_STUDY_BUDDY_PROMPT}

Current topic:
${input.topic || "Not specified"}

Requested action:
${input.action || "General study help"}

Student message:
${input.message}

Return this format:

## Answer First

## Key Points

## Simple Explanation

## Example

## Gap Check

## Quick Practice

## Exam Memory
`.trim();
}
