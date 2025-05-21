// filepath: /d:/mu951/desktop/My-Codes/bitex-trading-web/client/src/components/AnimatedSection.jsx
import React from "react";
import { motion } from "framer-motion";

const AnimatedSection = ({ children,delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay:delay}}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
