import { BASE_STUDY_BUDDY_PROMPT } from "./base";

export function buildArtifactPrompt(input: {
  topic: string;
  artifactType?: string;
}) {
  return `
${BASE_STUDY_BUDDY_PROMPT}

Create a beginner-friendly but professional portfolio artifact.

Topic:
${input.topic}

Artifact type:
${input.artifactType || "one-page Markdown artifact"}

The artifact should prove understanding of the topic.

Return this format:

# Title

## Purpose

## Concept Summary

## Workflow or Explanation

## Real-World Example

## Risks or Limitations

## Portfolio Notes

## How I Would Explain This in Class
`.trim();
}
