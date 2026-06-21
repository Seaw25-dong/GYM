"use client";

import {
  ArrowLeft,
  BookOpen,
  Dumbbell,
  ExternalLink,
  History,
  PlayCircle,
  Search,
  Target,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app-nav";
import { exerciseCatalog, exerciseGroupsDetailed, levelOrder } from "@/lib/exercise-catalog";

export default function ExercisesPage() {
  const [group, setGroup] = useState("Ngực");
  const [level, setLevel] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const exercises = useMemo(() => {
    const search = query.trim().toLowerCase();
    return exerciseCatalog.filter((exercise) =>
      exercise.group === group &&
      (level === "Tất cả" || exercise.level === level) &&
      (!search || `${exercise.name} ${exercise.muscles.join(" ")} ${exercise.equipment}`.toLowerCase().includes(search))
    );
  }, [group, level, query]);

  if (selected) {
    return <AppShell><ExerciseDetail exercise={selected} onBack={() => setSelected(null)} onSelect={setSelected} /></AppShell>;
  }

  return <AppShell><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
    <header className="max-w-4xl"><p className="text-sm uppercase tracking-widest text-zinc-500">Thư viện bài tập chuyên sâu</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">Từ động tác cơ bản đến kỹ thuật thi đấu</h1><p className="mt-4 leading-relaxed text-zinc-400">Chọn nhóm cơ, trình độ rồi mở từng bài để xem kỹ thuật, video tham khảo, lỗi thường gặp và nguồn gốc của động tác.</p></header>

    <div className="mt-8 grid gap-6 lg:grid-cols-[250px_1fr]">
      <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-3 lg:sticky lg:top-24">
        <p className="px-3 py-2 text-xs uppercase tracking-widest text-zinc-600">Nhóm bài tập</p>
        <div className="flex gap-2 overflow-x-auto lg:grid">{exerciseGroupsDetailed.map((item) => {
          const count = exerciseCatalog.filter((exercise) => exercise.group === item).length;
          return <button key={item} type="button" onClick={() => { setGroup(item); setSelected(null); }} className={`flex shrink-0 items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left text-sm transition ${group === item ? "bg-white text-black" : "text-zinc-500 hover:bg-white/5 hover:text-white"}`}><span>{item}</span><span className="text-xs opacity-60">{count}</span></button>;
        })}</div>
      </aside>

      <div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <label className="relative block"><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-600" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Tìm bài ${group.toLowerCase()}...`} className="w-full rounded-2xl border border-white/10 bg-black/40 py-3.5 pl-12 pr-4 outline-none focus:border-white/25" /></label>
          <div className="mt-3 flex gap-2 overflow-x-auto">{["Tất cả", ...levelOrder].map((item) => <button key={item} type="button" onClick={() => setLevel(item)} className={`shrink-0 rounded-full border px-4 py-2 text-sm ${level === item ? "border-white bg-white text-black" : "border-white/10 text-zinc-500"}`}>{item}</button>)}</div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{exercises.map((exercise) => <button key={exercise.id} type="button" onClick={() => setSelected(exercise)} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] text-left transition hover:-translate-y-1 hover:border-white/25">
          <div className="grid aspect-video place-items-center bg-gradient-to-br from-zinc-900 to-black"><div className="text-center text-zinc-600"><PlayCircle className="mx-auto size-10 transition group-hover:text-white" /><span className="mt-2 block text-xs">Mở hồ sơ bài tập</span></div></div>
          <div className="p-5"><div className="flex items-start justify-between gap-3"><h2 className="text-xl font-bold">{exercise.name}</h2><span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-zinc-500">{exercise.level}</span></div><p className="mt-2 text-sm text-zinc-600">{exercise.equipment}</p><div className="mt-4 flex flex-wrap gap-2">{exercise.muscles.slice(0, 3).map((muscle) => <span key={muscle} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-zinc-400">{muscle}</span>)}</div></div>
        </button>)}</div>
        {!exercises.length && <div className="mt-5 rounded-3xl border border-dashed border-white/10 p-10 text-center text-zinc-600">Không tìm thấy bài phù hợp bộ lọc.</div>}
      </div>
    </div>
  </div></AppShell>;
}

