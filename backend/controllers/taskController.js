import asyncHandler from "express-async-handler";
import Task from "../models/Task.js";
import mongoose from "mongoose";

// GET /api/tasks
export const getTasks = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  console.log("getTasks -> req.user =", req.user?._id?.toString());

  const q = { user: req.user._id };
  if (req.query.status) q.status = req.query.status;

  const tasks = await Task.find(q).sort({ createdAt: -1 });
  res.json(tasks);
});

// POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  console.log(
    "createTask -> req.user =",
    req.user?._id?.toString(),
    "title=",
    req.body?.title
  );

  const { title, description, assignee, priority, status } = req.body;
  if (!title) return res.status(400).json({ message: "Title required" });

  const task = await Task.create({
    title,
    description,
    assignee,
    priority,
    status,
    user: req.user._id,
  });

  res.status(201).json(task);
});

// PUT /api/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid task id" });

  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (String(task.user) !== String(req.user._id))
    return res
      .status(403)
      .json({ message: "Not authorized to update this task" });

  const payload = req.body;
  const updated = await Task.findByIdAndUpdate(id, payload, { new: true });
  res.json(updated);
});

// DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid task id" });

  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (String(task.user) !== String(req.user._id))
    return res
      .status(403)
      .json({ message: "Not authorized to delete this task" });

  await Task.findByIdAndDelete(id);
  res.status(204).send();
});
