import { useEffect, useMemo, useState } from "react";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "./api.js";

const COLUMNS = [
  { id: "Pending", label: "To Do", color: "#a855f7", icon: "📌" },
  { id: "InProgress", label: "In Progress", color: "#f59e0b", icon: "⚡" },
  { id: "Completed", label: "Done", color: "#22c55e", icon: "✅" }
];

const PRIORITY = {
  High: { color: "#ef4444", bg: "rgba(239,68,68,.15)" },
  Medium: { color: "#f59e0b", bg: "rgba(245,158,11,.15)" },
  Low: { color: "#22c55e", bg: "rgba(34,197,94,.15)" }
};

const DEFAULT_FORM = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
  assignee: "Kishan"
};

function Toast({ message, type = "success" }) {
  if (!message) return null;
  return <div className={`toast toast-${type}`}>{message}</div>;
}

function Navbar({ page, setPage }) {
  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "kanban", icon: "🗂️", label: "Board" },
    { id: "profile", icon: "👤", label: "Profile" }
  ];

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="brand">TaskFlow<span>Pro</span></div>
        <div className="nav-items">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-btn ${page === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="nav-user">👋 Kishan</div>
    </nav>
  );
}

function TaskModal({ task, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(task ? { ...DEFAULT_FORM, ...task, title: task.title || task.text || "" } : DEFAULT_FORM);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isNew = !task;

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function save() {
    if (!form.title.trim()) return;
    onSave({
      ...form,
      title: form.title.trim(),
      text: form.title.trim(),
      completed: form.status === "Completed"
    });
    onClose();
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <h2>{isNew ? "New Task" : "Edit Task"}</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <label>Title<input value={form.title} onChange={(e) => setField("title", e.target.value)} autoFocus /></label>
          <label>Assignee<input value={form.assignee} onChange={(e) => setField("assignee", e.target.value)} /></label>
          <label>Due date<input type="date" value={form.dueDate || ""} onChange={(e) => setField("dueDate", e.target.value)} /></label>
          <label>Description<textarea rows="4" value={form.description} onChange={(e) => setField("description", e.target.value)} /></label>

          <div className="field-grid">
            <label>Priority
              <select value={form.priority} onChange={(e) => setField("priority", e.target.value)}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </label>
            <label>Status
              <select value={form.status} onChange={(e) => setField("status", e.target.value)}>
                <option value="Pending">To Do</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Done</option>
              </select>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <div>
            {!isNew && !confirmDelete && <button className="danger-btn" onClick={() => setConfirmDelete(true)}>Delete</button>}
            {!isNew && confirmDelete && (
              <div className="confirm-row">
                <span>Sure?</span>
                <button className="danger-btn solid" onClick={() => { onDelete(task.id); onClose(); }}>Yes</button>
                <button className="ghost-btn" onClick={() => setConfirmDelete(false)}>No</button>
              </div>
            )}
          </div>
          <div className="footer-actions">
            <button className="ghost-btn" onClick={onClose}>Cancel</button>
            <button className="primary-btn" onClick={save}>{isNew ? "Create" : "Save"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, onEdit, onDragStart }) {
  const priority = PRIORITY[task.priority] || PRIORITY.Medium;

  return (
    <article
      className="task-card"
      draggable
      onDragStart={() => onDragStart(task)}
      onClick={() => onEdit(task)}
      title="Drag to move or click to edit"
    >
      <div className="task-card-top">
        <h3>{task.text}</h3>
        <span className="priority-chip" style={{ color: priority.color, background: priority.bg }}>{task.priority}</span>
      </div>
      {task.description && <p>{task.description}</p>}
      <div className="task-meta">
        <div className="avatar">{(task.assignee || "K")[0].toUpperCase()}</div>
        <span>{task.assignee || "Kishan"}</span>
        {task.dueDate && <span className="due">📅 {task.dueDate.slice(0, 10)}</span>}
      </div>
    </article>
  );
}

function KanbanBoard({ tasks, onCreate, onUpdate, onDelete, setToast }) {
  const [dragTask, setDragTask] = useState(null);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(search.toLowerCase()) &&
    (priorityFilter === "All" || task.priority === priorityFilter)
  );

  async function saveTask(data) {
    try {
      const updated = editing ? await onUpdate(editing.id, data) : await onCreate(data);
      setEditing(null);
      setToast(editing ? "Task updated!" : "Task created!");
      return updated;
    } catch (error) {
      setToast(error.message, "error");
      return null;
    }
  }

  async function moveTask(status) {
    if (!dragTask || dragTask.status === status) return;
    try {
      await onUpdate(dragTask.id, { ...dragTask, status, completed: status === "Completed" });
      setToast(`Moved to ${COLUMNS.find((column) => column.id === status)?.label}`);
    } catch (error) {
      setToast(error.message, "error");
    } finally {
      setDragTask(null);
    }
  }

  return (
    <div className="content-shell">
      <div className="page-head">
        <div>
          <h1>Kanban Board</h1>
          <p>Drag & drop tasks between stages. Changes are saved to the Node API.</p>
        </div>
        <div className="board-actions">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option>All</option><option>High</option><option>Medium</option><option>Low</option>
          </select>
          <button className="primary-btn" onClick={() => setEditing(null) || setEditing({})}>+ New Task</button>
        </div>
      </div>

      <div className="kanban-board">
        {COLUMNS.map((column) => {
          const columnTasks = filteredTasks.filter((task) => task.status === column.id);
          return (
            <section
              className="kanban-column"
              key={column.id}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => moveTask(column.id)}
            >
              <div className="column-head" style={{ borderColor: `${column.color}55` }}>
                <div><span>{column.icon}</span><strong>{column.label}</strong><small style={{ color: column.color }}>{columnTasks.length}</small></div>
                <button className="icon-btn" onClick={() => setEditing({ status: column.id })}>+</button>
              </div>
              <div className="column-body">
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={setEditing} onDragStart={setDragTask} />
                ))}
                {columnTasks.length === 0 && <div className="drop-placeholder">Drop here</div>}
              </div>
            </section>
          );
        })}
      </div>

      {editing !== null && (
        <TaskModal
          task={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSave={saveTask}
          onDelete={async (id) => {
            try {
              await onDelete(id);
              setToast("Task deleted!", "info");
            } catch (error) {
              setToast(error.message, "error");
            }
          }}
        />
      )}
    </div>
  );
}

