"use client";

import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

import { AppShell } from "@/components/app-nav";
import { exerciseGroups } from "@/lib/exercise-library";

export default function ExercisesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            Thư viện bài tập
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            Bài tập theo từng nhóm cơ
          </h1>
          <p className="mt-4 max-w-3xl text-zinc-400">
            Danh sách này dùng làm thư viện tham khảo. Khi tích hợp API media,
            mỗi bài có thể gắn thêm video, ảnh động hoặc mô phỏng giải phẫu.
          </p>
        </div>

        <div className="space-y-8">
          {exerciseGroups.map((group, groupIndex) => (
            <section key={group.group}>
              <h2 className="mb-4 text-3xl font-bold">{group.group}</h2>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {group.exercises.map((exercise, index) => (
                  <motion.article
                    key={exercise.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.05 + index * 0.04 }}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur"
                  >
                    <div className="flex aspect-video items-center justify-center bg-black/40">
                      <div className="flex flex-col items-center gap-2 text-zinc-500">
                        <PlayCircle className="size-10" />
                        <span className="text-sm">Video/animation placeholder</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold">{exercise.name}</h3>
                          <p className="mt-1 text-sm text-zinc-500">{exercise.equipment}</p>
                        </div>
                        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300">
                          {exercise.level}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {exercise.muscles.map((muscle) => (
                          <span
                            key={muscle}
                            className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>

                      <p className="mt-4 leading-relaxed text-zinc-400">
                        {exercise.instruction}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
