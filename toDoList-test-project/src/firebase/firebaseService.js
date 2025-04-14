import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { app } from "./config.js";

const db = getFirestore(app); // Ініціалізую Firestore
