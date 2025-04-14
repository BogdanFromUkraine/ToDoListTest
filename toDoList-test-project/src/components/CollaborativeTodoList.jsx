import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

export default function CollaborativeTodoLists() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [lists, setLists] = useState([]);
  const [collabEmail, setCollabEmail] = useState("");
  const [selectedListId, setSelectedListId] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchLists = async () => {
      const ownLists = await getToDoLists(user.uid); // списки, створені користувачем
      const sharedLists = await getAccessibleLists(user.email); // списки, де користувач співучасник

      const allLists = [...ownLists, ...sharedLists];
      setLists(allLists);
    };

    fetchLists();
  }, [user]);

  const handleAddCollaborator = async () => {
    if (!collabEmail.trim() || !selectedListId) return;
    await addCollaboratorToList(selectedListId, collabEmail.trim());
    alert("Співучасник доданий!");
    setCollabEmail("");
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Доступні списки завдань</h2>

      {lists.map((list) => (
        <div
          key={list.id}
          className={`p-3 border mb-3 rounded ${
            selectedListId === list.id ? "bg-gray-100" : ""
          }`}
          onClick={() => setSelectedListId(list.id)}
        >
          <p className="font-medium">{list.title}</p>
          <p className="text-sm text-gray-600">
            Власник: {list.ownerId === user.uid ? "Ви" : list.ownerId}
          </p>
        </div>
      ))}

      {selectedListId && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">
            Додати співучасника до вибраного списку
          </h3>
          <input
            type="email"
            placeholder="Email користувача"
            value={collabEmail}
            onChange={(e) => setCollabEmail(e.target.value)}
            className="border px-3 py-2 rounded w-full mb-2"
          />
          <button
            onClick={handleAddCollaborator}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Додати співучасника
          </button>
        </div>
      )}
    </div>
  );
}
