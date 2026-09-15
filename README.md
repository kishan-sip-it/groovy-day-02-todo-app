# Groovy Day 02 — TODO App

Day 2 of the AI-First Engineer journey.

## Goal
Build a runnable TODO application using React + Node from prompts only.

## Project Structure

```text
backend/
  package.json
  server.js
  store.js
  todos.js

frontend/
  package.json
  index.html
  vite.config.js
  src/
    api.js
    App.jsx
    main.jsx
    styles.css

package.json
README.md
PROMPTS.md
.gitignore
```

The backend uses simple in-memory storage as required for this exercise. No database is used.

## AI Prompt Log

### Prompt 1 — Initial implementation (Cline)

```text
You are my AI coding assistant for Day 2 of an AI-First Engineer journey.

Build a complete, runnable TODO application in this repository using:
- Frontend: React
- Backend: Node.js with Express

Requirements:
1. Keep the frontend and backend clearly separated.
2. Implement TODO CRUD operations: create, read, update/toggle, and delete.
3. Use a clean, simple UI where I can add a TODO, see all TODOs, mark a TODO complete/incomplete, and delete a TODO.
4. Connect the React frontend to the Node/Express backend through a small REST API.
5. Include sensible loading, empty-state, and error-state handling.
6. Use a minimal dependency set and follow normal project conventions.
7. Add clear scripts so the frontend and backend can be run easily from the repository.
8. Do not use a database for this Day 2 exercise; simple server-side in-memory storage is sufficient.
9. Do not modify or remove the existing README prompt log except to add useful running/documentation information after the implementation is complete.
10. After implementation, run the relevant install/build/run checks and fix any issues you find.
11. Report exactly what you created, how to run it, and the verification results.

Do not just describe the code. Actually create the files and implement the application.
```

### Prompt 2 — Verification / correction

```text
Inspect the current Day 2 TODO application as a reviewer.

Verify that:
- React and Node/Express are clearly separated.
- The REST API supports create, read, update/toggle, and delete.
- The React UI can create, display, toggle, and delete TODOs.
- Loading, empty, and error states exist.
- The Vite development proxy routes /api requests to the Node backend.
- The project scripts are clear enough for a fresh clone to run.

Identify and correct any implementation issue you find without adding a database or unnecessary dependencies.
Then report the exact changes and the verification commands that should be run locally.
```

### Prompt 3 — Final review / polish

```text
Perform a final engineering review of the Day 2 TODO application.

Check for:
- obvious runtime or build issues
- broken imports or paths
- inconsistent API behavior
- accessibility issues in the UI
- unnecessary complexity
- unclear README instructions

Make only necessary corrections. Keep the implementation simple and aligned with the Day 2 React + Node requirement.
Return a concise final checklist of what is ready and what must still be verified locally.
```

## Running the Project

From the root of this repository:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
npm run dev
```

The application should then be available at:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:4000/api/health`

The Vite development server proxies `/api` requests to the Node backend.

## Required Day 2 Verification

Test the full TODO flow in the browser:

1. Load the application.
2. Confirm the starter TODOs appear.
3. Add a new TODO.
4. Mark a TODO complete and incomplete.
5. Delete a TODO.
6. Refresh the page and confirm the app still starts correctly.
7. Confirm the backend health endpoint returns an OK response.

## AI Review Notes

- What AI did well: _To be filled after senior review._
- What AI failed at: _To be filled after senior review._
