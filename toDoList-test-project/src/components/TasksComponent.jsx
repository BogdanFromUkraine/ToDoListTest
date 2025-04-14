import { useState } from "react";
import {
  changeStatus,
  deleteTask,
  updateTask,
} from "../firebase/firebaseService";

export default function TasksComponents({
  tasks,
  selectedListId,
  refreshTasks,
  setIsModalOpen,
}) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleToggleComplete = async (task) => {
    try {
      await changeStatus(selectedListId, task);
      refreshTasks();
    } catch (error) {
      console.error("Помилка при оновленні статусу:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(selectedListId, taskId);
      await refreshTasks();
    } catch (error) {
      console.error("Помилка при видаленні:", error);
    }
  };

  const handleSaveEdit = async (taskId) => {
    if (!editTitle.trim()) return;

    try {
      await updateTask(selectedListId, taskId, {
        editTitle,
        editDescription,
      });
      await refreshTasks();
      setEditingTaskId(null);
      setEditTitle("");
      setEditDescription("");
      refreshTasks();
    } catch (error) {
      console.error("Помилка при збереженні редагування:", error);
    }
  };
  return (
    <div>
      {selectedListId && (
        <div className="mt-6">
          <div className="mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Додати завдання
            </button>
          </div>
          <h3 className="text-xl font-semibold mb-2">Завдання списку</h3>
          {tasks.length > 0 ? (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-start justify-between p-3 border rounded bg-white"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                      className="mt-1"
                    />

                    {editingTaskId === task.id ? (
                      <div>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="block mb-1 px-2 py-1 border rounded w-full"
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="block px-2 py-1 border rounded w-full"
                        />
                      </div>
                    ) : (
                      <div>
                        <p
                          className={`font-medium ${
                            task.completed ? "line-through text-gray-400" : ""
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {task.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 items-start">
                    {editingTaskId === task.id ? (
                      <button
                        onClick={() => handleSaveEdit(task.id)}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Зберегти
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingTaskId(task.id);
                          setEditTitle(task.title);
                          setEditDescription(task.description);
                        }}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Редагувати
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Видалити
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">У цьому списку ще немає завдань.</p>
          )}
        </div>
      )}
    </div>
  );
}
