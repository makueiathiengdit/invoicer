import "dotenv/config";

const is_production = process.env.NODE_ENV === "production";

export const config = {
  is_production,
  port: Number(process.env.PORT) || 8000,
  db_url: is_production ? process.env.MONGO_DB_URL : process.env.LOCAL_DB_URL,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "4h",
  /*
    a secure cookie is only sent over https. that is what you want behind a tls
    terminating proxy, but it silently breaks login on a plain http deployment,
    so it can be forced off.
  */
  cookie_secure: process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "true"
    : is_production,
  json_body_limit: process.env.JSON_BODY_LIMIT || "15mb",
  cors_origins: (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

// fail fast instead of signing tokens with an undefined secret
if (!config.jwt_secret) {
  throw new Error("JWT_SECRET is not set. Copy .env.example to .env first.");
}

if (!config.db_url) {
  throw new Error(
    `${is_production ? "MONGO_DB_URL" : "LOCAL_DB_URL"} is not set. Copy .env.example to .env first.`,
  );
}
