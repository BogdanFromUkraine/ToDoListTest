import React, { useState } from "react";
import { createTask } from "../firebase/firebaseService";

export default function CreateTaskForm({
  setIsModalOpen,
  selectedListId,
  refreshTasks,
}) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    await createTask(selectedListId, {
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
    });
    await refreshTasks();
    setIsModalOpen(false);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Нове завдання</h2>
        <input
          type="text"
          className="w-full mb-2 p-2 border rounded"
          placeholder="Назва завдання"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <textarea
          className="w-full mb-4 p-2 border rounded"
          placeholder="Опис завдання"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Скасувати
          </button>
          <button
            onClick={handleCreateTask}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
}
