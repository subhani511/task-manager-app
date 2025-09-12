// src/components/TaskForm.jsx  (Strong / Bold UI - styling only)
import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function TaskForm({ initial = null, onCancel, onSave }) {
  const reduce = useReducedMotion();

  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [priority, setPriority] = useState(initial?.priority || "medium");
  const [dueDate, setDueDate] = useState(
    initial?.dueDate ? new Date(initial.dueDate).toISOString().slice(0, 16) : ""
  );
  const [assignee, setAssignee] = useState(initial?.assignee || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // keep form in sync if `initial` changes externally
    setTitle(initial?.title || "");
    setDescription(initial?.description || "");
    setPriority(initial?.priority || "medium");
    setDueDate(
      initial?.dueDate
        ? new Date(initial.dueDate).toISOString().slice(0, 16)
        : ""
    );
    setAssignee(initial?.assignee || "");
  }, [initial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // keep payload shape compatible with your backend
      const payload = {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        assignee: assignee || null,
      };
      await onSave(payload); // preserve original semantics (onSave expected to handle create/update)
    } catch (err) {
      setError(err?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const inputFocus =
    "ring-2 ring-offset-1 ring-indigo-400 dark:ring-indigo-500/60 outline-none";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={
        reduce
          ? undefined
          : {
              opacity: 1,
              y: 0,
              transition: { duration: 0.28, ease: "easeOut" },
            }
      }
      className="w-full"
    >
      <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl shadow-2xl">
        <div className="mb-4">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {initial ? "Edit Task" : "New Task"}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Add details and set priority / due date.
          </p>
        </div>

        {/* Title */}
        <label className="block mb-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Title
          </span>
          <motion.input
            whileFocus={reduce ? {} : { scale: 1.01 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Task title"
            className={`mt-2 w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm ${inputFocus}`}
          />
        </label>

        {/* Description */}
        <label className="block mb-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </span>
          <motion.textarea
            whileFocus={reduce ? {} : { scale: 1.01 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the task"
            rows={4}
            className={`mt-2 w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm ${inputFocus}`}
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
          {/* Priority */}
          <label className="block md:col-span-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Priority
            </span>
            <div className="mt-2 flex gap-2">
              <PriorityOption
                value="low"
                selected={priority === "low"}
                onSelect={() => setPriority("low")}
                reduce={reduce}
              />
              <PriorityOption
                value="medium"
                selected={priority === "medium"}
                onSelect={() => setPriority("medium")}
                reduce={reduce}
              />
              <PriorityOption
                value="high"
                selected={priority === "high"}
                onSelect={() => setPriority("high")}
                reduce={reduce}
              />
            </div>
          </label>

          {/* Due date */}
          <label className="block md:col-span-1 md:max-w-[180px]">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Due (optional)
            </span>
            <motion.input
              whileFocus={reduce ? {} : { scale: 1.01 }}
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`mt-2 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm ${inputFocus}`}
            />
          </label>

          {/* Assignee */}
          <label className="block md:col-span-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Assignee
            </span>
            <motion.input
              whileFocus={reduce ? {} : { scale: 1.01 }}
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Assignee name or email"
              className={`mt-2 w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm ${inputFocus}`}
            />
          </label>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-2 rounded mb-3">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={reduce ? {} : { scale: 1.02 }}
              whileTap={reduce ? {} : { scale: 0.98 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-transparent border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              whileHover={reduce ? {} : { scale: 1.03, y: -2 }}
              whileTap={reduce ? {} : { scale: 0.98 }}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:opacity-60"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : null}
              <span>{initial ? "Update Task" : "Create Task"}</span>
            </motion.button>
          </div>

          <div className="text-xs text-slate-400">
            <span>All changes saved locally until you hit save.</span>
          </div>
        </div>
      </div>
    </motion.form>
  );
}

/* Priority toggle sub-component (visual only) */
function PriorityOption({ value, selected, onSelect, reduce }) {
  const base =
    "px-3 py-1 rounded-lg text-sm font-semibold cursor-pointer shadow-sm";
  const styles =
    value === "high"
      ? "bg-gradient-to-r from-red-400 to-pink-500 text-white"
      : value === "low"
      ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
      : "bg-gradient-to-r from-yellow-400 to-amber-500 text-white";

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      initial={false}
      whileHover={reduce ? {} : { scale: 1.04 }}
      whileTap={reduce ? {} : { scale: 0.97 }}
      className={`${base} ${styles} ${
        selected
          ? "ring-2 ring-offset-1 ring-indigo-300"
          : "opacity-90 hover:opacity-100"
      }`}
      aria-pressed={selected}
    >
      {value.charAt(0).toUpperCase() + value.slice(1)}
    </motion.div>
  );
}
