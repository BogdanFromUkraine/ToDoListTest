import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  createToDoList,
  deleteToDoList,
  getToDoLists,
  updateToDoList,
} from "../firebase/firebaseService";
export default function TodoListsComponent() {
  const [lists, setLists] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingListId, setEditingListId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      await getToDoLists(user.uid, setLists);
    };

    fetchData();
  }, [user]);

  const handleAddList = async () => {
    if (!newTitle.trim()) return;
    await createToDoList(user.uid, newTitle);
    setNewTitle("");
  };

  const handleDeleteList = async (id) => {
    await deleteToDoList(id);
  };

  const handleEditList = async (id) => {
    await updateToDoList(id, editTitle);
    setEditingListId(null);
    setEditTitle("");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded shadow">
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
          className="flex items-center justify-between p-3 border-b"
        >
          {editingListId === list.id ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 mr-2 px-2 py-1 border rounded"
            />
          ) : (
            <span className="flex-1">{list.title}</span>
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
              onClick={() => {
                setEditingListId(list.id);
                setEditTitle(list.title);
              }}
              className="text-blue-600 hover:underline mr-2"
            >
              Редагувати
            </button>
          )}

          <button
            onClick={() => handleDeleteList(list.id)}
            className="text-red-600 hover:underline"
          >
            Видалити
          </button>
        </div>
      ))}
    </div>
  );
}
