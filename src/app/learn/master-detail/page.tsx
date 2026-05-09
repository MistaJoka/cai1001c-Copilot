import type { Metadata } from "next";
import { Suspense } from "react";
import { MasterDetailLayout } from "@/components/learn/master-detail-layout";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Lesson Browser · Master–detail · GapCloser AI",
  description:
    "Browse CAI1001C topics in a split view with search, filters, and practice links.",
};

export default function LearnMasterDetailPage() {
  return (
    <>
      <PageHeader
        eyebrow="Layout #7 · Master–detail"
        title="Lesson browser"
        description="Desktop keeps the catalog and lesson brief side by side. Mobile stacks list → detail with an explicit back affordance. Status and mastery read from your browser-local progress map."
        summaryPoints={[
          "Filters slice by not started, in progress, completed, or weak (low confidence).",
          "Detail pulls objectives, vocabulary, and examples straight from courseTopics.",
          "Deep links honor ?topic=id when you land from another page.",
        ]}
      />
      <Suspense
        fallback={
          <p className="text-sm text-zinc-500" role="status">
            Loading lesson browser…
          </p>
        }
      >
        <MasterDetailLayout />
      </Suspense>
    </>
  );
}
