// src/context/ThemeContext.js
import { createContext, useState, useEffect, useContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext();

// eslint-disable-next-line react/prop-types
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("app-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const toggleTheme = () =>{
        // console.log("theme",theme)

    setTheme((prev) => (prev === "dark" ? "light" : "dark"));}
     const getModeColor = (type) => {
    if (type === "t") return theme === "dark" ? "text-white " : "text-black";
    else if (type === "b") return theme === "dark" ? " bg-black" : "bg-white";
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, getModeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
