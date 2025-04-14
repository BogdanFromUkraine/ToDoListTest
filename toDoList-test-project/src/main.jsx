import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style/index.css";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import Main from "./components/Main.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CollaborativeTodoLists from "./components/CollaborativeTodoList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Main /> },
      { path: "logIn", element: <LoginForm /> },
      { path: "register", element: <RegisterForm /> },
      { path: "collaborative", element: <CollaborativeTodoLists /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>
    <StrictMode>
      <App />
    </StrictMode>
  </RouterProvider>
);
