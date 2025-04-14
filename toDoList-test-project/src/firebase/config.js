import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVm0gxkE3w2Vy7zWkw08XuqA7gTSFFO-I",
  authDomain: "todolist-b114d.firebaseapp.com",
  projectId: "todolist-b114d",
  storageBucket: "todolist-b114d.firebasestorage.app",
  messagingSenderId: "686988746019",
  appId: "1:686988746019:web:d3358fb4e8be0d5aeb0096",
  measurementId: "G-7PZ9GW21TF",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
