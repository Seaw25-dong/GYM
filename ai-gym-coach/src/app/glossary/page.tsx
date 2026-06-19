"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app-nav";
import { glossaryTerms } from "@/lib/glossary";

export default function GlossaryPage() {
  const terms = Object.values(glossaryTerms);
  const categories = ["Tất cả", ...new Set(terms.map((item) => item.category))];
  const [category, setCategory] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredTerms = terms.filter((item) => {
    const matchesCategory = category === "Tất cả" || item.category === category;
    const matchesQuery =
      !normalizedQuery ||
      `${item.term} ${item.title} ${item.description}`.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            Thuật ngữ
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            Hiểu các chỉ số trước khi theo plan
          </h1>
          <p className="mt-4 max-w-3xl text-zinc-400">
            Đây là phần giải thích nhanh các chỉ số và thuật ngữ thường gặp khi
            tính calo, tăng cơ, giảm mỡ và theo dõi tiến độ tập luyện.
          </p>
        </div>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-600" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm RPE, progressive overload, ROM..."
              className="w-full rounded-2xl border border-white/10 bg-black/40 py-3.5 pl-12 pr-4 outline-none transition placeholder:text-zinc-700 focus:border-white/25"
            />
          </label>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                  category === item
                    ? "border-white bg-white text-black"
                    : "border-white/10 text-zinc-500 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {filteredTerms.map((item, index) => (
            <motion.article
              key={item.term}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p className="text-sm uppercase tracking-widest text-zinc-500">
                {item.category} · {item.title}
              </p>
              <h2 className="mt-3 text-3xl font-bold">{item.term}</h2>
              <p className="mt-4 leading-relaxed text-zinc-400">
                {item.description}
              </p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-sm text-zinc-500">Công thức / cách hiểu</p>
                <p className="mt-2 text-zinc-200">{item.formula}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
