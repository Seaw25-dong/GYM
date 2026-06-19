"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Camera, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-nav";
import { getProgressData, saveProgressEntry } from "@/lib/api";
import { toDateKey } from "@/lib/workout-schedule";

const WeightChart = dynamic(() => import("@/components/progress-charts").then((m) => m.WeightChart), { ssr: false });
const emptyForm = { weight: "", bodyFat: "", waist: "", chest: "", arm: "", thigh: "", photoUrl: "", notes: "" };

export default function ProgressPage() {
  const [data, setData] = useState({ entries: [], prs: {} });
  const [form, setForm] = useState(emptyForm);
  const [date, setDate] = useState(() => toDateKey(new Date()));
  const [saving, setSaving] = useState(false);
  useEffect(() => { getProgressData().then(setData).catch(() => {}); }, []);
  const chartData = useMemo(() => data.entries.map((e) => ({ date: e.date.slice(5), weight: e.weight })), [data.entries]);
  const topPrs = Object.entries(data.prs).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 4);
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const photo = (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    if (file.size > 650 * 1024) return alert("Ảnh cần nhỏ hơn 650 KB");
    const reader = new FileReader(); reader.onload = () => change("photoUrl", String(reader.result)); reader.readAsDataURL(file);
  };
  const submit = async (event) => {
    event.preventDefault(); setSaving(true);
    try { const entry = await saveProgressEntry(date, form); setData((current) => ({ ...current, entries: [...current.entries.filter((e) => e.date !== date), entry].sort((a,b) => a.date.localeCompare(b.date)) })); setForm(emptyForm); }
    finally { setSaving(false); }
  };
  return <AppShell><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
    <h1 className="text-3xl font-bold sm:text-5xl">Theo dõi tiến độ thật</h1><p className="mt-3 text-zinc-500">Cân nặng, số đo, ảnh và PR đều lấy từ MongoDB.</p>
    <div className="mt-8 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-xl font-semibold">Ghi chỉ số</h2>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-5 w-full rounded-xl bg-black/40 p-3" />
        <div className="mt-4 grid grid-cols-2 gap-3">{[["weight","Cân nặng kg"],["bodyFat","Body fat %"],["waist","Eo cm"],["chest","Ngực cm"],["arm","Tay cm"],["thigh","Đùi cm"]].map(([key,label]) => <label key={key} className="text-sm text-zinc-500">{label}<input type="number" step="0.1" required={key === "weight"} value={form[key]} onChange={(e) => change(key,e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white" /></label>)}</div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 p-3 text-sm"><Camera className="size-4" />Thêm ảnh<input type="file" accept="image/*" onChange={photo} className="sr-only" /></label>
        <textarea value={form.notes} onChange={(e) => change("notes",e.target.value)} placeholder="Ghi chú" className="mt-4 w-full rounded-xl border border-white/10 bg-black/40 p-3" />
        <button disabled={saving} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white p-3 font-medium text-black"><Plus className="size-4" />{saving ? "Đang lưu" : "Lưu tiến độ"}</button>
      </form>
      <div className="grid gap-6">
        <section className="h-[340px] rounded-3xl border border-white/10 bg-white/5 p-5"><h2 className="mb-5 text-xl font-semibold">Xu hướng cân nặng</h2>{chartData.length ? <div className="h-[260px]"><WeightChart data={chartData} /></div> : <p className="text-zinc-600">Chưa có dữ liệu.</p>}</section>
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">{topPrs.length ? topPrs.map(([name,value]) => <div key={name} className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="truncate text-sm text-zinc-500">{name}</p><strong className="mt-2 block text-2xl">{String(value)}kg</strong><span className="text-xs text-zinc-600">1RM ước tính</span></div>) : <p className="col-span-full text-zinc-600">PR sẽ xuất hiện sau khi ghi set tập.</p>}</section>
      </div>
    </div>
    <section className="mt-8"><h2 className="text-2xl font-bold">Ảnh tiến độ</h2><div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">{data.entries.filter((e) => e.photoUrl).map((e) => <article key={e.date} className="overflow-hidden rounded-2xl border border-white/10"><Image unoptimized src={e.photoUrl} alt={`Tiến độ ${e.date}`} width={400} height={500} className="aspect-[4/5] w-full object-cover" /><p className="p-3 text-sm text-zinc-500">{e.date} · {e.weight}kg</p></article>)}</div></section>
  </div></AppShell>;
}
