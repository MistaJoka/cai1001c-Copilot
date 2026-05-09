import type { NotebookDraft } from "@/lib/notebook-copilot-storage";

type TopicOption = { id: string; label: string };

type Props = {
  draft: NotebookDraft;
  topicOptions: readonly TopicOption[];
  onTopicChange: (topicId: string) => void;
  onDraftChange: (patch: Partial<NotebookDraft>) => void;
};

const fieldLabel =
  "text-xs font-semibold uppercase tracking-wide text-zinc-500";
const inputClass =
  "mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-cyan-500/45 focus:ring-1 focus:ring-cyan-500/25";
const textareaClass = `${inputClass} min-h-[140px] resize-y font-mono leading-relaxed`;

export function NotebookEditor({
  draft,
  topicOptions,
  onTopicChange,
  onDraftChange,
}: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/60 to-zinc-950/90 p-5 shadow-inner shadow-black/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="notebook-topic" className={fieldLabel}>
            Topic
          </label>
          <select
            id="notebook-topic"
            value={draft.topicId}
            onChange={(e) => onTopicChange(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            {topicOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:max-w-xs sm:flex-1">
          <p className={fieldLabel}>Storage</p>
          <p
            className="mt-1.5 rounded-xl border border-zinc-800/80 bg-zinc-950/50 px-3 py-2 text-xs leading-relaxed text-zinc-400"
          >
            Drafts auto-save to this browser per topic (same pattern as progress
            keys elsewhere).
          </p>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="notebook-title" className={fieldLabel}>
          Note title
        </label>
        <input
          id="notebook-title"
          type="text"
          value={draft.title}
          onChange={(e) => onDraftChange({ title: e.target.value })}
          placeholder="e.g. Decision boundaries intuition"
          className={inputClass}
        />
      </div>

      <div className="mt-5 min-h-0 flex-1">
        <label htmlFor="notebook-body" className={fieldLabel}>
          Note body (Markdown-friendly)
        </label>
        <textarea
          id="notebook-body"
          value={draft.body}
          onChange={(e) => onDraftChange({ body: e.target.value })}
          placeholder="Write freely — headings, bullets, and code fences work when rendered downstream."
          className={`${textareaClass} min-h-[220px]`}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div>
          <label htmlFor="notebook-takeaways" className={fieldLabel}>
            Key takeaways
          </label>
          <textarea
            id="notebook-takeaways"
            value={draft.keyTakeaways}
            onChange={(e) => onDraftChange({ keyTakeaways: e.target.value })}
            placeholder="- Bullet crisp claims you must remember"
            className={textareaClass}
          />
        </div>
        <div>
          <label htmlFor="notebook-confusing" className={fieldLabel}>
            Confusing points
          </label>
          <textarea
            id="notebook-confusing"
            value={draft.confusingPoints}
            onChange={(e) => onDraftChange({ confusingPoints: e.target.value })}
            placeholder="- What still feels fuzzy?"
            className={textareaClass}
          />
        </div>
        <div>
          <label htmlFor="notebook-questions" className={fieldLabel}>
            Questions to ask later
          </label>
          <textarea
            id="notebook-questions"
            value={draft.questionsLater}
            onChange={(e) => onDraftChange({ questionsLater: e.target.value })}
            placeholder="- Queue topics for tutor / class / study group"
            className={textareaClass}
          />
        </div>
      </div>
    </div>
  );
}
