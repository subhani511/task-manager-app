// src/pages/Board.jsx  (or src/Board.jsx) — styling-only replacement
import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const STATUS = ["todo", "inprogress", "done"];
const TITLE = { todo: "To Do", inprogress: "In Progress", done: "Done" };

const COUNT_CLASSES = {
  todo: "from-blue-400 to-indigo-500 text-white",
  inprogress: "from-yellow-400 to-amber-500 text-white",
  done: "from-green-400 to-emerald-500 text-white",
};

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await api.get("/tasks");
      setTasks(res.data || []);
    } catch (err) {
      console.error(err);
      setTasks([]);
    }
    setLoading(false);
  }

  async function createTask(payload) {
    const res = await api.post("/tasks", payload);
    setTasks((t) => [res.data, ...t]);
  }

  async function updateTask(id, payload) {
    const res = await api.put(`/tasks/${id}`, payload);
    setTasks((t) => t.map((x) => (x._id === id ? res.data : x)));
  }

  async function deleteTask(id) {
    await api.delete(`/tasks/${id}`);
    setTasks((t) => t.filter((x) => x._id !== id));
  }

  function move(task, dir) {
    const idx = STATUS.indexOf(task.status);
    const next =
      dir === "next"
        ? STATUS[Math.min(idx + 1, STATUS.length - 1)]
        : STATUS[Math.max(idx - 1, 0)];
    updateTask(task._id, { ...task, status: next });
  }

  // simple skeleton component (visual only)
  function SkeletonRow({ className = "h-16 rounded-2xl" }) {
    return (
      <div
        className={`animate-pulse bg-slate-200 dark:bg-slate-700 ${className}`}
      />
    );
  }

  const columnVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: "easeOut" },
    },
  };

  const listContainer = {
    hidden: { transition: { staggerChildren: 0.06 } },
    visible: { transition: { staggerChildren: 0.06 } },
  };

  const listItem = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Task Board</h1>
          <p className="text-sm text-slate-500">
            Organize work with a bold, visual Kanban view
          </p>
        </div>

        <motion.button
          whileHover={reduce ? {} : { scale: 1.04, y: -2 }}
          whileTap={reduce ? {} : { scale: 0.98 }}
          onClick={() => {
            setEditTask(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          aria-label="New task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New task
        </motion.button>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATUS.map((s) => {
          const colTasks = tasks.filter((t) => t.status === s);
          return (
            <motion.div
              key={s}
              initial={reduce ? false : "hidden"}
              animate={reduce ? undefined : "visible"}
              variants={columnVariants}
              className="bg-white/70 dark:bg-slate-900/50 rounded-2xl p-4 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-lg">{TITLE[s]}</h2>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold shadow-md bg-gradient-to-r ${COUNT_CLASSES[s]}`}
                    aria-label={`${TITLE[s]} count`}
                  >
                    {colTasks.length}
                  </span>
                </div>
              </div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={listContainer}
                className="space-y-3 min-h-[80px]"
              >
                {/* Loading */}
                {loading ? (
                  <div className="space-y-3">
                    <SkeletonRow className="h-20" />
                    <SkeletonRow className="h-20" />
                  </div>
                ) : colTasks.length === 0 ? (
                  // Empty state — bold card
                  <motion.div
                    initial={reduce ? {} : { opacity: 0, y: 6 }}
                    animate={reduce ? {} : { opacity: 1, y: 0 }}
                    className="rounded-xl p-4 border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="mb-2 text-xl font-semibold text-slate-700 dark:text-slate-200">
                        No tasks
                      </div>
                      <div className="text-sm">
                        You can add a new task using the button above.
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  // Task list with animate presence
                  <AnimatePresence>
                    {colTasks.map((t) => (
                      <motion.div
                        key={t._id}
                        layout
                        variants={listItem}
                        exit="exit"
                      >
                        <TaskCard
                          task={t}
                          onEdit={() => {
                            setEditTask(t);
                            setShowForm(true);
                          }}
                          onDelete={() => deleteTask(t._id)}
                          onMove={(dir) => move(t, dir)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-8 shadow-2xl">
            <TaskForm
              initial={editTask}
              onCancel={() => setShowForm(false)}
              onSave={async (payload) => {
                if (editTask) {
                  await updateTask(editTask._id, payload);
                } else {
                  await createTask(payload);
                }
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
