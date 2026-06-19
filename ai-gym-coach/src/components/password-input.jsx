"use client";

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function PasswordInput({ label, value, onChange, autoComplete, hint = null }) {
  const [isVisible, setIsVisible] = useState(false);
  const hideTimer = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(hideTimer.current);
  }, []);

  const toggleVisibility = () => {
    window.clearTimeout(hideTimer.current);

    if (isVisible) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    hideTimer.current = window.setTimeout(() => setIsVisible(false), 5000);
  };

  return (
    <label>
      <span className="mb-2 block text-sm text-zinc-500">{label}</span>
      <span className="relative block">
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="w-full rounded-2xl border border-white/10 bg-black/50 py-4 pl-5 pr-14 outline-none transition focus:border-white/30"
        />
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu trong 5 giây"}
          title={isVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu trong 5 giây"}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-zinc-500 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          {isVisible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </span>
      {hint ? <span className="mt-2 block text-xs text-zinc-600">{hint}</span> : null}
    </label>
  );
}
