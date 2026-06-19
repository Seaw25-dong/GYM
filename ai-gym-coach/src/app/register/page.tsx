"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ToastMessage } from "@/components/toast-message";
import { PasswordInput } from "@/components/password-input";
import { AuthPageShell } from "@/components/auth-page-shell";
import { registerUser } from "@/lib/api";

const emailRegex = /^\S+@\S+\.\S+$/;

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
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

    if (username.trim().length < 3 || username.trim().length > 30) {
      showToast("Username phải có từ 3 đến 30 ký tự", "error");
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
      const data = await registerUser({ email, username: username.trim(), password });
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
    <AuthPageShell
      title="Xây nền tảng mạnh hơn từ dữ liệu của chính bạn."
      description="Tạo tài khoản để lưu chỉ số, nhận lịch tập và dinh dưỡng được cá nhân hóa theo mục tiêu."
    >
      <ToastMessage message={toast} type={toastType} />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Quay lại
        </Link>

        <h1 className="mt-7 text-3xl font-bold sm:mt-8 sm:text-4xl">Đăng ký</h1>
        <p className="mt-3 text-zinc-400">
          Sau khi đăng ký, hệ thống sẽ gửi email xác thực. Link có hiệu lực trong 10 phút.
        </p>

        <div className="mt-8 grid gap-5">
          <label>
            <span className="mb-2 block text-sm text-zinc-500">Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              minLength={3}
              maxLength={30}
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 outline-none transition focus:border-white/30"
            />
            <span className="mt-2 block text-xs text-zinc-600">
              Tên này sẽ hiển thị trong ứng dụng.
            </span>
          </label>
          <label>
            <span className="mb-2 block text-sm text-zinc-500">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 outline-none transition focus:border-white/30"
            />
          </label>
          <PasswordInput
            label="Mật khẩu"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
          <PasswordInput
            label="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            hint="Mật khẩu phải dài hơn 8 ký tự."
          />
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
    </AuthPageShell>
  );
}
