"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";

import { AppShell } from "@/components/app-nav";
import { TermTooltip } from "@/components/term-tooltip";
import { useFitnessPlan } from "@/hooks/use-fitness-plan";

const StrengthChart = dynamic(
  () => import("@/components/progress-charts").then((mod) => mod.StrengthChart),
  {
    ssr: false,
    loading: () => <div className="h-full rounded-2xl bg-black/20" />,
  }
);

const WeightChart = dynamic(
  () => import("@/components/progress-charts").then((mod) => mod.WeightChart),
  {
    ssr: false,
    loading: () => <div className="h-full rounded-2xl bg-black/20" />,
  }
);

export default function ProgressPage() {
  const { plan } = useFitnessPlan();

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Phân tích
            </p>

            <h1 className="mt-2 text-5xl font-bold tracking-tight">
              Theo dõi tiến độ
            </h1>

            <p className="mt-4 max-w-2xl text-zinc-400">
              Theo dõi xu hướng {plan.goalLabel.toLowerCase()} dựa trên mục tiêu{" "}
              {plan.targetCalories} kcal và nền tảng {plan.protein}g protein mỗi ngày.
            </p>
          </div>

          <Link
            href="/workout"
            className="w-fit rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:scale-105"
          >
            Ghi buổi tập mới
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { id: "target", title: "Calo mục tiêu", value: `${plan.targetCalories}` },
            { id: "bench", title: "Bench PR", value: "85kg" },
            { id: "tdee", title: <TermTooltip term="TDEE" />, value: `${plan.tdee}` },
            { id: "protein", title: "Protein", value: `${plan.protein}g` },
          ].map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p className="text-sm text-zinc-500">
                {item.title}
              </p>

              <h2 className="mt-4 text-4xl font-bold">
                {item.value}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="mt-8 grid gap-8 xl:grid-cols-2">

          {/* Strength Chart */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold">
                Tiến độ Bench Press
              </h3>

              <p className="mt-2 text-zinc-500">
                Ước tính mức 1RM trong 5 tuần gần nhất
              </p>
            </div>

            <div className="h-[320px] min-w-0">
              <StrengthChart />
            </div>
          </motion.div>

          {/* Weight Chart */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold">
                Xu hướng cân nặng
              </h3>

              <p className="mt-2 text-zinc-500">
                Phân tích thay đổi cân nặng theo thời gian
              </p>
            </div>

            <div className="h-[320px] min-w-0">
              <WeightChart />
            </div>
          </motion.div>
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
        >
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            Phân tích AI
          </p>

          <h2 className="mt-4 text-4xl font-bold leading-tight">
            Hiệu suất đang đi đúng hướng
          </h2>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">

            {[
              {
                title: "Sức mạnh tăng",
                text: "Bench Press cải thiện khoảng 13.3% trong 5 tuần gần nhất.",
              },
              {
                title: "Xu hướng phục hồi",
                text: "Điểm phục hồi ổn định dù volume tập tăng.",
              },
              {
                title: "Tiến độ giảm mỡ",
                text: "Xu hướng cân nặng cho thấy tốc độ giảm mỡ đang bền vững.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-black/30 p-5"
              >
                <h3 className="text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-3 leading-relaxed text-zinc-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
