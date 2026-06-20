import { clearAuthSession, getAuthToken, saveAuthSession } from "@/lib/auth";

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "")
).replace(/\/+$/, "");

async function generateAiPlan(profile) {
  return request("/api/ai/plans/generate", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ profile }),
  });
}
async function adjustAiPlan() { return request("/api/ai/plans/adjust", { method: "POST", auth: true }); }

async function getCurrentFitnessPlan() {
  return request("/api/ai/plans/current", { auth: true });
}

async function registerUser({ email, username, password }) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, username, password }),
  });
}

async function loginUser({ email, password, rememberLogin }) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, rememberLogin }),
  });
}

async function refreshAuthSession() {
  const data = await request("/api/auth/refresh", { method: "POST" }, false);
  saveAuthSession(data);
  return data;
}

async function logoutUser() {
  return request("/api/auth/logout", { method: "POST" }, false);
}

async function verifyEmail(token) {
  return request(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
}

async function forgotPassword(email) {
  return request("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
}

async function resetPassword(token, password) {
  return request("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) });
}

async function resendVerification(email) {
  return request("/api/auth/resend-verification", { method: "POST", body: JSON.stringify({ email }) });
}

async function getCurrentUser() {
  return request("/api/auth/me", {
    auth: true,
  });
}

async function updateAccount({ username, avatarUrl }) {
  return request("/api/auth/me", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ username, avatarUrl }),
  });
}

async function changePassword({ currentPassword, newPassword }) {
  return request("/api/auth/password", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

async function getWorkoutLogs() {
  return request("/api/workouts/logs", { auth: true });
}

async function updateWorkoutLog(scheduledDate, payload) {
  return request(`/api/workouts/logs/${scheduledDate}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

async function getProgressData() { return request("/api/tracking/progress", { auth: true }); }
async function saveProgressEntry(date, payload) { return request(`/api/tracking/progress/${date}`, { method: "PUT", auth: true, body: JSON.stringify(payload) }); }
async function getNutritionLog(date) { return request(`/api/tracking/nutrition/${date}`, { auth: true }); }
async function saveNutritionLog(date, meals) { return request(`/api/tracking/nutrition/${date}`, { method: "PUT", auth: true, body: JSON.stringify({ meals }) }); }

async function request(path, options = {}, retry = true) {
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL chưa được cấu hình cho môi trường deploy");
  }

  const { auth = false, ...fetchOptions } = options;
  const token = auth ? getAuthToken() : null;
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(fetchOptions.headers || {}),
    },
  });
  const payload = await parseJson(response);

  if (response.status === 401 && auth && retry) {
    try {
      await refreshAuthSession();
      return request(path, options, false);
    } catch (error) {
      clearAuthSession();
      throw error;
    }
  }

  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload.data || payload;
}

async function parseJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export {
  changePassword,
  adjustAiPlan,
  generateAiPlan,
  forgotPassword,
  getCurrentUser,
  getCurrentFitnessPlan,
  getWorkoutLogs,
  getProgressData,
  getNutritionLog,
  loginUser,
  logoutUser,
  refreshAuthSession,
  resendVerification,
  resetPassword,
  registerUser,
  updateAccount,
  updateWorkoutLog,
  saveProgressEntry,
  saveNutritionLog,
  verifyEmail,
};
