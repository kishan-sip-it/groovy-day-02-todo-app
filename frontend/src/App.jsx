import { useEffect, useMemo, useState } from "react";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "./api.js";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadTodos() {
    try {
      setError("");
      setLoading(true);
      setTodos(await fetchTodos());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  const remaining = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    try {
      setError("");
      setSaving(true);
      const todo = await createTodo(text);
      setTodos((current) => [...current, todo]);
      setInput("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(todo) {
    try {
      setError("");
      const updated = await updateTodo(todo.id, {
        completed: !todo.completed
      });
      setTodos((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      setError("");
      await deleteTodo(id);
      setTodos((current) => current.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page-shell">
      <section className="todo-card">
        <header className="hero">
          <p className="eyebrow">GROOVY WEB · DAY 02</p>
          <h1>TODO, built with React + Node.</h1>
          <p className="subtitle">
            A prompt-driven CRUD (Create, Read, Update, Delete) exercise.
          </p>
        </header>

        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="What needs to be done?"
            aria-label="New todo"
          />
          <button type="submit" disabled={saving || !input.trim()}>
            {saving ? "Adding…" : "Add TODO"}
          </button>
        </form>

        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        <div className="summary-row">
          <span>{remaining} remaining</span>
          <span>{todos.length} total</span>
        </div>

        {loading ? (
          <div className="state">Loading TODOs…</div>
        ) : todos.length === 0 ? (
          <div className="state">No TODOs yet. Add your first one above.</div>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                className={`todo-item ${todo.completed ? "completed" : ""}`}
                key={todo.id}
              >
                <button
                  type="button"
                  className="check-button"
                  onClick={() => handleToggle(todo)}
                  aria-label={
                    todo.completed
                      ? `Mark ${todo.text} incomplete`
                      : `Mark ${todo.text} complete`
                  }
                >
                  {todo.completed ? "✓" : ""}
                </button>
                <span className="todo-text">{todo.text}</span>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(todo.id)}
                  aria-label={`Delete ${todo.text}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
