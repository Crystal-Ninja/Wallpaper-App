import { useEffect, useState } from "react";

const themes = [
  "light", "dark", "cupcake", "retro", 
  "cyberpunk", "valentine", "halloween", 
  "forest", "luxury", "dracula"
];

export default function Settings() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
      <h2 className="text-2xl font-bold mb-6 text-base-content">Choose Theme</h2>
      <div className="flex flex-wrap gap-3 justify-center">
        {themes.map((t) => (
          <button
            key={t}
            onClick={() => changeTheme(t)}
            className={`btn ${theme === t ? "btn-primary" : "btn-outline"}`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
