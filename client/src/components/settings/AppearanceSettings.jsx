import { useContext, useState } from "react";
 import { MdLanguage, MdDarkMode } from "react-icons/md";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import LanguageSelector from "./LanguageSelector";
import { ThemeContext } from "../../context/ThemeContext";

const AppearanceSettings = ({ onClose }) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleSectionClick = (section) => {
    setActiveSection(section === activeSection ? null : section);
  };

  return (
    <div className={`appearance-settings`}>
      {!activeSection && (
        <div className="bg-background-dark dark:bg-background-dark bg-background-light p-6 rounded-lg transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {t("appearance_settings")}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div
              onClick={() => handleSectionClick("language")}
              className="p-4 border border-gray-700 rounded-lg cursor-pointer hover:bg-card-dark dark:hover:bg-card-dark hover:bg-card-light transition-colors flex items-center"
            >
              <MdLanguage className="text-2xl mr-3" />
              <div>
                <h3 className="font-medium">{t("lang")}</h3>
                <p className="text-sm text-gray-400">{t("select_language")}</p>
              </div>
            </div>

            <div
              onClick={toggleTheme}
              className="p-4 border border-gray-700 rounded-lg cursor-pointer hover:bg-card-dark dark:hover:bg-card-dark hover:bg-card-light transition-colors flex items-center"
            >
              <MdDarkMode className="text-2xl mr-3" />
              <div>
                <h3 className="font-medium">{t("theme")}</h3>
                <p className="text-sm text-gray-400 capitalize">
                  {t("current_theme")}: {theme}
                </p>
              </div>
              <div className="ml-auto border text-xs bg-gray-700 px-2 py-1 rounded">
                {theme === "dark" ? "🌙" : "☀️"}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === "language" && (
        <LanguageSelector onClose={() => setActiveSection(null)} />
      )}
    </div>
  );
};

AppearanceSettings.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AppearanceSettings;



// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { MdLanguage, MdDarkMode } from "react-icons/md";
// import PropTypes from "prop-types";
// import LanguageSelector from "./LanguageSelector";

// const AppearanceSettings = ({ onClose }) => {
//   const { t } = useTranslation();
//   const [activeSection, setActiveSection] = useState(null);

//   const handleSectionClick = (section) => {
//     setActiveSection(section === activeSection ? null : section);
//   };

//   return (
//     <div className="appearance-settings">
//       {/* Main menu when no section is active */}
//       {!activeSection && (
//         <div className="bg-[#1a1a1a] p-6 rounded-lg">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">
//               {t("appearance_settings")}
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-white"
//             >
//               ✕
//             </button>
//           </div>

//           <div className="grid grid-cols-1 gap-4">
//             <div
//               onClick={() => handleSectionClick("language")}
//               className="p-4 border border-gray-700 rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors flex items-center"
//             >
//               <MdLanguage className="text-2xl mr-3" />
//               <div>
//                 <h3 className="font-medium">{t("lang")}</h3>
//                 <p className="text-sm text-gray-400">{t("select_language")}</p>
//               </div>
//             </div>

//             <div
//               onClick={() => handleSectionClick("theme")}
//               className="p-4 border border-gray-700 rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors flex items-center opacity-50"
//             >
//               <MdDarkMode className="text-2xl mr-3" />
//               <div>
//                 <h3 className="font-medium">{t("theme")}</h3>
//                 <p className="text-sm text-gray-400">{t("select_theme")}</p>
//               </div>
//               <div className="ml-auto text-xs bg-gray-700 px-2 py-1 rounded">
//                 Coming Soon
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Language section */}
//       {activeSection === "language" && (
//         <LanguageSelector onClose={() => setActiveSection(null)} />
//       )}

//       {/* Theme section (coming soon) */}
//       {activeSection === "theme" && (
//         <div className="bg-[#1a1a1a] p-6 rounded-lg">
//           <h2 className="text-xl font-semibold mb-4">{t("select_theme")}</h2>
//           <p className="text-gray-400 mb-4">This feature is coming soon!</p>
//           <button
//             onClick={() => setActiveSection(null)}
//             className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
//           >
//             {t("cancel")}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// AppearanceSettings.propTypes = {
//   onClose: PropTypes.func.isRequired,
// };

// export default AppearanceSettings;
