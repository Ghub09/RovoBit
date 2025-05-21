import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const AnimatedHeading = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.h2
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.h2>
  );
};

export default AnimatedHeading;
