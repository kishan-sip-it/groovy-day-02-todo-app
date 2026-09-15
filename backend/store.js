let nextId = 4;

let todos = [
  {
    id: 1,
    text: "Explore the Day 2 project",
    completed: true,
    status: "Completed",
    priority: "Low",
    description: "Review the React + Node project structure.",
    assignee: "Kishan",
    dueDate: ""
  },
  {
    id: 2,
    text: "Build the Kanban workflow",
    completed: false,
    status: "InProgress",
    priority: "High",
    description: "Implement drag-and-drop task movement across board columns.",
    assignee: "Kishan",
    dueDate: ""
  },
  {
    id: 3,
    text: "Verify CRUD operations",
    completed: false,
    status: "Pending",
    priority: "Medium",
    description: "Create, edit, complete, move and delete a task.",
    assignee: "Kishan",
    dueDate: ""
  }
];

function normalizeTask(input, fallback = {}) {
  const title = typeof input?.title === "string"
    ? input.title.trim()
    : typeof input?.text === "string"
      ? input.text.trim()
      : fallback.text || "";

  const status = ["Pending", "InProgress", "Completed"].includes(input?.status)
    ? input.status
    : fallback.status || (input?.completed ? "Completed" : "Pending");

  return {
    ...fallback,
    text: title,
    completed: status === "Completed",
    status,
    priority: ["High", "Medium", "Low"].includes(input?.priority)
      ? input.priority
      : fallback.priority || "Medium",
    description: typeof input?.description === "string"
      ? input.description.trim()
      : fallback.description || "",
    assignee: typeof input?.assignee === "string" && input.assignee.trim()
      ? input.assignee.trim()
      : fallback.assignee || "Kishan",
    dueDate: typeof input?.dueDate === "string" ? input.dueDate : fallback.dueDate || ""
  };
}

export function listTodos() {
  return todos;
}

export function createTodo(input) {
  const todo = normalizeTask(input, { id: nextId++ });
  todos.push(todo);
  return todo;
}

export function updateTodo(id, changes) {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return null;

  const current = todos[index];
  todos[index] = {
    ...normalizeTask(changes, current),
    id: current.id
  };

  return todos[index];
}

export function deleteTodo(id) {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return false;

  todos.splice(index, 1);
  return true;
}
