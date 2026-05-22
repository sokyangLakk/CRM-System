# CRM System

A Node.js + TypeScript scaffold for a CRM backend.

## Current Status

This repository is in early setup stage.

- Project structure for core layers is created (`Controllers`, `Services`, `repositories`, `routes`, etc.)
- Most source files are placeholders and still need implementation
- Environment files exist but are empty (`.env`, `.env example`)

## Tech Stack

- Node.js
- TypeScript
- `ts-node`
- `nodemon`
- `dotenv`

## Project Structure

```text
src/
  app.ts
  server.ts
  Config/
    db.ts
  Controllers/
    UserController.ts
  middlewares/
    AuthMiddleware.ts
  migrations/
    001-create-users-table.ts
  Models/
    UserModel.ts
  repositories/
    UserRepository.ts
  routes/
    UserRoutes.ts
  Services/
    UserService.ts
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment config

Fill in `.env` with your local settings (database URL, port, secrets, etc.).

Example keys you may add:

```env
PORT=3000
DATABASE_URL=
JWT_SECRET=
```

### 3. Start development server

No runnable server script is defined yet in `package.json`, so first add scripts, for example:

```json
"scripts": {
  "dev": "nodemon --watch src --exec ts-node src/server.ts",
  "start": "ts-node src/server.ts"
}
```

Then run:

```bash
npm run dev
```

## Suggested Next Steps

1. Implement `src/app.ts` and `src/server.ts` to bootstrap Express and routes.
2. Add TypeScript config (`tsconfig.json`) if you plan to compile with `tsc`.
3. Define database connection in `src/Config/db.ts`.
4. Implement user flow across `Model -> Repository -> Service -> Controller -> Route`.
5. Add request validation, auth middleware, and error handling.
6. Add tests and linting.

## Notes

- In `package.json`, dependency name appears as `epress`; this is likely a typo for `express`.
- `.env example` is present; consider renaming it to `.env.example` for convention and tooling compatibility.

## Repository

- URL: https://github.com/sokyangLakk/CRM-System
