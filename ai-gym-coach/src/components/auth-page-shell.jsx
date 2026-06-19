export function AuthPageShell({ children, title, description }) {
  return (
    <main className="grid min-h-screen bg-black text-white lg:grid-cols-2">
      <section className="relative z-10 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
        {children}
      </section>

      <aside className="relative hidden min-h-screen overflow-hidden border-l border-white/10 lg:block">
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full scale-105 object-cover">
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
