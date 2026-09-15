# Groovy Day 02 — TODO App

> **READ THIS FIRST:** This repository is the Day 2 runnable application. Use this README for install, run, verification, and feature navigation.

Day 2 of the AI-First Engineer journey.

## Goal
Build a runnable TODO application using React + Node from prompts only.

## Day 2 UI

The UI is intentionally modeled after the visual language of the existing `taskflow-dotnet` project: dark TaskFlowPro-style workspace, top navigation, dashboard, Kanban board, task cards, priorities, task modal, profile view, and drag-and-drop status movement — rebuilt for the required React + Node.js stack.

## Extra engineering feature — Keyboard-first command palette

Press **Ctrl/⌘ + K** to open the Quick Actions palette. It provides keyboard-first navigation for Dashboard, Board, Profile, and New Task. You can also use `D`, `B`, `N`, and `P` when you are not typing in a form field.

This makes the app faster to operate and demonstrates an interaction pattern useful in real productivity software.

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
    commandPalette.js
    main.jsx
    styles.css

package.json
README.md
PROMPTS.md
.gitignore
```

The backend uses simple in-memory storage. No database is used.

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

### Prompt 4 — UI transformation and Kanban expansion

```text
Transform the Day 2 TODO app into a TaskFlowPro-style workspace while keeping the required React + Node.js stack.

Use the existing taskflow-dotnet project as the visual reference, but rebuild the implementation for this repository.

Add:
- dark TaskFlowPro-style visual language
- Dashboard view with task statistics and activity breakdown
- Kanban Board view with To Do, In Progress, and Done columns
- drag-and-drop movement between columns
- task cards with priority, assignee, description, and due date
- search and priority filtering
- create/edit task modal
- delete confirmation
- Profile view
- toast feedback
- REST API support for the expanded task model

Keep the backend in-memory and keep the application runnable with the existing React + Node architecture.
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

1. Load the dashboard.
2. Open the Board.
3. Confirm starter tasks appear in the correct columns.
4. Create a task.
5. Edit a task.
6. Drag a task between To Do, In Progress, and Done.
7. Change priority, assignee, description, and due date.
8. Search and filter tasks.
9. Delete a task.
10. Press **Ctrl/⌘ + K** and verify the command palette opens.
11. Verify `D`, `B`, `N`, and `P` work outside input fields.
12. Confirm the backend health endpoint returns an OK response.
13. Refresh the application and confirm it starts correctly.
14. Push the final verified state to GitHub.

## AI Review Notes

- What AI did well: _To be filled after senior review._
- What AI failed at: _To be filled after senior review._
