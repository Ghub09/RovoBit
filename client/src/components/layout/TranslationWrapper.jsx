import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

/**
 * TranslationWrapper ensures all children components have access to translations
 * This component doesn't render any additional elements, just passes i18n context
 */
const TranslationWrapper = ({ children }) => {
  // Initialize i18n in this component
  useTranslation(); // This loads i18n without storing references

  return children;
};

TranslationWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TranslationWrapper;
