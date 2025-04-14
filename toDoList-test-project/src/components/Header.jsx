import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default function Header() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // Слухаємо зміну стану авторизації
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Очищаємо підписку
  }, [auth]);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        To-Do App
      </Link>
      <Link to="/collaborative">Корператив</Link>

      <nav className="flex items-center space-x-4">
        {user ? (
          <>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
            >
              Вийти
            </button>
          </>
        ) : (
          <>
            <Link to="/logIn" className="text-gray-700 hover:text-blue-600">
              Увійти
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition"
            >
              Зареєструватися
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
