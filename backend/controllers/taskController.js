import asyncHandler from "express-async-handler";
import Task from "../models/Task.js";

// GET /api/tasks
export const getTasks = asyncHandler(async (req, res) => {
  // optionally support query params like ?status=todo
  const q = {};
  if (req.query.status) q.status = req.query.status;
  const tasks = await Task.find(q).sort({ createdAt: -1 });
  res.json(tasks);
});

// POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignee, priority, status } = req.body;
  if (!title) return res.status(400).json({ message: "Title required" });
  const task = await Task.create({
    title,
    description,
    assignee,
    priority,
    status,
  });
  res.status(201).json(task);
});

// PUT /api/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const task = await Task.findByIdAndUpdate(id, payload, { new: true });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

// DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.status(204).send();
});
