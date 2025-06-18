import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
// Import i18n configuration
import "./i18n.js";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import TranslationWrapper from "./components/layout/TranslationWrapper.jsx";
createRoot(document.getElementById("root")).render(
  <>
    <TranslationWrapper>
        <Provider store={store}>
      <ThemeProvider>
          <App />
      </ThemeProvider>
        </Provider>
    </TranslationWrapper>
  </>
);
