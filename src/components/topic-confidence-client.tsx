"use client";

import { useEffect, useState } from "react";
import {
  getTopicProgress,
  setLastStudiedTopic,
  setTopicConfidence,
} from "@/lib/local-progress";
import type { ConfidenceLevel } from "@/types";
import { ConfidenceBadge } from "@/components/confidence-badge";

type Props = { topicId: string };

export function TopicConfidenceClient({ topicId }: Props) {
  const [level, setLevel] = useState<ConfidenceLevel | null>(null);

  useEffect(() => {
    setLastStudiedTopic(topicId);
    const p = getTopicProgress(topicId);
    setLevel(p?.confidence ?? null);
  }, [topicId]);

  return (
    <div className="flex flex-col items-end gap-2">
      <ConfidenceBadge level={level} />
      <label className="flex items-center gap-2 text-xs text-zinc-500">
        <span className="sr-only">Confidence</span>
        <select
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-200"
          value={level ?? ""}
          onChange={(e) => {
            const v = e.target.value as ConfidenceLevel | "";
            if (v) {
              setTopicConfidence(topicId, v);
              setLevel(v);
            }
          }}
        >
          <option value="">Set confidence…</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
    </div>
  );
}
