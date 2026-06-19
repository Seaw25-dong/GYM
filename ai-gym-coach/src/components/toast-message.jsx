"use client";

function ToastMessage({ message, type = "info" }) {
  if (!message) return null;

  const tone =
    type === "error"
      ? "border-red-500/30 bg-red-500/10 text-red-100"
      : "border-white/10 bg-white/10 text-white";

  return (
    <div className={`fixed right-4 top-4 z-50 max-w-sm rounded-2xl border px-5 py-4 text-sm shadow-2xl backdrop-blur ${tone}`}>
      {message}
    </div>
  );
}

export { ToastMessage };
