import bcrypt from "bcryptjs";
import crypto from "crypto";
import express from "express";
import jwt from "jsonwebtoken";

import { requireAuth } from "../middleware/requireAuth.js";
import User from "../models/User.js";
import { sendVerificationEmail } from "../services/email.service.js";
import { createHttpError } from "../utils/httpError.js";

const router = express.Router();
const emailRegex = /^\S+@\S+\.\S+$/;
const verificationTtlMs = 10 * 60 * 1000;

router.post("/register", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    validateCredentials(email, password);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw createHttpError(409, "Email đã được đăng ký");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = await User.create({
      email,
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

router.post("/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

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

    res.json({
      success: true,
      data: {
        token: signToken(user),
        user: publicUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

function validateCredentials(email, password) {
  if (!emailRegex.test(email)) {
    throw createHttpError(400, "Email không đúng định dạng");
  }

  if (password.length <= 8) {
    throw createHttpError(400, "Mật khẩu phải dài hơn 8 ký tự");
  }
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function buildVerificationUrl(token) {
  const frontendUrl = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || "http://localhost:3000";
  return `${frontendUrl.replace(/\/$/, "")}/verify-email?token=${token}`;
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    email: user.email,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

function formatMongooseError(error) {
  if (error.name === "ValidationError") {
    const details = Object.values(error.errors).map((item) => item.message);
    return createHttpError(400, "Invalid auth payload", details);
  }

  return error;
}

export default router;
