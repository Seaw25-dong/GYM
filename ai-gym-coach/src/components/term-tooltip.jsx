"use client";

import { getTerm } from "@/lib/glossary";
import { cn } from "@/lib/utils";

function TermTooltip({ term, children = null, className = "" }) {
  const item = getTerm(term);

  if (!item) {
    return children || term;
  }

  return (
    <span className={cn("group/term relative inline-flex", className)}>
      <button
        type="button"
        className="cursor-help border-b border-dotted border-white/40 text-inherit"
        aria-label={`${item.term}: ${item.short}`}
      >
        {children || item.term}
      </button>
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden w-72 -translate-x-1/2 rounded-2xl border border-white/10 bg-zinc-950 p-4 text-left text-sm leading-relaxed text-zinc-300 shadow-2xl shadow-black/40 group-hover/term:block group-focus-within/term:block">
        <strong className="mb-1 block text-white">{item.term}</strong>
        {item.short}
      </span>
    </span>
  );
}

export { TermTooltip };
