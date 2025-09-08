import React, { useState, useEffect } from "react";

export default function TaskForm({ initial, onCancel, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || "");
      setDescription(initial.description || "");
      setAssignee(initial.assignee || "");
      setPriority(initial.priority || "medium");
    } else {
      setTitle("");
      setDescription("");
      setAssignee("");
      setPriority("medium");
    }
  }, [initial]);

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    onSave({
      title,
      description,
      assignee,
      priority,
      status: initial?.status || "todo",
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full border rounded-lg px-3 py-2"
          placeholder="Short descriptive title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full border rounded-lg px-3 py-2"
          rows={4}
          placeholder="Details, acceptance criteria, links..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Assignee
          </label>
          <input
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
            placeholder="e.g. Alice Admin"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="btn border">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save task
        </button>
      </div>
    </form>
  );
}
