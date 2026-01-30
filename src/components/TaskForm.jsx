import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Taskform.css"; 

const statuses = ["New", "InProgress", "Completed"];

export default function TaskForm({ selectedTask, onSaved }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "New",
    dueDate: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedTask) {
      setForm({
        title: selectedTask.title,
        description: selectedTask.description || "",
        status: selectedTask.status,
        dueDate: selectedTask.dueDate ? selectedTask.dueDate.substring(0, 10) : "",
      });
    }
  }, [selectedTask]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (form.title.length > 100) return "Title max length is 100";
    if (!statuses.includes(form.status)) return "Invalid status";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setError("");

      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        dueDate: form.dueDate ? form.dueDate : null,
      };

      if (selectedTask) {
        await axios.put(
          `http://localhost:5187/api/Task/${selectedTask.id}`,
          payload
        );
      } else {
        await axios.post(`http://localhost:5187/api/Task`, payload);
      }

      setForm({ title: "", description: "", status: "New", dueDate: "" });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <div className="taskform-container">
      <form className="taskform-card" onSubmit={handleSubmit}>
        <h3 className="taskform-title">
          {selectedTask ? "Edit Task" : "Create Task"}
        </h3>

        {error && <p className="taskform-error">{error}</p>}

        <div className="taskform-group">
          <label className="taskform-label">Title</label>
          <input
            className="taskform-input"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter task title"
          />
        </div>

        <div className="taskform-group">
          <label className="taskform-label">Description</label>
          <input
            className="taskform-input"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter description"
          />
        </div>

        <div className="taskform-group">
          <label className="taskform-label">Status</label>
          <select
            className="taskform-select"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="taskform-group">
          <label className="taskform-label">Due Date</label>
          <input
            className="taskform-input"
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>

        <button className="taskform-btn" type="submit">
          {selectedTask ? "Update Task" : "Create Task"}
        </button>
      </form>
    </div>
  );
}
