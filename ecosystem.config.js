/*
  pm2 process definitions for both halves of Invoicer.

    pm2 start ecosystem.config.js               # production
    pm2 start ecosystem.config.js --env development
    pm2 logs / pm2 restart all / pm2 delete all

  build both apps before the first start:

    cd backend  && npm ci
    cd frontend && npm ci && npm run build

  secrets (JWT_SECRET, MONGO_DB_URL) belong in backend/.env, which is
  gitignored — not in this file. values set here win over .env, because dotenv
  never overwrites a variable pm2 has already put in the environment.

  NOTE: NEXT_PUBLIC_API_BASE_URL is inlined into the browser bundle by
  `next build`, so setting it here does nothing. It has to be in frontend/.env
  *before* you build. Only API_BASE_URL (used by server components at runtime)
  can be set from pm2.
*/

const BACKEND_PORT = 5100;
const FRONTEND_PORT = 3100;

// the api and the app must share a hostname or the session cookie is dropped
const HOST = "localhost";
const API_URL = `http://${HOST}:${BACKEND_PORT}`;
const APP_URL = `http://${HOST}:${FRONTEND_PORT}`;

module.exports = {
  apps: [
    {
      name: "invoicer-api",
      cwd: "./backend",
      script: "src/server.js",
      instances: 1,
      exec_mode: "fork",

      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 2000,
      max_memory_restart: "400M",

      // node_modules churn should never bounce a running process
      watch: false,

      time: true,
      merge_logs: true,
      out_file: "./logs/api.out.log",
      error_file: "./logs/api.err.log",

      env: {
        NODE_ENV: "production",
        PORT: BACKEND_PORT,
        CORS_ORIGINS: APP_URL,
        // plain http deploy — drop this once the app is served over https
        COOKIE_SECURE: "false",
      },

      env_development: {
        NODE_ENV: "development",
        PORT: BACKEND_PORT,
        CORS_ORIGINS: APP_URL,
        COOKIE_SECURE: "false",
      },
    },

    {
      name: "invoicer-web",
      cwd: "./frontend",
      // drive the next binary directly so pm2 signals the real process
      script: "./node_modules/next/dist/bin/next",
      args: `start -p ${FRONTEND_PORT}`,
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",

      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 2000,
      max_memory_restart: "600M",

      watch: false,

      time: true,
      merge_logs: true,
      out_file: "./logs/web.out.log",
      error_file: "./logs/web.err.log",

      env: {
        NODE_ENV: "production",
        PORT: FRONTEND_PORT,
        // read at runtime by server components; safe to set from here
        API_BASE_URL: API_URL,
      },

      env_development: {
        NODE_ENV: "development",
        PORT: FRONTEND_PORT,
        API_BASE_URL: API_URL,
      },
    },
  ],

  /*
    `pm2 deploy production setup` then `pm2 deploy production` from a machine
    with ssh access to the server. fill in host/user/path first, and uncomment.

  deploy: {
    production: {
      user: "deploy",
      host: ["your-server-hostname"],
      ref: "origin/main",
      repo: "https://github.com/makueiathiengdit/invoicer.git",
      path: "/var/www/invoicer",
      "post-deploy": [
        "cd backend && npm ci --omit=dev",
        "cd ../frontend && npm ci && npm run build",
        "cd .. && pm2 startOrReload ecosystem.config.js --env production",
        "pm2 save",
      ].join(" && "),
    },
  },
  */
};
