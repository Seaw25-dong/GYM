"use client";

import { Camera, LockKeyhole, SlidersHorizontal, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { AppShell } from "@/components/app-nav";
import { PasswordInput } from "@/components/password-input";
import { ToastMessage } from "@/components/toast-message";
import { changePassword, updateAccount } from "@/lib/api";
import { clearAuthSession, getAuthUser, updateAuthUser } from "@/lib/auth";

export default function SettingsPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("info");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const user = getAuthUser();
      setUsername(user?.username || "");
      setEmail(user?.email || "");
      setAvatarUrl(user?.avatarUrl || "");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const showToast = (message, type = "info") => {
    setToast(message);
    setToastType(type);
    window.setTimeout(() => setToast(""), 4500);
  };

  const handleAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 500 * 1024) {
      showToast("Avatar phải là ảnh nhỏ hơn 500 KB", "error");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (username.trim().length < 3 || username.trim().length > 30) {
      showToast("Username phải có từ 3 đến 30 ký tự", "error");
      return;
    }

    setSavingProfile(true);
    try {
      const data = await updateAccount({ username: username.trim(), avatarUrl });
      updateAuthUser(data.user);
      setUsername(data.user.username);
      showToast("Đã cập nhật hồ sơ", "success");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (newPassword.length <= 8) {
      showToast("Mật khẩu mới phải dài hơn 8 ký tự", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Mật khẩu xác nhận không khớp", "error");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      clearAuthSession();
      router.replace("/login?passwordChanged=1");
    } catch (error) {
      showToast(error.message, "error");
      setSavingPassword(false);
    }
  };

  return (
    <AppShell>
      <ToastMessage message={toast} type={toastType} />
      <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-10">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Tài khoản</p>
          <h1 className="mt-3 text-4xl font-bold">Cài đặt cá nhân</h1>
          <p className="mt-3 text-zinc-500">
            Email chỉ dùng để đăng nhập. Username và avatar sẽ hiển thị trong ứng dụng.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <form onSubmit={handleProfileSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-6 flex items-center gap-3">
              <UserRound className="size-5" />
              <h2 className="text-xl font-semibold">Hồ sơ hiển thị</h2>
            </div>

            <div className="mb-6 flex items-center gap-5">
              <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-3xl border border-white/10 bg-black/40">
                {avatarUrl ? (
                  <Image unoptimized src={avatarUrl} alt="Avatar xem trước" width={96} height={96} className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="size-9 text-zinc-600" />
                )}
              </div>
              <div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm transition hover:bg-white/10">
                  <Camera className="size-4" />
                  Chọn avatar
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatar} className="sr-only" />
                </label>
                <p className="mt-2 text-xs text-zinc-600">PNG, JPG hoặc WebP, tối đa 500 KB.</p>
                {avatarUrl && (
                  <button type="button" onClick={() => setAvatarUrl("")} className="mt-2 text-xs text-zinc-400 hover:text-white">
                    Xóa avatar
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-5">
              <label>
                <span className="mb-2 block text-sm text-zinc-500">Username</span>
                <input value={username} onChange={(event) => setUsername(event.target.value)} minLength={3} maxLength={30} className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 outline-none focus:border-white/30" />
              </label>
              <label>
                <span className="mb-2 block text-sm text-zinc-500">Email đăng nhập</span>
                <input value={email} readOnly className="w-full cursor-not-allowed rounded-2xl border border-white/5 bg-black/30 px-5 py-4 text-zinc-600 outline-none" />
              </label>
            </div>

            <button disabled={savingProfile} className="mt-6 w-full rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:scale-[1.01] disabled:opacity-60">
              {savingProfile ? "Đang lưu..." : "Lưu hồ sơ"}
            </button>
          </form>

          <form onSubmit={handlePasswordSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-6 flex items-center gap-3">
              <LockKeyhole className="size-5" />
              <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
            </div>
            <div className="grid gap-5">
              <PasswordInput label="Mật khẩu hiện tại" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" />
              <PasswordInput label="Mật khẩu mới" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" />
              <PasswordInput label="Xác nhận mật khẩu mới" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" hint="Sau khi đổi mật khẩu, bạn cần đăng nhập lại." />
            </div>
            <button disabled={savingPassword} className="mt-6 w-full rounded-2xl border border-white/15 px-5 py-3 font-medium transition hover:bg-white/10 disabled:opacity-60">
              {savingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
            </button>
          </form>
        </div>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="size-5" />
            <h2 className="text-xl font-semibold">Tùy chọn khác</h2>
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            Khu vực này đã sẵn sàng để thêm thông báo, giao diện và các setting bạn nghĩ ra sau.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
