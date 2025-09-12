// src/components/TaskCard.jsx  (Strong)
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

function PriorityBadge({ priority }) {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-tight shadow-sm";
  if (priority === "high")
    return (
      <span
        className={`${base} bg-gradient-to-r from-red-400 to-pink-500 text-white`}
      >
        High
      </span>
    );
  if (priority === "low")
    return (
      <span
        className={`${base} bg-gradient-to-r from-green-400 to-emerald-500 text-white`}
      >
        Low
      </span>
    );
  return (
    <span
      className={`${base} bg-gradient-to-r from-yellow-400 to-amber-500 text-white`}
    >
      Medium
    </span>
  );
}

export default function TaskCard({ task, onEdit, onDelete, onMove }) {
  const reduce = useReducedMotion();

  const cardVariants = {
    hidden: { opacity: 0, y: 14, rotate: -1, scale: 0.995 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.32, ease: "cubic-bezier(.2,.9,.3,1)" },
    },
    exit: { opacity: 0, y: -12, transition: { duration: 0.18 } },
  };

  return (
    <motion.div
      layout
      initial={reduce ? false : "hidden"}
      animate={reduce ? undefined : "visible"}
      variants={reduce ? {} : cardVariants}
      whileHover={reduce ? {} : { scale: 1.045, rotate: 0.6, translateY: -6 }}
      whileTap={reduce ? {} : { scale: 0.985 }}
      className="relative overflow-hidden rounded-3xl p-4 mb-4 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 shadow-md hover:shadow-2xl transition"
    >
      {/* faint animated gradient corner */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 w-44 h-44 rounded-full opacity-10 blur-2xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.7), transparent 30%)",
        }}
      />

      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0">
          <div className="text-xs text-slate-400 dark:text-slate-500">
            {task.createdAt
              ? new Date(task.createdAt).toLocaleDateString()
              : ""}
          </div>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate mt-1">
            {task.title}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
            {task.description}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <motion.div
            initial={{ scale: 0.9, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.28 }}
          >
            <PriorityBadge priority={task.priority} />
          </motion.div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {task.assignee || "Unassigned"}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <motion.button
            whileHover={reduce ? {} : { y: -4 }}
            whileTap={reduce ? {} : { scale: 0.96 }}
            onClick={() => onMove("prev")}
            className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow"
            aria-label="Move task previous"
          >
            ◀
          </motion.button>

          <motion.button
            whileHover={reduce ? {} : { y: -4 }}
            whileTap={reduce ? {} : { scale: 0.96 }}
            onClick={() => onMove("next")}
            className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow"
            aria-label="Move task next"
          >
            ▶
          </motion.button>
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={reduce ? {} : { scale: 1.06 }}
            whileTap={reduce ? {} : { scale: 0.96 }}
            onClick={onEdit}
            className="text-sm text-indigo-600 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            aria-label="Edit task"
          >
            Edit
          </motion.button>

          <motion.button
            whileHover={reduce ? {} : { scale: 1.06 }}
            whileTap={reduce ? {} : { scale: 0.96 }}
            onClick={onDelete}
            className="text-sm text-red-600 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            aria-label="Delete task"
          >
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
