import type { Metadata } from "next";
import { InteractiveDemoClient } from "./interactive-demo-client";

export const metadata: Metadata = {
  title: "Interactive Lab · GapCloser AI",
  description: "JSON-driven guided lessons for CAI1001C.",
};

export default async function InteractiveDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  return <InteractiveDemoClient mode={mode} />;
}
