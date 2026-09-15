import express from "express";
import { createTodo, deleteTodo, listTodos, updateTodo } from "./store.js";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(listTodos());
});

router.post("/", (req, res) => {
  const title = typeof req.body?.title === "string"
    ? req.body.title.trim()
    : typeof req.body?.text === "string"
      ? req.body.text.trim()
      : "";

  if (!title) {
    return res.status(400).json({ error: "Task title is required." });
  }

  return res.status(201).json(createTodo({ ...req.body, title }));
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Task id must be an integer." });
  }

  const hasSupportedField = [
    "title",
    "text",
    "completed",
    "status",
    "priority",
    "description",
    "assignee",
    "dueDate"
  ].some((key) => Object.prototype.hasOwnProperty.call(req.body || {}, key));

  if (!hasSupportedField) {
    return res.status(400).json({ error: "Provide at least one task field to update." });
  }

  const changes = { ...req.body };

  if (changes.title !== undefined && typeof changes.title !== "string") {
    return res.status(400).json({ error: "Task title must be a string." });
  }

  if (changes.text !== undefined && typeof changes.text !== "string") {
    return res.status(400).json({ error: "Task text must be a string." });
  }

  if (changes.status !== undefined && !["Pending", "InProgress", "Completed"].includes(changes.status)) {
    return res.status(400).json({ error: "Invalid task status." });
  }

  if (changes.priority !== undefined && !["High", "Medium", "Low"].includes(changes.priority)) {
    return res.status(400).json({ error: "Invalid task priority." });
  }

  const todo = updateTodo(id, changes);
  if (!todo) return res.status(404).json({ error: "Task not found." });

  return res.json(todo);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Task id must be an integer." });
  }

  if (!deleteTodo(id)) {
    return res.status(404).json({ error: "Task not found." });
  }

  return res.status(204).send();
});

export default router;
