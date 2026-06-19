"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Dumbbell,
  PlayCircle,
  Radio,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-nav";
import { EmptyPlanState, PlanLoadingState } from "@/components/empty-plan-state";
import { useFitnessPlan } from "@/hooks/use-fitness-plan";
import { useWorkoutRealtime } from "@/hooks/use-workout-realtime";
import {
  createWorkoutSessions,
  fromDateKey,
  getDateForSessionInWeek,
  getScheduledSession,
  getTrainingDays,
  toDateKey,
  weekdayLabels,
} from "@/lib/workout-schedule";
import { cn } from "@/lib/utils";

const calendarWeekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function WorkoutPage() {
  const { profile, plan, generatedPlan, hasSavedPlan, isLoading } = useFitnessPlan();
  const { connected, logs, saveLog } = useWorkoutRealtime();
  const sessions = useMemo(
    () => createWorkoutSessions({ profile, plan, generatedPlan }),
    [profile, plan, generatedPlan]
  );
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [saving, setSaving] = useState(false);
  const selectedDateObject = fromDateKey(selectedDate);
  const selectedSession = getScheduledSession(selectedDateObject, sessions, profile.gymDays, profile.trainingDays);
  const logsByDate = useMemo(
    () => Object.fromEntries(logs.map((log) => [log.scheduledDate, log])),
    [logs]
  );
  const selectedLog = logsByDate[selectedDate];

  if (isLoading) {
    return <AppShell><PlanLoadingState /></AppShell>;
  }

  if (!hasSavedPlan) {
    return (
      <AppShell>
        <EmptyPlanState
          title="Chưa có lịch tập"
          description="Hoàn tất tab Chỉ số để AI tạo các buổi tập phù hợp với mục tiêu và lịch của bạn."
        />
      </AppShell>
    );
  }

  const selectSession = (sessionIndex) => {
    const date = getDateForSessionInWeek(sessionIndex, profile.gymDays, new Date(), profile.trainingDays);
    setSelectedDate(toDateKey(date));
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const toggleCompleted = async (sets = [], exercises = []) => {
    if (!selectedSession) return;
    setSaving(true);
    try {
      await saveLog(selectedDate, {
        sessionIndex: selectedSession.index,
        workoutName: selectedSession.name,
        completed: !selectedLog?.completed,
        sets,
        exercises,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-zinc-500">
              <span>Lịch tập cá nhân</span>
              <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] tracking-normal", connected ? "border-emerald-500/30 text-emerald-400" : "border-white/10 text-zinc-600")}>
                <Radio className="size-3" />
                {connected ? "Realtime" : "Đang kết nối"}
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
              {profile.gymDays} buổi mỗi tuần
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-base">
              Chọn ngày trên lịch hoặc chọn một buổi trong danh sách để xem nội dung chi tiết.
            </p>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <WorkoutCalendar
            visibleMonth={visibleMonth}
            selectedDate={selectedDate}
            sessions={sessions}
            gymDays={profile.gymDays}
            trainingDays={profile.trainingDays}
            logsByDate={logsByDate}
            onMonthChange={setVisibleMonth}
            onSelectDate={setSelectedDate}
          />

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <Dumbbell className="size-5" />
              <div>
                <h2 className="text-xl font-semibold">Danh sách buổi tập</h2>
                <p className="text-sm text-zinc-600">Lịch lặp lại theo từng tuần</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {sessions.map((session, index) => {
                const weekday = getTrainingDays(profile.gymDays, profile.trainingDays)[index];
                const date = getDateForSessionInWeek(index, profile.gymDays, new Date(), profile.trainingDays);
                const log = logsByDate[toDateKey(date)];
                return (
                  <button
                    key={`${session.name}-${index}`}
                    type="button"
                    onClick={() => selectSession(index)}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-white/25 hover:bg-white/[0.06]"
                  >
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-widest text-zinc-600">{weekdayLabels[weekday]}</p>
                      <h3 className="mt-1 truncate text-lg font-semibold">{session.name}</h3>
                      <p className="mt-1 text-sm text-zinc-500">{session.exercises.length} bài tập</p>
                    </div>
                    {log?.completed ? <CheckCircle2 className="size-5 shrink-0 text-emerald-400" /> : <ChevronRight className="size-5 shrink-0 text-zinc-600" />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <WorkoutDetail
          key={`${selectedDate}-${selectedSession?.name || "rest"}`}
          date={selectedDateObject}
          session={selectedSession}
          completed={Boolean(selectedLog?.completed)}
          initialSets={selectedLog?.sets || []}
          initialExercises={selectedLog?.exercises?.length ? selectedLog.exercises : selectedSession?.exercises || []}
          saving={saving}
          onToggleCompleted={toggleCompleted}
        />
      </div>
    </AppShell>
  );
}

function WorkoutCalendar({ visibleMonth, selectedDate, sessions, gymDays, trainingDays, logsByDate, onMonthChange, onSelectDate }) {
  const days = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const todayKey = toDateKey(new Date());
  const monthLabel = new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(visibleMonth);

  const changeMonth = (offset) => {
    onMonthChange(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1));
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="size-5" />
          <h2 className="text-lg font-semibold capitalize sm:text-xl">{monthLabel}</h2>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => changeMonth(-1)} aria-label="Tháng trước" className="rounded-xl border border-white/10 p-2 hover:bg-white/10"><ChevronLeft className="size-5" /></button>
          <button type="button" onClick={() => changeMonth(1)} aria-label="Tháng sau" className="rounded-xl border border-white/10 p-2 hover:bg-white/10"><ChevronRight className="size-5" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {calendarWeekdays.map((day) => <div key={day} className="py-2 text-center text-xs font-medium text-zinc-600">{day}</div>)}
        {days.map((date) => {
          const key = toDateKey(date);
          const session = getScheduledSession(date, sessions, gymDays, trainingDays);
          const outside = date.getMonth() !== visibleMonth.getMonth();
          const completed = logsByDate[key]?.completed;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(key)}
              className={cn(
                "relative flex aspect-square min-w-0 flex-col items-center justify-center rounded-xl border text-sm transition sm:rounded-2xl",
                selectedDate === key ? "border-white bg-white text-black" : session ? "border-white/15 bg-white/[0.06] hover:bg-white/10" : "border-transparent text-zinc-600 hover:bg-white/5",
                outside && "opacity-30"
              )}
            >
              <span className={cn(todayKey === key && selectedDate !== key && "font-bold text-white")}>{date.getDate()}</span>
              {session && (
                <span className={cn("mt-1 size-1.5 rounded-full", completed ? "bg-emerald-400" : selectedDate === key ? "bg-black" : "bg-white")} />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500">
        <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-white" />Ngày tập</span>
        <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-400" />Đã hoàn thành</span>
      </div>
    </section>
  );
}

function WorkoutDetail({ date, session, completed, initialSets, initialExercises, saving, onToggleCompleted }) {
  const dateLabel = new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
  const [sets, setSets] = useState(initialSets);
  const [activeExercises, setActiveExercises] = useState(initialExercises);
  const [drafts, setDrafts] = useState({});
  const [restSeconds, setRestSeconds] = useState(0);
  useEffect(() => {
    if (restSeconds <= 0) return;
    const timer = window.setInterval(() => setRestSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [restSeconds]);

  if (!session) {
    return (
      <section className="mt-6 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
        <Circle className="mx-auto size-8 text-zinc-700" />
        <h2 className="mt-4 text-2xl font-bold capitalize">{dateLabel}</h2>
        <p className="mt-2 text-zinc-500">Ngày nghỉ — phục hồi tốt cũng là một phần của plan.</p>
      </section>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.section key={`${toDateKey(date)}-${session.name}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm capitalize text-zinc-500">{dateLabel}</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{session.name}</h2>
            <p className="mt-3 max-w-2xl text-zinc-400">{session.focus}</p>
          </div>
          <button type="button" disabled={saving} onClick={() => onToggleCompleted(sets, activeExercises)} className={cn("inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition disabled:opacity-50", completed ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "bg-white text-black hover:scale-105")}>
            {completed ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
            {saving ? "Đang lưu..." : completed ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
          </button>
        </div>

        <div className="mb-5 flex flex-wrap gap-3 text-sm text-zinc-400">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2"><Clock className="size-4" />60–75 phút</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2"><Dumbbell className="size-4" />{activeExercises.length} bài</span>
          <button type="button" onClick={() => setRestSeconds(90)} className="rounded-full border border-white/10 bg-black/30 px-4 py-2">{restSeconds > 0 ? `Nghỉ ${Math.floor(restSeconds / 60)}:${String(restSeconds % 60).padStart(2,"0")}` : "Bắt đầu nghỉ 90s"}</button>
        </div>

        <div className="space-y-3">
          {activeExercises.map((exercise, index) => (
            <article key={`${exercise.name}-${index}`} className="grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 sm:grid-cols-[80px_1fr] sm:p-5">
              <div className="flex aspect-video items-center justify-center rounded-xl bg-white/5 sm:aspect-square"><PlayCircle className="size-7 text-zinc-600" /></div>
              <div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div><h3 className="text-xl font-bold sm:text-2xl">{exercise.name}</h3><p className="mt-1 text-sm text-zinc-600">{exercise.muscleGroup || "Nhóm cơ chính"}</p></div>
                  <span className="w-fit rounded-full border border-white/10 px-3 py-1.5 text-sm text-zinc-300">{exercise.sets} sets × {exercise.reps}</span>
                </div>
                <p className="mt-3 text-sm text-zinc-500">Nghỉ {exercise.restSeconds || 90}s giữa các set</p>
                <p className="mt-2 leading-relaxed text-zinc-400">{exercise.note}</p>
                <div className="mt-3 flex gap-2 text-xs"><button type="button" onClick={() => { const name = window.prompt("Tên bài thay thế", exercise.name); if (name?.trim()) setActiveExercises((items) => items.map((item,i) => i === index ? { ...item, name: name.trim() } : item)); }} className="rounded-lg border border-white/10 px-3 py-2">Đổi bài</button><button type="button" onClick={() => setActiveExercises((items) => items.filter((_,i) => i !== index))} className="rounded-lg border border-red-500/20 px-3 py-2 text-red-400">Bỏ bài</button></div>
                <div className="mt-4 flex flex-wrap items-end gap-2">
                  <label className="text-xs text-zinc-600">Kg<input type="number" min="0" step="0.5" value={drafts[exercise.name]?.weight || ""} onChange={(e) => setDrafts((d) => ({ ...d, [exercise.name]: { ...d[exercise.name], weight: e.target.value } }))} className="mt-1 block w-24 rounded-lg border border-white/10 bg-black p-2 text-white" /></label>
                  <label className="text-xs text-zinc-600">Reps<input type="number" min="1" value={drafts[exercise.name]?.reps || ""} onChange={(e) => setDrafts((d) => ({ ...d, [exercise.name]: { ...d[exercise.name], reps: e.target.value } }))} className="mt-1 block w-20 rounded-lg border border-white/10 bg-black p-2 text-white" /></label>
                  <button type="button" onClick={() => { const draft = drafts[exercise.name]; if (!draft?.reps) return; setSets((current) => [...current, { exerciseName: exercise.name, weight: Number(draft.weight) || 0, reps: Number(draft.reps) }]); setDrafts((d) => ({ ...d, [exercise.name]: {} })); setRestSeconds(exercise.restSeconds || 90); }} className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/10">+ Ghi set</button>
                </div>
                {sets.filter((set) => set.exerciseName === exercise.name).length > 0 && <p className="mt-3 text-sm text-emerald-400">{sets.filter((set) => set.exerciseName === exercise.name).map((set) => `${set.weight}kg × ${set.reps}`).join(" · ")}</p>}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-sky-500/20 bg-sky-500/[0.06] p-4 text-sm leading-relaxed text-zinc-300 sm:p-5">
          <strong className="text-sky-300">Gợi ý cardio:</strong>{" "}
          Các bạn có thể thêm một số bài cardio trong quá trình luyện tập để cải thiện tim mạch hoặc giúp đốt nhiều calo hơn trong lúc giảm mỡ. Các bài tập cardio có thể tham khảo trong mục{" "}
          <Link href="/exercises" className="font-medium text-white underline underline-offset-4">Bài tập</Link>.
        </div>
      </motion.section>
    </AnimatePresence>
  );
}

function buildCalendarDays(month) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const mondayOffset = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const start = new Date(first);
  start.setDate(first.getDate() - mondayOffset);
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}
