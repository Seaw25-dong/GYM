"use client";

import { motion } from "framer-motion";
import { Activity, Brain, Dumbbell, Utensils } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { getAuthUser } from "@/lib/auth";

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const syncUser = () => setUser(getAuthUser());
    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("ai-gym-auth-change", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("ai-gym-auth-change", syncUser);
    };
  }, []);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-zinc-800 blur-3xl" />
      <video
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 h-dvh w-full select-none object-cover scale-105"
      >
        <source src="/video/15079739_1920_1080_30fps.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-dvh bg-black/70" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6">
        <Link href="/" className="text-lg font-bold">
          AI Gym Coach
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur md:flex">
          {[
            ["Giới thiệu", "/about"],
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

        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/about" className="text-sm text-zinc-400 hover:text-white md:hidden">Giới thiệu</Link>
            <Link href="/settings" className="hidden items-center gap-2 text-sm text-zinc-300 sm:flex">
              {user.avatarUrl ? (
                <Image unoptimized src={user.avatarUrl} alt="" width={32} height={32} className="size-8 rounded-full object-cover" />
              ) : (
                <span className="grid size-8 place-items-center rounded-full bg-white text-xs font-bold text-black">
                  {(user.username || user.email).charAt(0).toUpperCase()}
                </span>
              )}
              {user.username || user.email}
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:scale-105"
            >
              Vào ứng dụng
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/about" className="text-sm text-zinc-400 hover:text-white md:hidden">Giới thiệu</Link>
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
        )}
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100dvh-80px)] max-w-7xl flex-col items-center px-4 py-12 sm:px-6 sm:py-20">
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
          className="max-w-5xl text-center text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-7xl"
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
          className="mt-9 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4"
        >
          <Link
            href={user ? "/onboarding" : "/login?next=/onboarding"}
            className="rounded-2xl bg-white px-7 py-3 text-center font-medium text-black transition hover:scale-105"
          >
            Nhập chỉ số
          </Link>

          <Link
            href={user ? "/dashboard" : "/register"}
            className="rounded-2xl border border-white/10 bg-white/5 px-7 py-3 text-center font-medium backdrop-blur transition hover:bg-white/10"
          >
            {user ? "Xem tổng quan" : "Tạo tài khoản"}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 w-full max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl sm:mt-24 sm:p-6"
        >
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4">
            {[
              ["Calo mục tiêu", "2480"],
              ["Protein", "180g"],
              ["Lịch tập", "4 buổi"],
              ["Thực đơn", "Theo gram"],
            ].map(([title, value]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
                <p className="text-sm text-zinc-500">{title}</p>
                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{value}</h2>
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

      <section className="relative z-10 border-t border-white/10 bg-black px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-zinc-500">Một hệ thống xuyên suốt</p>
              <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
                Plan không đứng yên—nó thay đổi cùng quá trình tập của bạn
              </h2>
              <p className="mt-5 max-w-2xl leading-relaxed text-zinc-400">
                Lịch tập, set thực tế, cân nặng, số đo và nhật ký ăn được lưu cùng một tài khoản. Khi có đủ lịch sử, AI có thể nhìn xu hướng thay vì chỉ dựa vào một lần nhập chỉ số.
              </p>
              <Link href="/about" className="mt-7 inline-flex rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium transition hover:bg-white/10">
                Tìm hiểu cách web hoạt động
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["01", "Lịch tập realtime", "Xem đúng buổi theo ngày, ghi từng set và đồng bộ trạng thái hoàn thành."],
                ["02", "Tiến độ thật", "Biểu đồ cân nặng, số đo, ảnh và PR lấy trực tiếp từ dữ liệu của bạn."],
                ["03", "Nhật ký dinh dưỡng", "Theo dõi bữa ăn và lượng gram thực tế thay vì chỉ đọc thực đơn mẫu."],
                ["04", "Kiến thức dễ tra", "Thuật ngữ gym, cardio và supplement được giải thích ngay trong app."],
              ].map(([number, title, text]) => (
                <article key={number} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <span className="text-sm font-bold text-zinc-700">{number}</span>
                  <h3 className="mt-4 text-xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden border-t border-white/10 bg-zinc-950 px-4 py-20 text-center sm:px-6 sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06] blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Bắt đầu từ hôm nay</p>
          <h2 className="mt-5 text-4xl font-bold leading-tight sm:text-6xl">
            Tập có dữ liệu. Ăn có mục tiêu. Tiến bộ có thể nhìn thấy.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-zinc-400">
            Tạo tài khoản, nhập chỉ số và nhận plan đầu tiên. Bạn luôn có thể cập nhật lại khi mục tiêu hoặc lịch sinh hoạt thay đổi.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={user ? "/onboarding" : "/register"} className="rounded-2xl bg-white px-8 py-3 font-medium text-black transition hover:scale-105">
              {user ? "Cập nhật chỉ số" : "Tạo tài khoản miễn phí"}
            </Link>
            <Link href="/supplements" className="rounded-2xl border border-white/10 px-8 py-3 font-medium text-zinc-300 transition hover:bg-white/10">
              Xem kiến thức bổ sung
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 bg-black px-4 pb-8 pt-14 sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Link href="/" className="text-xl font-bold">AI Gym Coach</Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
                Nền tảng hỗ trợ xây dựng lịch tập, dinh dưỡng và theo dõi tiến độ cá nhân bằng dữ liệu và AI.
              </p>
            </div>

            {[
              ["Khám phá", [["Giới thiệu", "/about"], ["Bài tập", "/exercises"], ["Thực phẩm", "/foods"], ["Thuật ngữ", "/glossary"], ["Thực phẩm bổ sung", "/supplements"]]],
              ["Ứng dụng", [["Tổng quan", "/dashboard"], ["Lịch tập", "/workout"], ["Dinh dưỡng", "/nutrition"], ["Tiến độ", "/progress"]]],
              ["Tài khoản", [["Đăng nhập", "/login"], ["Đăng ký", "/register"], ["Quên mật khẩu", "/forgot-password"], ["Cài đặt", "/settings"]]],
            ].map(([heading, links]) => (
              <div key={heading}>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">{heading}</h3>
                <div className="mt-4 grid gap-3 text-sm">
                  {links.map(([label, href]) => <Link key={href} href={href} className="text-zinc-600 transition hover:text-white">{label}</Link>)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-7 text-xs leading-relaxed text-zinc-700 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} AI Gym Coach. All rights reserved.</p>
            <p className="max-w-2xl sm:text-right">Thông tin trên website mang tính tham khảo, không thay thế chẩn đoán hoặc tư vấn từ bác sĩ, chuyên gia dinh dưỡng hay huấn luyện viên có chuyên môn.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
