export function AuthPageShell({ children, title, description }) {
  return (
    <main className="isolate grid min-h-dvh bg-black text-white lg:grid-cols-2">
      <section className="relative z-20 flex min-h-dvh items-start justify-center overflow-y-auto px-4 py-4 sm:items-center sm:px-6 sm:py-10 lg:px-10">
        {children}
      </section>

      <aside className="pointer-events-none relative hidden min-h-dvh overflow-hidden border-l border-white/10 lg:block" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          tabIndex={-1}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover scale-105"
        >
          <source src="/video/15079739_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute bottom-12 left-12 right-12 rounded-3xl border border-white/15 bg-black/35 p-8 backdrop-blur-xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-400">AI Gym Coach</p>
          <h2 className="mt-4 max-w-xl text-4xl font-bold leading-tight">{title}</h2>
          <p className="mt-4 max-w-lg leading-relaxed text-zinc-300">{description}</p>
          <div className="mt-6 flex gap-2">
            <span className="h-1.5 w-16 rounded-full bg-white" />
            <span className="h-1.5 w-6 animate-pulse rounded-full bg-white/30" />
            <span className="h-1.5 w-6 animate-pulse rounded-full bg-white/15" />
          </div>
        </div>
      </aside>
    </main>
  );
}
