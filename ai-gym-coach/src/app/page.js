"use client";

import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
     
      {/* Background Glow */}
      <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-zinc-800 blur-3xl" />
 {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover scale-105"
      >
       <source src="/video/15079739_1920_1080_30fps.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />
      {/* Animated Grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 py-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur"
        >
          AI Fitness Coach
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl text-center text-6xl font-bold leading-tight tracking-tight md:text-7xl"
        >
          Adaptive AI Training
          <span className="text-zinc-500"> Built Around You</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 max-w-2xl text-center text-lg text-zinc-400"
        >
          Personalized workouts, recovery tracking, AI coaching, and progression
          analysis tailored specifically to your body.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-10 flex gap-4"
        >
          <button className="rounded-2xl bg-white px-7 py-3 font-medium text-black transition hover:scale-105">
            Start Training
          </button>

          <button className="rounded-2xl border border-white/10 bg-white/5 px-7 py-3 font-medium backdrop-blur transition hover:bg-white/10">
            View Demo
          </button>
        </motion.div>

        {/* Mockup Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24 w-full max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="grid gap-6 md:grid-cols-4">
            {/* Cards */}
            {[
              ["Calories", "2480"],
              ["Protein", "180g"],
              ["Recovery", "82%"],
              ["Workout Streak", "14 days"],
            ].map(([title, value]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-black/40 p-5"
              >
                <p className="text-sm text-zinc-500">{title}</p>
                <h2 className="mt-2 text-3xl font-bold">{value}</h2>
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-6">
            <p className="text-sm text-zinc-500">AI Insight</p>

            <h3 className="mt-3 text-2xl font-semibold">
              Recovery slightly reduced
            </h3>

            <p className="mt-2 max-w-2xl text-zinc-400">
              Your training volume increased 18% this week while sleep duration
              decreased. Consider reducing intensity slightly tomorrow.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
