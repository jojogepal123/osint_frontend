import { motion } from "framer-motion";

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
