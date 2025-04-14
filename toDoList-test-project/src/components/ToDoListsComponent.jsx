import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  createToDoList,
  deleteToDoList,
  getToDoLists,
  updateToDoList,
  getTasksForList,
} from "../firebase/firebaseService";
import TasksComponents from "./TasksComponent";
import CreateTaskForm from "./CreateTaskForm";

export default function TodoListsComponent() {
  const [lists, setLists] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingListId, setEditingListId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [selectedListId, setSelectedListId] = useState(null);

  const [tasks, setTasks] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      await getToDoLists(setLists);
    };
    fetchData();
  }, [user]);

  const refreshTasks = async () => {
    if (!selectedListId) return;
    const updatedTasks = await getTasksForList(selectedListId);
    setTasks(updatedTasks);
  };

  const handleAddList = async () => {
    if (!newTitle.trim()) return;
    await createToDoList(newTitle);
    setNewTitle("");
    await getToDoLists(user.uid, setLists);
  };

  const handleDeleteList = async (id) => {
    await deleteToDoList(id);
    await getToDoLists(user.uid, setLists);
    if (selectedListId === id) {
      setSelectedListId(null);
      setTasks([]);
    }
  };

  const handleEditList = async (id) => {
    await updateToDoList(id, editTitle);
    setEditingListId(null);
    setEditTitle("");
    await getToDoLists(user.uid, setLists);
  };

  const handleSelectList = async (listId) => {
    setSelectedListId(listId);
    const fetchedTasks = await getTasksForList(listId);
    setTasks(fetchedTasks);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Мої списки завдань</h2>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded"
          placeholder="Назва списку"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button
          onClick={handleAddList}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Додати
        </button>
      </div>

      {lists.map((list) => (
        <div
          key={list.id}
          className={`flex items-center justify-between p-3 border-b cursor-pointer ${
            selectedListId === list.id ? "bg-gray-100" : ""
          }`}
          onClick={() => handleSelectList(list.id)}
        >
          {editingListId === list.id ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 mr-2 px-2 py-1 border rounded"
            />
          ) : (
            <span className="flex-1 font-medium">{list.title}</span>
          )}

          {editingListId === list.id ? (
            <button
              onClick={() => handleEditList(list.id)}
              className="text-green-600 hover:underline mr-2"
            >
              Зберегти
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingListId(list.id);
                setEditTitle(list.title);
              }}
              className="text-blue-600 hover:underline mr-2"
            >
              Редагувати
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteList(list.id);
            }}
            className="text-red-600 hover:underline"
          >
            Видалити
          </button>
        </div>
      ))}
      {isModalOpen && (
        <CreateTaskForm
          setIsModalOpen={setIsModalOpen}
          selectedListId={selectedListId}
          refreshTasks={refreshTasks}
        />
      )}
      <TasksComponents
        tasks={tasks}
        selectedListId={selectedListId}
        refreshTasks={refreshTasks}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
