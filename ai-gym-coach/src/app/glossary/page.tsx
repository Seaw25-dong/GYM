"use client";

import { motion } from "framer-motion";

import { AppShell } from "@/components/app-nav";
import { glossaryTerms } from "@/lib/glossary";

export default function GlossaryPage() {
  const terms = Object.values(glossaryTerms);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            Thuật ngữ
          </p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight">
            Hiểu các chỉ số trước khi theo plan
          </h1>
          <p className="mt-4 max-w-3xl text-zinc-400">
            Đây là phần giải thích nhanh các chỉ số và thuật ngữ thường gặp khi
            tính calo, tăng cơ, giảm mỡ và theo dõi tiến độ tập luyện.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {terms.map((item, index) => (
            <motion.article
              key={item.term}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p className="text-sm uppercase tracking-widest text-zinc-500">
                {item.title}
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
