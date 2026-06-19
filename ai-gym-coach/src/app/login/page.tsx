"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { ToastMessage } from "@/components/toast-message";
import { loginUser } from "@/lib/api";
import { saveAuthSession } from "@/lib/auth";

const emailRegex = /^\S+@\S+\.\S+$/;

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!emailRegex.test(email)) {
      showToast("Email không đúng định dạng", "error");
      return;
    }

    if (password.length <= 8) {
      showToast("Mật khẩu phải dài hơn 8 ký tự", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await loginUser({ email, password });
      saveAuthSession(data);
      router.push(next);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (message, type = "info") => {
    setToast(message);
    setToastType(type);
    window.setTimeout(() => setToast(""), 4000);
  };

  return (
    <AuthPageShell>
      <ToastMessage message={toast} type={toastType} />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-black/55 p-8 shadow-2xl shadow-black/50 backdrop-blur-xl"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Quay lại
        </Link>

        <h1 className="mt-8 text-4xl font-bold">Đăng nhập</h1>
        <p className="mt-3 text-zinc-400">
          Đăng nhập để tạo plan AI và lưu dữ liệu cá nhân của bạn.
        </p>

        <div className="mt-8 grid gap-5">
          <label>
            <span className="mb-2 block text-sm text-zinc-500">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 outline-none transition focus:border-white/30"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm text-zinc-500">Mật khẩu</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 outline-none transition focus:border-white/30"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 w-full rounded-2xl bg-white px-6 py-4 font-medium text-black transition hover:scale-[1.02]"
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <p className="mt-5 text-center text-sm text-zinc-500">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-white hover:underline">
            Đăng ký
          </Link>
        </p>
      </form>
    </AuthPageShell>
  );
}

function AuthPageShell({ children }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-white">
      <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-40">
        <source src="/video/15079739_1920_1080_30fps.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage:
          "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }} />
      <div className="relative z-10 w-full">{children}</div>
    </main>
  );
}

function LoginFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <p className="text-zinc-500">Đang tải trang đăng nhập...</p>
    </main>
  );
}
