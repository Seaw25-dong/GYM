const authTokenKey = "ai-gym-auth-token";
const authUserKey = "ai-gym-auth-user";
const fitnessKeys = ["ai-gym-profile", "ai-gym-plan", "ai-gym-generated-plan"];

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(authTokenKey);
}

function getAuthUser() {
  if (typeof window === "undefined") return null;
  const rawUser = window.localStorage.getItem(authUserKey);
  return rawUser ? JSON.parse(rawUser) : null;
}

function saveAuthSession({ token, user }) {
  window.localStorage.setItem(authTokenKey, token);
  window.localStorage.setItem(authUserKey, JSON.stringify(user));
  clearFitnessData();
}

function clearAuthSession() {
  window.localStorage.removeItem(authTokenKey);
  window.localStorage.removeItem(authUserKey);
  clearFitnessData();
}

function clearFitnessData() {
  fitnessKeys.forEach((key) => window.localStorage.removeItem(key));
}

export { clearAuthSession, clearFitnessData, getAuthToken, getAuthUser, saveAuthSession };
