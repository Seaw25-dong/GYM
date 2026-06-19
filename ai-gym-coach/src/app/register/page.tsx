"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ToastMessage } from "@/components/toast-message";
import { registerUser } from "@/lib/api";

const emailRegex = /^\S+@\S+\.\S+$/;

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password !== confirmPassword) {
      showToast("Mật khẩu xác nhận không khớp", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await registerUser({ email, password });
      showToast(data.message || "Vui lòng kiểm tra email để xác thực tài khoản.");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (message, type = "info") => {
    setToast(message);
    setToastType(type);
    window.setTimeout(() => setToast(""), 6000);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-10 text-white">
      <ToastMessage message={toast} type={toastType} />
      <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-40">
        <source src="/video/15079739_1920_1080_30fps.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage:
          "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }} />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-black/55 p-8 shadow-2xl shadow-black/50 backdrop-blur-xl"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Quay lại
        </Link>

        <h1 className="mt-8 text-4xl font-bold">Đăng ký</h1>
        <p className="mt-3 text-zinc-400">
          Sau khi đăng ký, hệ thống sẽ gửi email xác thực. Link có hiệu lực trong 10 phút.
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
          <label>
            <span className="mb-2 block text-sm text-zinc-500">Xác nhận mật khẩu</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 outline-none transition focus:border-white/30"
            />
            <span className="mt-2 block text-xs text-zinc-600">
              Mật khẩu phải dài hơn 8 ký tự.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 w-full rounded-2xl bg-white px-6 py-4 font-medium text-black transition hover:scale-[1.02]"
        >
          {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        <p className="mt-5 text-center text-sm text-zinc-500">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-white hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </main>
  );
}
