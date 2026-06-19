import bcrypt from "bcryptjs";
import crypto from "crypto";
import express from "express";
import jwt from "jsonwebtoken";

import { requireAuth } from "../middleware/requireAuth.js";
import User from "../models/User.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "../services/email.service.js";
import { createHttpError } from "../utils/httpError.js";

const router = express.Router();
const emailRegex = /^\S+@\S+\.\S+$/;
const verificationTtlMs = 10 * 60 * 1000;
const resetTtlMs = 15 * 60 * 1000;
const refreshTtlMs = 30 * 24 * 60 * 60 * 1000;

router.post("/register", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const username = normalizeUsername(req.body.username);

    validateCredentials(email, password);
    validateUsername(username);

    const existingUser = await User.findOne({
      $or: [{ email }, { usernameNormalized: username.toLowerCase() }],
    });

    if (existingUser) {
      throw createHttpError(
        409,
        existingUser.email === email ? "Email đã được đăng ký" : "Username đã được sử dụng"
      );
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = await User.create({
      email,
      username,
      usernameNormalized: username.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
      emailVerificationTokenHash: hashToken(verificationToken),
      emailVerificationExpiresAt: new Date(Date.now() + verificationTtlMs),
    });
    const verificationUrl = buildVerificationUrl(verificationToken);

    await sendVerificationEmail({ email, verificationUrl });

    res.status(201).json({
      success: true,
      message: "Vui lòng kiểm tra email để xác thực tài khoản. Link có hiệu lực trong 10 phút.",
      data: {
        user: publicUser(user),
      },
    });
  } catch (error) {
    next(formatMongooseError(error));
  }
});

router.get("/verify-email", async (req, res, next) => {
  try {
    const token = String(req.query.token || "");

    if (!token) {
      throw createHttpError(400, "Verification token is required");
    }

    const user = await User.findOne({
      emailVerificationTokenHash: hashToken(token),
      emailVerificationExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      throw createHttpError(400, "Link xác thực không hợp lệ hoặc đã hết hạn");
    }

    user.emailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpiresAt = null;
    await user.save();

    res.json({
      success: true,
      message: "Tài khoản đã được xác thực. Bạn có thể đóng trang này hoặc đăng nhập.",
      data: {
        user: publicUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/resend-verification", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const user = emailRegex.test(email) ? await User.findOne({ email }) : null;
    if (user && !user.emailVerified) {
      const token = crypto.randomBytes(32).toString("hex");
      user.emailVerificationTokenHash = hashToken(token);
      user.emailVerificationExpiresAt = new Date(Date.now() + verificationTtlMs);
      await user.save();
      await sendVerificationEmail({ email, verificationUrl: buildVerificationUrl(token) });
    }
    res.json({ success: true, message: "Nếu tài khoản chưa xác thực, email mới đã được gửi." });
  } catch (error) { next(error); }
});

router.post("/forgot-password", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const user = emailRegex.test(email) ? await User.findOne({ email }) : null;
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      user.passwordResetTokenHash = hashToken(token);
      user.passwordResetExpiresAt = new Date(Date.now() + resetTtlMs);
      await user.save();
      await sendPasswordResetEmail({ email, resetUrl: buildResetUrl(token) });
    }
    res.json({ success: true, message: "Nếu email tồn tại, link đặt lại mật khẩu đã được gửi." });
  } catch (error) { next(error); }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    const token = String(req.body.token || "");
    const password = String(req.body.password || "");
    if (password.length <= 8) throw createHttpError(400, "Mật khẩu phải dài hơn 8 ký tự");
    const user = await User.findOne({
      passwordResetTokenHash: hashToken(token),
      passwordResetExpiresAt: { $gt: new Date() },
    });
    if (!user) throw createHttpError(400, "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
    user.passwordHash = await bcrypt.hash(password, 12);
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    user.refreshTokenHash = null;
    user.refreshTokenExpiresAt = null;
    await user.save();
    res.json({ success: true, message: "Đặt lại mật khẩu thành công." });
  } catch (error) { next(error); }
});

router.post("/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const rememberLogin = Boolean(req.body.rememberLogin);

    if (!emailRegex.test(email) || password.length <= 8) {
      throw createHttpError(400, "Email hoặc mật khẩu không hợp lệ");
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw createHttpError(401, "Email hoặc mật khẩu không đúng");
    }

    if (!user.emailVerified) {
      throw createHttpError(403, "Tài khoản chưa xác thực email");
    }

    await issueRefreshToken(res, user, rememberLogin);

    res.json({
      success: true,
      data: {
        accessToken: signAccessToken(user),
        user: publicUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = getCookie(req, "ai_gym_refresh_token");

    if (!refreshToken) {
      throw createHttpError(401, "Refresh token is required");
    }

    const payload = jwt.verify(refreshToken, getRefreshSecret());
    const user = await User.findById(payload.sub);

    if (
      !user ||
      !user.refreshTokenHash ||
      user.refreshTokenHash !== hashToken(refreshToken) ||
      user.refreshTokenExpiresAt <= new Date()
    ) {
      throw createHttpError(401, "Refresh token không hợp lệ hoặc đã hết hạn");
    }

    await issueRefreshToken(res, user, Boolean(payload.rememberLogin));
    res.json({
      success: true,
      data: { accessToken: signAccessToken(user), user: publicUser(user) },
    });
  } catch (error) {
    clearRefreshCookie(res);
    next(error.statusCode ? error : createHttpError(401, "Refresh token không hợp lệ"));
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const refreshToken = getCookie(req, "ai_gym_refresh_token");
    if (refreshToken) {
      const payload = jwt.decode(refreshToken);
      if (payload?.sub) {
        await User.findByIdAndUpdate(payload.sub, {
          refreshTokenHash: null,
          refreshTokenExpiresAt: null,
        });
      }
    }
    clearRefreshCookie(res);
    res.json({ success: true, data: { loggedOut: true } });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({
    success: true,
    data: {
      user: publicUser(req.user),
    },
  });
});

router.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const username = normalizeUsername(req.body.username);
    const avatarUrl = String(req.body.avatarUrl || "").trim();
    validateUsername(username);
    validateAvatar(avatarUrl);

    req.user.username = username;
    req.user.usernameNormalized = username.toLowerCase();
    req.user.avatarUrl = avatarUrl;
    await req.user.save();

    res.json({ success: true, data: { user: publicUser(req.user) } });
  } catch (error) {
    next(formatMongooseError(error));
  }
});

