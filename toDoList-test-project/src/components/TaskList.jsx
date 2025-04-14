import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config.js";

export default function TaskList({ listId }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTask, setEditTask] = useState({ title: "", description: "" });

  useEffect(() => {
    const q = query(
      collection(db, "todoLists", listId, "tasks"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(items);
    });

    return () => unsubscribe();
  }, [listId]);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    await addDoc(collection(db, "todoLists", listId, "tasks"), {
      title: newTask.title,
      description: newTask.description,
      completed: false,
      createdAt: new Date(),
    });

    setNewTask({ title: "", description: "" });
  };

  const handleDeleteTask = async (taskId) => {
    await deleteDoc(doc(db, "todoLists", listId, "tasks", taskId));
  };

  const handleUpdateTask = async (taskId) => {
    await updateDoc(doc(db, "todoLists", listId, "tasks", taskId), {
      title: editTask.title,
      description: editTask.description,
    });
    setEditingTaskId(null);
    setEditTask({ title: "", description: "" });
  };

  const toggleTaskComplete = async (taskId, currentStatus) => {
    await updateDoc(doc(db, "todoLists", listId, "tasks", taskId), {
      completed: !currentStatus,
    });
  };

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-2">Завдання</h3>

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          className="px-3 py-2 border rounded flex-1"
          placeholder="Назва завдання"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          className="px-3 py-2 border rounded flex-1"
          placeholder="Опис"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleAddTask}
        >
          Додати
        </button>
      </div>

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="bg-white p-3 rounded shadow flex justify-between items-start"
          >
            <div className="flex-1">
              {editingTaskId === task.id ? (
                <>
                  <input
                    className="w-full border rounded px-2 py-1 mb-1"
                    value={editTask.title}
                    onChange={(e) =>
                      setEditTask({ ...editTask, title: e.target.value })
                    }
                  />
                  <input
                    className="w-full border rounded px-2 py-1 mb-2"
                    value={editTask.description}
                    onChange={(e) =>
                      setEditTask({ ...editTask, description: e.target.value })
                    }
                  />
                  <button
                    onClick={() => handleUpdateTask(task.id)}
                    className="text-green-600 hover:underline mr-2"
                  >
                    Зберегти
                  </button>
                </>
              ) : (
                <>
                  <p
                    className={`font-semibold ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </>
              )}
            </div>

            <div className="ml-4 space-x-2 text-sm">
              <button
                onClick={() => toggleTaskComplete(task.id, task.completed)}
                className={`px-2 py-1 rounded ${
                  task.completed
                    ? "bg-yellow-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {task.completed ? "Скасувати" : "Виконано"}
              </button>
              <button
                onClick={() => {
                  setEditingTaskId(task.id);
                  setEditTask({
                    title: task.title,
                    description: task.description,
                  });
                }}
                className="text-blue-600 hover:underline"
              >
                Редагувати
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-600 hover:underline"
              >
                Видалити
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
