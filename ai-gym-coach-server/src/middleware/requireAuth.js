import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { createHttpError } from "../utils/httpError.js";

async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      throw createHttpError(401, "Authentication required");
    }

    const payload = jwt.verify(token, getJwtSecret());
    const user = await User.findById(payload.sub).select(
      "-passwordHash -refreshTokenHash -refreshTokenExpiresAt -emailVerificationTokenHash -emailVerificationExpiresAt"
    );

    if (!user) {
      throw createHttpError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : createHttpError(401, "Invalid token"));
  }
}

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw createHttpError(500, "JWT_SECRET is not configured");
  }

  return process.env.JWT_SECRET;
}

export { getJwtSecret, requireAuth };