router.patch("/password", requireAuth, async (req, res, next) => {
  try {
    const currentPassword = String(req.body.currentPassword || "");
    const newPassword = String(req.body.newPassword || "");
    const user = await User.findById(req.user._id);

    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      throw createHttpError(401, "Mật khẩu hiện tại không đúng");
    }
    if (newPassword.length <= 8) {
      throw createHttpError(400, "Mật khẩu mới phải dài hơn 8 ký tự");
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.refreshTokenHash = null;
    user.refreshTokenExpiresAt = null;
    await user.save();
    clearRefreshCookie(res);

    res.json({ success: true, data: { passwordChanged: true } });
  } catch (error) {
    next(error);
  }
});

function validateCredentials(email, password) {
  if (!emailRegex.test(email)) {
    throw createHttpError(400, "Email không đúng định dạng");
  }

  if (password.length <= 8) {
    throw createHttpError(400, "Mật khẩu phải dài hơn 8 ký tự");
  }
}

function normalizeUsername(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function validateUsername(username) {
  if (username.length < 3 || username.length > 30) {
    throw createHttpError(400, "Username phải có từ 3 đến 30 ký tự");
  }
}

function validateAvatar(avatarUrl) {
  if (!avatarUrl) return;
  const validUrl = /^https:\/\//i.test(avatarUrl);
  const validImage = /^data:image\/(png|jpe?g|webp);base64,/i.test(avatarUrl);
  if ((!validUrl && !validImage) || avatarUrl.length > 700000) {
    throw createHttpError(400, "Avatar không hợp lệ hoặc vượt quá 500 KB");
  }
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function buildVerificationUrl(token) {
  const frontendUrl = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || "http://localhost:3000";
  return `${frontendUrl.replace(/\/$/, "")}/verify-email?token=${token}`;
}

function buildResetUrl(token) {
  const frontendUrl = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || "http://localhost:3000";
  return `${frontendUrl.replace(/\/$/, "")}/reset-password?token=${token}`;
}

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );
}

async function issueRefreshToken(res, user, rememberLogin) {
  const token = jwt.sign(
    { sub: user._id.toString(), type: "refresh", rememberLogin },
    getRefreshSecret(),
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d" }
  );
  user.refreshTokenHash = hashToken(token);
  user.refreshTokenExpiresAt = new Date(Date.now() + refreshTtlMs);
  await user.save();

  res.cookie("ai_gym_refresh_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/api/auth",
    ...(rememberLogin ? { maxAge: refreshTtlMs } : {}),
  });
}

function clearRefreshCookie(res) {
  res.clearCookie("ai_gym_refresh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/api/auth",
  });
}

function getRefreshSecret() {
  return process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
}

function getCookie(req, name) {
  const cookies = String(req.headers.cookie || "").split(";");
  const match = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));
  return match ? decodeURIComponent(match.trim().slice(name.length + 1)) : "";
}

function publicUser(user) {
  return {
    id: user._id,
    email: user.email,
    username: user.username || user.email.split("@")[0],
    avatarUrl: user.avatarUrl || "",
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

function formatMongooseError(error) {
  if (error.code === 11000) {
    return createHttpError(
      409,
      error.keyPattern?.email ? "Email đã được đăng ký" : "Username đã được sử dụng"
    );
  }
  if (error.name === "ValidationError") {
    const details = Object.values(error.errors).map((item) => item.message);
    return createHttpError(400, "Invalid auth payload", details);
  }

  return error;
}

export default router;
