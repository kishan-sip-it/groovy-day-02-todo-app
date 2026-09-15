let nextId = 3;

let todos = [
  { id: 1, text: "Explore the Day 2 project", completed: true },
  { id: 2, text: "Build the TODO workflow", completed: false }
];

export function listTodos() {
  return todos;
}

export function createTodo(text) {
  const todo = {
    id: nextId++,
    text,
    completed: false
  };

  todos.push(todo);
  return todo;
}

export function updateTodo(id, changes) {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return null;

  todos[index] = {
    ...todos[index],
    ...changes
  };

  return todos[index];
}

export function deleteTodo(id) {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return false;

  todos.splice(index, 1);
  return true;
}
