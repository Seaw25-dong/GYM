"use client";

import { ArrowDownUp, Search, ShoppingBasket, Utensils } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-nav";
import { foodMarket, foodMarketUpdatedAt } from "@/lib/food-market";

const formatter = new Intl.NumberFormat("vi-VN");

export default function FoodsPage() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("Tất cả");
  const [sort, setSort] = useState("protein");
  const groups = ["Tất cả", ...new Set(foodMarket.map((food) => food.group))];
  const foods = useMemo(() => {
    const search = query.trim().toLowerCase();
    return foodMarket
      .filter((food) => (group === "Tất cả" || food.group === group) && (!search || food.name.toLowerCase().includes(search)))
      .sort((a, b) => sort === "price" ? a.priceMin - b.priceMin : sort === "calories" ? a.calories - b.calories : b.protein - a.protein);
  }, [group, query, sort]);

  return <AppShell><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
    <header className="max-w-4xl"><p className="text-sm uppercase tracking-widest text-zinc-500">Thực phẩm & dinh dưỡng</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">Ăn gì, bao nhiêu đạm và khoảng bao nhiêu tiền?</h1><p className="mt-4 leading-relaxed text-zinc-400">So sánh protein, calories trên 100g và khoảng giá bán lẻ để xây thực đơn phù hợp ngân sách.</p></header>

    <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4 text-sm leading-relaxed text-zinc-400">Giá tham khảo tại Việt Nam, cập nhật <strong className="text-zinc-200">{foodMarketUpdatedAt}</strong>; không phải dữ liệu realtime và có thể khác theo khu vực, thương hiệu, mùa hoặc khuyến mãi. Dinh dưỡng là giá trị xấp xỉ trên 100g phần ăn được ở trạng thái ghi trên món.</div>

    <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="relative"><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-600" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm ức gà, yến mạch, đậu hũ..." className="w-full rounded-2xl border border-white/10 bg-black/40 py-3.5 pl-12 pr-4 outline-none focus:border-white/25" /></label>
        <label className="relative"><ArrowDownUp className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-600" /><select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-4 outline-none"><option value="protein">Protein cao nhất</option><option value="calories">Calories thấp nhất</option><option value="price">Giá thấp nhất</option></select></label>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{groups.map((item) => <button key={item} onClick={() => setGroup(item)} className={`shrink-0 rounded-full border px-4 py-2 text-sm ${group === item ? "border-white bg-white text-black" : "border-white/10 text-zinc-500"}`}>{item}</button>)}</div>
    </div>

    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{foods.map((food) => <article key={food.name} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-start justify-between gap-4"><span className="grid size-10 place-items-center rounded-xl bg-white text-black"><Utensils className="size-5" /></span><span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">{food.group}</span></div>
      <h2 className="mt-5 text-2xl font-bold">{food.name}</h2><p className="mt-1 text-sm text-zinc-600">Trạng thái: {food.state}</p>
      <div className="mt-5 grid grid-cols-2 gap-3"><Metric label="Protein / 100g" value={`${food.protein}g`} /><Metric label="Calories / 100g" value={food.calories} /><Metric label="Carb / 100g" value={`${food.carbs}g`} /><Metric label="Fat / 100g" value={`${food.fat}g`} /></div>
      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 p-4"><ShoppingBasket className="size-5 text-zinc-500" /><div><p className="text-xs text-zinc-600">Giá tham khảo / {food.unit}</p><strong>{formatter.format(food.priceMin)}–{formatter.format(food.priceMax)}đ</strong></div></div>
      <Link href={`/nutrition?food=${encodeURIComponent(food.name)}`} className="mt-3 flex w-full items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/10">Thêm vào thực đơn</Link>
    </article>)}</div>
  </div></AppShell>;
}

function Metric({ label, value }) {
  return <div className="rounded-2xl bg-black/30 p-4"><p className="text-xs text-zinc-600">{label}</p><strong className="mt-1 block text-2xl">{value}</strong></div>;
}
