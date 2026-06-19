"use client";

import { AlertTriangle, ExternalLink, FlaskConical, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app-nav";
import { supplements } from "@/lib/supplements";

const goals = ["Tất cả", "Tăng cơ", "Giảm mỡ", "Hiệu suất", "Sức khỏe"];

export default function SupplementsPage() {
  const [goal, setGoal] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = supplements.filter((item) => {
    const matchesGoal = goal === "Tất cả" || item.goal === goal;
    const matchesQuery = !normalizedQuery || `${item.name} ${item.aliases} ${item.summary}`.toLowerCase().includes(normalizedQuery);
    return matchesGoal && matchesQuery;
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-zinc-500">Kiến thức bổ sung</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">Thực phẩm bổ sung: đáng tiền hay chỉ là marketing?</h1>
          <p className="mt-4 leading-relaxed text-zinc-400">
            Tra cứu nhanh công dụng, mức độ bằng chứng và cảnh báo. Supplement chỉ bổ sung cho chế độ ăn và chương trình tập—không thay thế chúng.
          </p>
        </header>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5">
            <ShieldCheck className="size-6 text-emerald-400" />
            <h2 className="mt-3 text-lg font-semibold">Ưu tiên sản phẩm minh bạch</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">Chọn nhãn ghi rõ thành phần và liều; ưu tiên kiểm nghiệm bên thứ ba. “Tự nhiên” không đồng nghĩa với an toàn.</p>
          </div>
          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/[0.06] p-5">
            <AlertTriangle className="size-6 text-amber-400" />
            <h2 className="mt-3 text-lg font-semibold">Đây không phải tư vấn y tế</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">Nếu có bệnh nền, đang dùng thuốc, mang thai/cho con bú hoặc dưới 18 tuổi, hãy hỏi bác sĩ trước khi dùng.</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-600" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm creatine, whey, caffeine..." className="w-full rounded-2xl border border-white/10 bg-black/40 py-3.5 pl-12 pr-4 outline-none placeholder:text-zinc-700 focus:border-white/25" />
          </label>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {goals.map((item) => (
              <button key={item} type="button" onClick={() => setGoal(item)} className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${goal === item ? "border-white bg-white text-black" : "border-white/10 text-zinc-500 hover:bg-white/10 hover:text-white"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <article key={item.name} className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-black"><FlaskConical className="size-5" /></span>
                <span className={`rounded-full border px-3 py-1 text-xs ${evidenceClass(item.evidence)}`}>{item.evidence}</span>
              </div>
              <p className="mt-5 text-xs uppercase tracking-widest text-zinc-600">{item.goal}</p>
              <h2 className="mt-2 text-2xl font-bold">{item.name}</h2>
              <p className="mt-1 text-sm text-zinc-600">{item.aliases}</p>
              <p className="mt-4 leading-relaxed text-zinc-400">{item.summary}</p>
              <div className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm">
                <div><strong className="text-zinc-300">Cách hiểu/dùng:</strong><p className="mt-1 leading-relaxed text-zinc-500">{item.usage}</p></div>
                <div><strong className="text-zinc-300">Lưu ý:</strong><p className="mt-1 leading-relaxed text-zinc-500">{item.caution}</p></div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-white/10 bg-black/30 p-6">
          <h2 className="text-xl font-semibold">Nguồn đọc thêm</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <SourceLink href="https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/" label="NIH ODS — Exercise and Athletic Performance" />
            <SourceLink href="https://ods.od.nih.gov/factsheets/WeightLoss-HealthProfessional/" label="NIH ODS — Weight Loss Supplements" />
            <SourceLink href="https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/" label="NIH ODS — Vitamin D" />
            <SourceLink href="https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/" label="NIH ODS — Omega-3 Fatty Acids" />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function SourceLink({ href, label }) {
  return <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white">{label}<ExternalLink className="size-3.5" /></a>;
}

function evidenceClass(evidence) {
  if (evidence === "Bằng chứng tốt") return "border-emerald-500/30 text-emerald-400";
  if (["Nên tránh", "Không khuyến nghị"].includes(evidence)) return "border-red-500/30 text-red-400";
  if (["Bằng chứng yếu", "Bằng chứng hạn chế", "Ít cần thiết"].includes(evidence)) return "border-amber-500/30 text-amber-400";
  return "border-white/10 text-zinc-400";
}
