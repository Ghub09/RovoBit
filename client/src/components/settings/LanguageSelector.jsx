import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const LanguageSelector = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language || "en"
  );

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
  ];

  useEffect(() => {
    // Set initial selected language based on current i18n language
    setSelectedLanguage(i18n.language.substring(0, 2) || "en");
  }, [i18n.language]);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
  };

  const handleSave = () => {
    i18n.changeLanguage(selectedLanguage);
    if (onClose) onClose();
  };

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{t("language_settings")}</h2>
      <p className="text-gray-400 mb-4">{t("select_language")}</p>

      <div className="grid grid-cols-1 gap-3 mb-6">
        {languages.map((lang) => (
          <div
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`p-3 border rounded-lg cursor-pointer flex items-center justify-between ${
              selectedLanguage === lang.code
                ? "border-blue-500 bg-[#2a2a2a]"
                : "border-gray-700"
            }`}
          >
            <span>{lang.name}</span>
            {selectedLanguage === lang.code && (
              <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {t("cancel")}
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t("save")}
        </button>
      </div>
    </div>
  );
};

LanguageSelector.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LanguageSelector;
