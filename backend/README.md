# Invoicer API

Express + Mongoose REST API behind the Invoicer frontend. It replaces the
Next.js server actions the app used to call, and owns all database access.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then set JWT_SECRET
npm run dev            # http://localhost:8000
```

MongoDB has to be reachable at `LOCAL_DB_URL` (`MONGO_DB_URL` when
`NODE_ENV=production`).

## Layout

```
src/
  app.js            express app: cors, json, cookies, routes
  server.js         connects to mongo, then listens
  config/env.js     env parsing, fails fast on a missing secret
  constants/        user roles and invoice statuses
  db/               mongoose connection and models
  middleware/       auth (attach/require) and the error handler
  routes/           one router per resource
  schemas/          zod request schemas
  services/         the actual business logic
  utils/            response envelope and validation helpers
```

## Responses

Every JSON endpoint answers with the same envelope:

```json
{ "success": true, "message": "found invoices", "data": [], "errors": {} }
```

`errors` is a `{ field: message }` map on a 422, which is the shape the forms
render directly. `GET /api/attachments/:id` is the one exception — it streams
the stored file itself.

## Auth

`POST /api/auth/login` signs a JWT and returns it two ways: in the body, and as
an httpOnly `token` cookie. Later requests may present either the cookie or an
`Authorization: Bearer <token>` header — the frontend's server components use
the header because a server-side fetch has no cookie jar of its own.

Cookies are scoped by host and ignore the port, so **the API and the app must
share a hostname**. `localhost:8000` and `localhost:3000` share the session;
`127.0.0.1:8000` and `localhost:3000` do not. Serving them from different
domains in production means switching the cookie to `SameSite=none; Secure`.

## Endpoints

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/health` | – | liveness probe |
| POST | `/api/auth/login` | – | sets the session cookie |
| POST | `/api/auth/logout` | – | clears it |
| GET | `/api/auth/me` | yes | current token payload |
| POST | `/api/users` | – | sign up; only an admin may set `role` |
| GET | `/api/users` | yes | `?role=PROCESSOR` to filter |
| GET | `/api/users/:id` | yes | |
| POST | `/api/invoices` | yes | attachment posted as base64 |
| GET | `/api/invoices` | yes | `?status=` / `?assigned_to=` |
| GET | `/api/invoices/:id` | yes | attachment + assignee populated |
| GET | `/api/invoices/po/:po_number` | yes | |
| PATCH | `/api/invoices/:id/prpo` | yes | setting a PR/PO advances the status |
| POST | `/api/received-invoices` | yes | pays down the invoice matched on PO |
| GET | `/api/received-invoices` | yes | |
| GET | `/api/received-invoices/po/:po_number` | yes | |
| GET | `/api/attachments/:id` | yes | streams the file |

New invoices are assigned round robin across users with the `PROCESSOR` role;
without one, creation is refused with a 409.

Receiving an invoice adds to `amount_paid` and flips the invoice to `COMPLETED`
once the quoted amount is covered. Receiving more than the outstanding balance,
or against an already cleared invoice, is refused with a 409.
