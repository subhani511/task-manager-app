import React from "react";
import { motion } from "framer-motion";

function PriorityBadge({ priority }) {
  if (priority === "high") return <span className="badge-high">High</span>;
  if (priority === "low") return <span className="badge-low">Low</span>;
  return <span className="badge-medium">Medium</span>;
}

export default function TaskCard({ task, onEdit, onDelete, onMove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 mb-3"
    >
      <div className="flex justify-between items-start gap-3">
        <div>
          <div className="text-sm text-slate-500">
            {new Date(task.createdAt).toLocaleDateString()}
          </div>
          <div className="font-semibold text-slate-900">{task.title}</div>
          <div className="text-sm text-slate-600 mt-1">{task.description}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <PriorityBadge priority={task.priority} />
          <div className="text-xs text-slate-500">
            {task.assignee || "Unassigned"}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={() => onMove("prev")} className="btn btn-ghost">
            ◀
          </button>
          <button onClick={() => onMove("next")} className="btn btn-ghost">
            ▶
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-sm text-indigo-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
