import { Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

export function EmptyPlanState({ title = "Chưa có dữ liệu", description }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-10 text-center sm:px-6">
      <div className="w-full rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-6 sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-black">
          <Activity className="size-6" />
        </span>
        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-lg leading-relaxed text-zinc-500">
          {description || "Hãy nhập chỉ số cơ thể và mục tiêu để AI tạo plan cá nhân cho bạn."}
        </p>
        <Link
          href="/onboarding"
          className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:scale-105"
        >
          Nhập chỉ số
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

export function PlanLoadingState() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-10">
      <div className="text-center">
        <span className="mx-auto block size-10 animate-spin rounded-full border-2 border-white/15 border-t-white" />
        <p className="mt-4 text-sm text-zinc-500">Đang tải plan từ hệ thống...</p>
      </div>
    </div>
  );
}
