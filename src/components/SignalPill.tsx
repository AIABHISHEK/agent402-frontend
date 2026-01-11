import { motion } from "framer-motion";

interface SignalPillProps {
  text: string;
  index: number;
}

export const SignalPill = ({ text, index }: SignalPillProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="px-5 py-2.5 rounded-full border border-border bg-card hover:border-foreground/30 transition-colors cursor-default"
    >
      <span className="text-sm font-medium text-foreground">{text}</span>
    </motion.div>
  );
};
