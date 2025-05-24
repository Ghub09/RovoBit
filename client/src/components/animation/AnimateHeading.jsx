import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const AnimatedHeading = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.h2
    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: false, amount: 0.3 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  {children}
</motion.h2>

  );
};

export default AnimatedHeading;
