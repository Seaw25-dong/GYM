"use client";

import { motion } from "framer-motion";
import { Activity, Brain, Dumbbell, Utensils } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Activity,
    title: "Tính chỉ số nền",
    text: "Nhập chiều cao, cân nặng, tần suất gym/thể thao để tính BMR, TDEE, calo mục tiêu và macro.",
  },
  {
    icon: Brain,
    title: "AI tạo plan",
    text: "AI dùng các chỉ số đã tính để tạo lịch tập, bài tập, thực đơn và ghi chú coach cá nhân hóa.",
  },
  {
    icon: Dumbbell,
    title: "Lịch tập rõ ràng",
    text: "Mỗi buổi có 5-6 bài, sets, reps, thời gian nghỉ và ghi chú kỹ thuật để bạn dễ theo.",
  },
  {
    icon: Utensils,
    title: "Thực đơn theo gram",
    text: "Mỗi bữa hiển thị kcal và gram từng thực phẩm như yến mạch, ức gà, rau xanh, cơm hoặc khoai.",
  },
];

const steps = [
  ["01", "Tạo tài khoản", "Đăng ký bằng email, xác thực qua link trong 10 phút."],
  ["02", "Nhập chỉ số", "Điền tuổi, chiều cao, cân nặng, số buổi gym và mục tiêu."],
  ["03", "Nhận plan AI", "App tạo lịch tập và thực đơn dựa trên calo/macro đã tính."],
  ["04", "Theo dõi và chỉnh", "Đổi món, xem thư viện bài tập và cập nhật plan khi mục tiêu thay đổi."],
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-zinc-800 blur-3xl" />
      <video autoPlay muted loop playsInline className="absolute inset-0 h-screen w-full object-cover scale-105">
        <source src="/video/15079739_1920_1080_30fps.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-x-0 top-0 h-screen bg-black/70" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg font-bold">
          AI Gym Coach
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur md:flex">
          {[
            ["Tổng quan", "/dashboard"],
            ["Tập luyện", "/workout"],
            ["Dinh dưỡng", "/nutrition"],
            ["Bài tập", "/exercises"],
            ["Thuật ngữ", "/glossary"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium transition hover:bg-white/10 sm:inline-flex"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:scale-105"
          >
            Đăng ký
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col items-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur"
        >
          AI Fitness Coach
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl text-center text-6xl font-bold leading-tight tracking-tight md:text-7xl"
        >
          Tăng cơ, giảm mỡ
          <span className="text-zinc-500"> theo dữ liệu của bạn</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 max-w-2xl text-center text-lg text-zinc-400"
        >
          Nhập chỉ số cơ thể, tần suất tập luyện và mục tiêu. App sẽ tính calo,
          macro, lịch tập và thực đơn khởi đầu phù hợp hơn với bạn.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-10 flex gap-4"
        >
          <Link
            href="/login?next=/onboarding"
            className="rounded-2xl bg-white px-7 py-3 font-medium text-black transition hover:scale-105"
          >
            Nhập chỉ số
          </Link>

          <Link
            href="/register"
            className="rounded-2xl border border-white/10 bg-white/5 px-7 py-3 font-medium backdrop-blur transition hover:bg-white/10"
          >
            Tạo tài khoản
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24 w-full max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="grid gap-6 md:grid-cols-4">
            {[
              ["Calo mục tiêu", "2480"],
              ["Protein", "180g"],
              ["Lịch tập", "4 buổi"],
              ["Thực đơn", "Theo gram"],
            ].map(([title, value]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <p className="text-sm text-zinc-500">{title}</p>
                <h2 className="mt-2 text-3xl font-bold">{value}</h2>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 border-t border-white/10 bg-black px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm uppercase tracking-widest text-zinc-500">Tính năng</p>
            <h2 className="mt-3 text-4xl font-bold">Không chỉ là bảng calo</h2>
            <p className="mt-4 text-zinc-400">
              Web kết hợp công thức dinh dưỡng nền tảng với AI để tạo plan dễ hiểu,
              có thể theo dõi và điều chỉnh theo mục tiêu.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <Icon className="size-8 text-white" />
                  <h3 className="mt-5 text-2xl font-bold">{feature.title}</h3>
                  <p className="mt-3 leading-relaxed text-zinc-400">{feature.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/10 bg-zinc-950 px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">Quy trình</p>
            <h2 className="mt-3 text-4xl font-bold">Từ chỉ số đến plan hằng ngày</h2>
            <p className="mt-4 text-zinc-400">
              Bạn không cần tự đoán ăn bao nhiêu hay tập kiểu gì. App giữ phần tính toán
              ở backend, còn AI tập trung sinh plan dễ làm theo.
            </p>
          </div>

          <div className="grid gap-4">
            {steps.map(([number, title, text]) => (
              <div key={number} className="grid gap-4 rounded-3xl border border-white/10 bg-black/30 p-5 sm:grid-cols-[80px_1fr]">
                <div className="text-3xl font-bold text-zinc-600">{number}</div>
                <div>
                  <h3 className="text-2xl font-bold">{title}</h3>
                  <p className="mt-2 text-zinc-400">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
