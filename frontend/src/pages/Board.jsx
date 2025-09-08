import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

const STATUS = ["todo", "inprogress", "done"];
const TITLE = { todo: "To Do", inprogress: "In Progress", done: "Done" };

// Badge classes for counts (Tailwind)
const COUNT_CLASSES = {
  todo: "bg-blue-100 text-blue-800",
  inprogress: "bg-yellow-100 text-yellow-800",
  done: "bg-green-100 text-green-800",
};

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Task Board</h1>
          <p className="text-sm text-slate-500">
            Organize work with simple Kanban columns
          </p>
        </div>
        <div>
          <button
            onClick={() => {
              setEditTask(null);
              setShowForm(true);
            }}
            className="btn btn-primary"
          >
            New task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATUS.map((s) => (
          <div key={s} className="bg-transparent p-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">{TITLE[s]}</h2>
              <div>
                {/* Colored count badge */}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium ${COUNT_CLASSES[s]}`}
                  aria-label={`${TITLE[s]} count`}
                >
                  {tasks.filter((t) => t.status === s).length}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {loading ? (
                <div className="text-slate-500">Loading...</div>
              ) : (
                tasks
                  .filter((t) => t.status === s)
                  .map((t) => (
                    <TaskCard
                      key={t._id}
                      task={t}
                      onEdit={() => {
                        setEditTask(t);
                        setShowForm(true);
                      }}
                      onDelete={() => deleteTask(t._id)}
                      onMove={(dir) => move(t, dir)}
                    />
                  ))
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg">
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
