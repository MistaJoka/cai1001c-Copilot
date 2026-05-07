"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
  className?: string;
};

export function MarkdownContent({ content, className = "" }: Props) {
  return (
    <div
      className={`markdown-body prose-reading max-w-none space-y-4 text-zinc-200 [&_a]:font-medium [&_a]:text-cyan-300 [&_a]:underline [&_a]:decoration-cyan-600/50 [&_a]:underline-offset-2 [&_blockquote]:border-l-2 [&_blockquote]:border-cyan-500/40 [&_blockquote]:bg-zinc-900/40 [&_blockquote]:py-2 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-300 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-zinc-50 [&_h2]:mt-8 [&_h2]:border-b [&_h2]:border-zinc-800 [&_h2]:pb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-100 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-100 [&_li]:ml-4 [&_li]:marker:text-cyan-600/80 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:leading-relaxed [&_p]:text-zinc-300 [&_strong]:font-semibold [&_strong]:text-zinc-50 [&_ul]:space-y-2 ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
