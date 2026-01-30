import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/TaskList.css"; 

export default function TaskList({ onEdit }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:5187/api/Task");
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`http://localhost:5187/api/Task/${id}`);
      loadTasks();
    } catch (err) {
      alert("Delete failed!");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="tasklist-container">
      <h2 className="tasklist-title">Task List</h2>

      {loading && <p className="tasklist-loading">Loading...</p>}
      {error && <p className="tasklist-error">{error}</p>}

      {!loading && !error && (
        <div className="tasklist-table-wrapper">
          <table className="tasklist-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="tasklist-empty">
                    No tasks found
                  </td>
                </tr>
              ) : (
                tasks.map((t) => (
                  <tr key={t.id}>
                    <td>{t.title}</td>
                    <td>
                      <span className={`status-badge ${t.status}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>{t.dueDate ? t.dueDate.substring(0, 10) : "-"}</td>
                    <td className="tasklist-actions">
                      <button
                        className="btn btn-edit"
                        onClick={() => onEdit(t)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => deleteTask(t.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