function Dashboard({ tasks, setPage }) {
  const done = tasks.filter((task) => task.status === "Completed").length;
  const inProgress = tasks.filter((task) => task.status === "InProgress").length;
  const todo = tasks.filter((task) => task.status === "Pending").length;
  const rate = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const stats = [
    ["Total Tasks", tasks.length, "📋", "#a855f7"],
    ["Completed", done, "✅", "#22c55e"],
    ["In Progress", inProgress, "⚡", "#f59e0b"],
    ["Completion Rate", `${rate}%`, "📈", "#3b82f6"]
  ];

  return (
    <div className="content-shell">
      <div className="page-head">
        <div><h1>Dashboard</h1><p>TaskFlowPro-style overview for your React + Node workspace.</p></div>
        <button className="primary-btn" onClick={() => setPage("kanban")}>Open Board</button>
      </div>

      <div className="stats-grid">
        {stats.map(([label, value, icon, color]) => (
          <div className="stat-card" key={label}>
            <span className="stat-icon">{icon}</span>
            <div className="stat-label">{label.toUpperCase()}</div>
            <div className="stat-value" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel activity-panel">
          <div className="panel-title">Weekly Activity</div>
          <div className="bars">
            {[3, 5, 2, 4, 6, 1, 2].map((value, index) => (
              <div className="bar-wrap" key={index}>
                <div className="bar created" style={{ height: `${value * 22}px` }} />
                <div className="bar completed" style={{ height: `${Math.max(18, (value - 1) * 19)}px` }} />
                <span>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</span>
              </div>
            ))}
          </div>
          <div className="legend"><span><i className="legend-dot purple" />Created</span><span><i className="legend-dot green" />Completed</span></div>
        </section>

        <section className="panel breakdown-panel">
          <div className="panel-title">Task Breakdown</div>
          <div className="breakdown-ring" style={{ background: `conic-gradient(#22c55e ${rate}%, #f59e0b ${rate}% ${Math.min(rate + (tasks.length ? (inProgress / tasks.length) * 100 : 0), 100)}%, #a855f7 0)` }}>
            <div><strong>{rate}%</strong><span>complete</span></div>
          </div>
          <div className="breakdown-list"><span><i className="legend-dot green" />Done ({done})</span><span><i className="legend-dot amber" />In Progress ({inProgress})</span><span><i className="legend-dot purple" />To Do ({todo})</span></div>
        </section>
      </div>

      <section className="panel recent-panel">
        <div className="panel-title">Recent Tasks</div>
        {tasks.slice(-6).reverse().map((task) => {
          const p = PRIORITY[task.priority] || PRIORITY.Medium;
          return <div className="recent-row" key={task.id}><div><i className="status-dot" style={{ background: task.status === "Completed" ? "#22c55e" : task.status === "InProgress" ? "#f59e0b" : "#a855f7" }} />{task.text}</div><span className="priority-chip" style={{ color: p.color, background: p.bg }}>{task.priority}</span></div>;
        })}
        {!tasks.length && <div className="empty">No tasks yet. Open the Board to create your first task.</div>}
      </section>
    </div>
  );
}

function Profile({ tasks }) {
  const done = tasks.filter((task) => task.status === "Completed").length;
  const inProgress = tasks.filter((task) => task.status === "InProgress").length;
  return (
    <div className="content-shell profile-shell">
      <h1>Profile</h1>
      <section className="panel profile-card">
        <div className="profile-top">
          <div className="profile-avatar">K</div>
          <div><h2>Kishan Marwadi</h2><p>AI-First Engineer Trainee</p><span>React + Node.js</span></div>
        </div>
        <div className="profile-stats"><div><strong>{tasks.length}</strong><span>Total Tasks</span></div><div><strong>{done}</strong><span>Completed</span></div><div><strong>{inProgress}</strong><span>In Progress</span></div><div><strong>{tasks.length ? `${Math.round(done / tasks.length * 100)}%` : "0%"}</strong><span>Rate</span></div></div>
      </section>
      <section className="panel">
        <div className="panel-title">Day 2 Stack</div>
        <div className="stack-grid"><span>React</span><span>Node.js</span><span>Express</span><span>Vite</span><span>REST API</span><span>In-memory state</span></div>
      </section>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToastState] = useState({ message: "", type: "success" });
  const toastTimer = useMemo(() => ({ current: null }), []);

  function setToast(message, type = "success") {
    setToastState({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState({ message: "", type: "success" }), 2800);
  }

  async function load() {
    try {
      setLoading(true);
      setTasks(await fetchTodos());
    } catch (error) {
      setToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createTask(task) {
    const created = await createTodo(task);
    setTasks((current) => [...current, created]);
    return created;
  }

  async function updateTask(id, changes) {
    const updated = await updateTodo(id, changes);
    setTasks((current) => current.map((task) => task.id === updated.id ? updated : task));
    return updated;
  }

  async function removeTask(id) {
    await deleteTodo(id);
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <div className="app-shell">
      <Navbar page={page} setPage={setPage} />
      {loading ? <div className="loading-screen">Loading TaskFlowPro...</div> : (
        <>
          {page === "dashboard" && <Dashboard tasks={tasks} setPage={setPage} />}
          {page === "kanban" && <KanbanBoard tasks={tasks} onCreate={createTask} onUpdate={updateTask} onDelete={removeTask} setToast={setToast} />}
          {page === "profile" && <Profile tasks={tasks} />}
        </>
      )}
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}