function ExerciseDetail({ exercise, onBack, onSelect }) {
  const videoUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.videoSearchQuery)}`;
  const related = exerciseCatalog.filter((item) => item.group === exercise.group && item.id !== exercise.id).slice(0, 4);
  return <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
    <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:bg-white/10 hover:text-white"><ArrowLeft className="size-4" />Quay lại {exercise.group}</button>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <div className="relative grid aspect-video place-items-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-black to-zinc-950">
          <div className="text-center"><PlayCircle className="mx-auto size-16 text-zinc-500" /><p className="mt-4 text-zinc-400">Video hướng dẫn kỹ thuật</p><a href={videoUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black">Tìm video đúng bài trên YouTube<ExternalLink className="size-4" /></a></div>
        </div>
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
          <div className="flex items-center gap-3"><BookOpen className="size-5" /><h2 className="text-2xl font-bold">Hướng dẫn từng bước</h2></div>
          <ol className="mt-5 grid gap-3">{exercise.steps.map((step, index) => <li key={index} className="grid grid-cols-[34px_1fr] gap-3 rounded-2xl bg-black/30 p-4"><span className="grid size-8 place-items-center rounded-full bg-white text-sm font-bold text-black">{index + 1}</span><p className="pt-1 text-zinc-300">{step.replace(/\.$/, "")}.</p></li>)}</ol>
        </div>
      </div>

      <div className="space-y-5">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><p className="text-sm uppercase tracking-widest text-zinc-500">{exercise.group} · {exercise.level}</p><h1 className="mt-3 text-4xl font-bold">{exercise.name}</h1><p className="mt-4 leading-relaxed text-zinc-400">{exercise.instruction}</p><div className="mt-5 flex flex-wrap gap-2">{exercise.muscles.map((muscle) => <span key={muscle} className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-zinc-300">{muscle}</span>)}</div><div className="mt-5 flex items-center gap-3 rounded-2xl bg-black/30 p-4"><Dumbbell className="size-5 text-zinc-500" /><div><p className="text-xs text-zinc-600">Thiết bị</p><p className="text-zinc-300">{exercise.equipment}</p></div></div></section>

        <section className="rounded-3xl border border-amber-500/15 bg-amber-500/[0.04] p-6"><div className="flex items-center gap-3"><TriangleAlert className="size-5 text-amber-400" /><h2 className="text-xl font-bold">Lỗi thường gặp</h2></div><ul className="mt-4 grid gap-2">{exercise.mistakes.map((mistake) => <li key={mistake} className="flex gap-2 text-sm text-zinc-400"><span className="text-amber-400">•</span>{mistake}</li>)}</ul></section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><div className="flex items-center gap-3"><History className="size-5" /><h2 className="text-xl font-bold">Nguồn gốc & lịch sử</h2></div><p className="mt-4 text-sm leading-relaxed text-zinc-400">{exercise.history}</p></section>

        {exercise.level === "Thi đấu" && <section className="rounded-3xl border border-red-500/15 bg-red-500/[0.04] p-6"><div className="flex items-center gap-3"><Target className="size-5 text-red-400" /><h2 className="text-xl font-bold">Lưu ý thi đấu</h2></div><p className="mt-3 text-sm leading-relaxed text-zinc-400">Học hiệu lệnh và tiêu chuẩn kỹ thuật của liên đoàn bạn tham gia. Nên tập cùng huấn luyện viên có kinh nghiệm trước khi test mức tối đa.</p></section>}
      </div>
    </div>

    <section className="mt-8"><h2 className="text-2xl font-bold">Bài cùng nhóm</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <button key={item.id} type="button" onClick={() => { onSelect(item); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl border border-white/10 p-4 text-left transition hover:bg-white/10"><p className="font-semibold">{item.name}</p><span className="mt-1 block text-xs text-zinc-600">{item.level}</span></button>)}</div></section>
  </div>;
}
