import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
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
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error login user: ", error);
    throw error;
  }
}

export async function getToDoLists(uid, callback) {
  const q = query(collection(db, "todoLists"), where("owner", "==", uid));

  onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(items);
  });
}

export async function createToDoList(uid, newTitle) {
  await addDoc(collection(db, "todoLists"), {
    title: newTitle,
    owner: uid,
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
