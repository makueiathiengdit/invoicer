# Invoicer

web app for managing invoices

Invoices are recorded with their attachment, assigned to a processor, given PR
and PO numbers as procurement moves them along, and then paid down as receipts
come in until the balance clears.

## Architecture

```
frontend/   next.js app — pages and forms only, no database access
backend/    express + mongoose rest api — owns the database
```

The frontend used to reach MongoDB directly through Next.js server actions.
That layer is gone: everything now goes over HTTP to the Express API in
`backend/`, so the two halves can be run, deployed and debugged separately.

- Client components call the API through `frontend/src/lib/api-client.js`.
- Server components call it through `frontend/src/lib/api-server.js`, which
  forwards the session token as a bearer header.
- `frontend/src/proxy.js` gates protected routes by reading the session cookie.

## Running it

MongoDB needs to be up first, then:

```bash
# terminal 1 — api on :8000
cd backend
npm install
cp .env.example .env   # then set JWT_SECRET
npm run dev

# terminal 2 — app on :3000
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000 and sign in. New accounts can be created at
`/i/users/create`.

Keep both on the same hostname (`localhost`, not `127.0.0.1`) — the session is a
cookie, and cookies are scoped by host, so mixing the two silently drops it.

See `backend/README.md` for the endpoint list and response shape.
