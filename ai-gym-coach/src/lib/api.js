const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

async function generateAiPlan(profile) {
  const response = await fetch(`${apiBaseUrl}/api/ai/plans/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ profile }),
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(payload.message || "Không thể tạo plan AI");
  }

  return payload.data;
}

async function registerUser({ email, password }) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

async function loginUser({ email, password }) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

async function verifyEmail(token) {
  return request(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
}

async function getCurrentUser(token) {
  return request("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const payload = await parseJson(response);

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

export { generateAiPlan, getCurrentUser, loginUser, registerUser, verifyEmail };
