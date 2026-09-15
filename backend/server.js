import express from "express";
import todosRouter from "./todos.js";

const app = express();
const PORT = 4000;

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "todo-api" });
});

app.use("/api/todos", todosRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`TODO API running at http://localhost:${PORT}`);
});
