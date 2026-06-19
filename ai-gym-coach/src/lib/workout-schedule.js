import { fallbackWorkoutExercises } from "@/lib/exercise-library";

const weekdayLabels = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const trainingDaysByCount = {
  1: [1],
  2: [1, 4],
  3: [1, 3, 5],
  4: [1, 2, 4, 6],
  5: [1, 2, 3, 5, 6],
  6: [1, 2, 3, 4, 5, 6],
  7: [0, 1, 2, 3, 4, 5, 6],
};

function createWorkoutSessions({ profile, plan, generatedPlan }) {
  const aiSessions = generatedPlan?.workoutPlan;
  const requestedDays = Math.min(7, Math.max(1, Number(profile.gymDays) || 1));
  const source = aiSessions?.length
    ? aiSessions
    : plan.workoutSplit.map((name) => ({ name, focus: "Buổi tập nền tảng theo mục tiêu hiện tại." }));

  return Array.from({ length: requestedDays }, (_, index) => {
    const session = source[index % source.length] || {};
    return {
      index,
      name: session.name || `Buổi ${index + 1}`,
      focus: session.focus || "Buổi tập được cá nhân hóa theo plan của bạn.",
      exercises: session.exercises?.length ? session.exercises : fallbackWorkoutExercises,
    };
  });
}

function getTrainingDays(gymDays, customDays = []) {
  const count = Math.min(7, Math.max(1, Number(gymDays) || 1));
  if (Array.isArray(customDays) && customDays.length === count) return customDays;
  return trainingDaysByCount[count];
}

function getScheduledSession(date, sessions, gymDays, trainingDays = []) {
  const sessionIndex = getTrainingDays(gymDays, trainingDays).indexOf(date.getDay());
  return sessionIndex < 0 ? null : sessions[sessionIndex % sessions.length] || null;
}

function getDateForSessionInWeek(sessionIndex, gymDays, referenceDate = new Date(), trainingDays = []) {
  const monday = new Date(referenceDate);
  const day = referenceDate.getDay();
  monday.setDate(referenceDate.getDate() - (day === 0 ? 6 : day - 1));
  const weekday = getTrainingDays(gymDays, trainingDays)[sessionIndex];
  const result = new Date(monday);
  result.setDate(monday.getDate() + (weekday === 0 ? 6 : weekday - 1));
  return result;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export {
  createWorkoutSessions,
  fromDateKey,
  getDateForSessionInWeek,
  getScheduledSession,
  getTrainingDays,
  toDateKey,
  weekdayLabels,
};
