import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

// eslint-disable-next-line react/prop-types
const AnimatedHeading = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <div ref={ref}>
      <motion.div
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
        initial={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default AnimatedHeading;
