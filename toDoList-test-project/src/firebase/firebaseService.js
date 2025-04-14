import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { app, auth } from "./config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const db = getFirestore(app); // Ініціалізую Firestore

export async function register({ name, email, password }) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error register user: ", error);
    throw error;
  }
}

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();
    localStorage.setItem("token", token);
    localStorage.setItem("userId", user.uid);
  } catch (error) {
    console.error("Error login user: ", error);
    throw error;
  }
}

export async function getToDoLists(callback) {
  const userId = localStorage.getItem("userId");
  const q = query(collection(db, "todoLists"), where("owner", "==", userId));

  onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(items);
  });
}

export async function createToDoList(newTitle) {
  const userId = localStorage.getItem("userId");
  await addDoc(collection(db, "todoLists"), {
    title: newTitle,
    owner: userId,
    createdAt: new Date(),
  });
}

export async function deleteToDoList(toDoListId) {
  await deleteDoc(doc(db, "todoLists", toDoListId));
}

export async function updateToDoList(toDoListId, editTitle) {
  await updateDoc(doc(db, "todoLists", toDoListId), {
    title: editTitle,
  });
}

export async function getTasksForList(listId) {
  const tasksRef = collection(db, "todoLists", listId, "tasks");
  const snapshot = await getDocs(tasksRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function deleteTask(listId, taskId) {
  const taskRef = doc(db, "todoLists", listId, "tasks", taskId);
  await deleteDoc(taskRef);
}

export async function updateTask(
  listId,
  taskId,
  { editTitle, editDescription }
) {
  const taskRef = doc(db, "todoLists", listId, "tasks", taskId);
  await updateDoc(taskRef, { title: editTitle, description: editDescription });
}

export async function changeStatus(listId, task) {
  const taskRef = doc(db, "todoLists", listId, "tasks", task.id);
  await updateDoc(taskRef, { completed: !task.completed });
}

export async function createTask(listId, taskData) {
  const tasksRef = collection(db, "todoLists", listId, "tasks");
  await addDoc(tasksRef, taskData);
}
