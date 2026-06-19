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

function saveAuthSession({ accessToken, user }) {
  window.localStorage.setItem(authTokenKey, accessToken);
  window.localStorage.setItem(authUserKey, JSON.stringify(user));
  clearFitnessData();
  notifyAuthChanged();
}

function updateAuthUser(user) {
  window.localStorage.setItem(authUserKey, JSON.stringify(user));
  notifyAuthChanged();
}

function clearAuthSession() {
  window.localStorage.removeItem(authTokenKey);
  window.localStorage.removeItem(authUserKey);
  clearFitnessData();
  notifyAuthChanged();
}

function clearFitnessData() {
  fitnessKeys.forEach((key) => window.localStorage.removeItem(key));
}

function notifyAuthChanged() {
  window.dispatchEvent(new Event("ai-gym-auth-change"));
}

export {
  clearAuthSession,
  clearFitnessData,
  getAuthToken,
  getAuthUser,
  saveAuthSession,
  updateAuthUser,
};
