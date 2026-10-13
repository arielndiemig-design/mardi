const crypto = require("node:crypto");

const ENV = process.env.NODE_ENV || "development";
const isProduction = ENV === "production";
const SESSION_SECRET =
  process.env.BUNEC_SESSION_SECRET ||
  (isProduction ? null : "dev-bunec-session-secret-change-me");
const SESSION_COOKIE_NAME = "bunec_session";
const SESSION_TTL_MS = 15 * 60 * 1000;
const ADMIN_USERNAME = process.env.BUNEC_ADMIN_USERNAME || "bunec";
const ADMIN_PASSWORD_SALT =
  process.env.BUNEC_ADMIN_PASSWORD_SALT ||
  (isProduction ? null : "bunec-admin-dev-salt");
const DEFAULT_ADMIN_PASSWORD =
  process.env.BUNEC_ADMIN_PASSWORD ||
  (isProduction ? null : "333669");
const ADMIN_PASSWORD_HASH =
  process.env.BUNEC_ADMIN_PASSWORD_HASH ||
  (isProduction
    ? null
    : deriveAdminPasswordHash(DEFAULT_ADMIN_PASSWORD, ADMIN_PASSWORD_SALT));
const loginAttemptStore = new Map();
const csrfTokens = new Map();

if (isProduction && !SESSION_SECRET) {
  throw new Error("BUNEC_SESSION_SECRET doit être défini en production.");
}
if (
  isProduction &&
  (!ADMIN_PASSWORD_SALT || !ADMIN_PASSWORD_HASH)
) {
  throw new Error(
    "BUNEC_ADMIN_PASSWORD_HASH et BUNEC_ADMIN_PASSWORD_SALT doivent être définis en production.",
  );
}

const RATE_LIMIT_MAX_REQUESTS = Number(
  process.env.RATE_LIMIT_MAX_REQUESTS || 120,
);
const RATE_LIMIT_WINDOW_MS = Number(
  process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
);
const rateLimitStore = new Map();

function deriveAdminPasswordHash(password, salt) {
  return crypto
    .pbkdf2Sync(
      String(password || ""),
      String(salt || ""),
      220000,
      32,
      "sha256",
    )
    .toString("hex");
}

function stripSensitiveText(value) {
  return String(value || "")
    .replace(/[\r\n<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 255);
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

function checkRateLimit(req, res) {
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = rateLimitStore.get(ip) || { count: 0, firstSeen: now };

  if (now - entry.firstSeen > RATE_LIMIT_WINDOW_MS) {
    entry.count = 0;
    entry.firstSeen = now;
  }

  entry.count += 1;
  rateLimitStore.set(ip, entry);

  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    res.writeHead(429, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        success: false,
        error: "Trop de requêtes. Veuillez patienter avant de réessayer.",
      }),
    );
    return true;
  }

  return false;
}

function parseCookies(headerValue = "") {
  return headerValue.split(";").reduce((result, cookie) => {
    const [name, ...rest] = cookie.split("=");
    if (!name) {
      return result;
    }
    result[name.trim()] = rest.join("=").trim();
    return result;
  }, {});
}

function encodeSessionPayload(payload) {
  const payloadString = JSON.stringify(payload);
  const encoded = Buffer.from(payloadString, "utf8").toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadString)
    .digest("hex");
  return `${encoded}.${signature}`;
}

function decodeSessionPayload(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) {
    return null;
  }

  const expected = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(Buffer.from(payloadB64, "base64url").toString("utf8"))
    .digest("hex");
  if (
    !crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(signature, "hex"),
    )
  ) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function issueSession(username) {
  const now = Date.now();
  return encodeSessionPayload({
    username,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  });
}

function requireSession(req, res, next) {
  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies[SESSION_COOKIE_NAME];
  const session = decodeSessionPayload(token);

  if (!session || !session.username || session.expiresAt < Date.now()) {
    res.writeHead(401, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({ success: false, error: "Session invalide ou expirée." }),
    );
    return;
  }

  req.session = { username: session.username };
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || req.session.username !== ADMIN_USERNAME) {
    res.writeHead(403, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        success: false,
        error: "Accès refusé : droits administrateur requis.",
      }),
    );
    return;
  }

  next();
}

function ensureCsrf(req, res, next) {
  if (req.method === "GET" || req.method === "OPTIONS") {
    next();
    return;
  }

  const suppliedToken = req.headers["x-csrf-token"];
  const cookieToken = parseCookies(req.headers.cookie || "")["bunec_csrf"];

  if (!suppliedToken || !cookieToken || suppliedToken !== cookieToken) {
    res.writeHead(403, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ success: false, error: "Jeton CSRF invalide." }));
    return;
  }

  next();
}

function setSessionCookie(res, sessionToken) {
  const secure = isProduction;
  const cookieOptions = [
    `${SESSION_COOKIE_NAME}=${sessionToken}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_TTL_MS / 1000}`,
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  res.setHeader("Set-Cookie", cookieOptions);
}

function issueCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}

function setCsrfCookie(res, token) {
  const secure = isProduction;
  const cookieOptions = [
    `bunec_csrf=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=900",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  res.append("Set-Cookie", cookieOptions);
}

function validateAdminCredentials(username, password) {
  const normalizedUser = stripSensitiveText(username || "").toLowerCase();
  const normalizedPass = String(password || "");

  if (!normalizedUser || !normalizedPass) {
    return false;
  }

  if (normalizedUser !== ADMIN_USERNAME.toLowerCase()) {
    return false;
  }

  const passwordHash = deriveAdminPasswordHash(
    normalizedPass,
    ADMIN_PASSWORD_SALT,
  );
  return crypto.timingSafeEqual(
    Buffer.from(passwordHash, "hex"),
    Buffer.from(ADMIN_PASSWORD_HASH, "hex"),
  );
}

function setSecurityHeaders(res, req) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const isHttps = req.socket.encrypted || forwardedProto === "https";

  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")[0].trim()
      : "http://localhost:3000",
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Bunec-Signature, X-CSRF-Token",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https:${isProduction ? "" : " ws: wss:"}; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';`,
  );

  if (isProduction && isHttps) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }
}

function maskPhoneNumber(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length < 8) {
    return "***";
  }
  const suffix = digits.slice(-4);
  return `+***${suffix}`;
}

function maskIdentifier(value) {
  const clean = String(value || "").replace(/\D/g, "");
  if (!clean) {
    return "***";
  }
  return `***${clean.slice(-4)}`;
}

module.exports = {
  ADMIN_USERNAME,
  checkRateLimit,
  csrfTokens,
  ensureCsrf,
  getClientIp,
  issueCsrfToken,
  issueSession,
  loginAttemptStore,
  maskIdentifier,
  maskPhoneNumber,
  requireAdmin,
  requireSession,
  setCsrfCookie,
  setSecurityHeaders,
  setSessionCookie,
  stripSensitiveText,
  validateAdminCredentials,
};