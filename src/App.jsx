import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TaskList from "../src/components/TaskList";
import TaskForm from "../src/components/TaskForm";

function App() {
  const [selectedTask, setSelectedTask] = useState(null);
  const refreshAfterSave = () => {
    setSelectedTask(null);
    window.location.reload();
  };
  return (
    <div style={{ padding: "20px" }}>
      <h2>Task Management System</h2>

      <TaskForm selectedTask={selectedTask} onSaved={refreshAfterSave} />
      <hr />
      <TaskList onEdit={setSelectedTask} />
    </div>
  )
}

export default App
