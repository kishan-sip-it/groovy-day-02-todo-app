import express from "express";
import { createTodo, deleteTodo, listTodos, updateTodo } from "./store.js";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(listTodos());
});

router.post("/", (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";

  if (!text) {
    return res.status(400).json({ error: "Todo text is required." });
  }

  return res.status(201).json(createTodo(text));
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Todo id must be an integer." });
  }

  const changes = {};

  if (typeof req.body?.text === "string") {
    const text = req.body.text.trim();
    if (!text) return res.status(400).json({ error: "Todo text cannot be empty." });
    changes.text = text;
  }

  if (typeof req.body?.completed === "boolean") {
    changes.completed = req.body.completed;
  }

  if (Object.keys(changes).length === 0) {
    return res.status(400).json({ error: "Provide text or completed to update." });
  }

  const todo = updateTodo(id, changes);
  if (!todo) return res.status(404).json({ error: "Todo not found." });

  return res.json(todo);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Todo id must be an integer." });
  }

  if (!deleteTodo(id)) {
    return res.status(404).json({ error: "Todo not found." });
  }

  return res.status(204).send();
});

export default router;
