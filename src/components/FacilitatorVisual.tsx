import { motion } from "framer-motion";

export const FacilitatorVisual = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative w-full max-w-lg mx-auto"
    >
      {/* Central ring visualization */}
      <div className="relative aspect-square max-w-[300px] mx-auto">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-border"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle ring */}
        <motion.div
          className="absolute inset-6 rounded-full border border-verified/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner ring */}
        <motion.div
          className="absolute inset-12 rounded-full border-2 border-verified/50 glow-verified"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Center node */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-20 h-20 rounded-full bg-verified/10 border-2 border-verified-bright flex items-center justify-center glow-verified"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-2xl font-mono text-verified-bright">⬡</span>
          </motion.div>
        </div>

        {/* Orbiting verification nodes */}
        {[0, 120, 240].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full bg-verified/20 border border-verified"
            style={{
              top: "50%",
              left: "50%",
              marginTop: -8,
              marginLeft: -8,
            }}
            animate={{
              x: [
                Math.cos((angle * Math.PI) / 180) * 100,
                Math.cos(((angle + 360) * Math.PI) / 180) * 100,
              ],
              y: [
                Math.sin((angle * Math.PI) / 180) * 100,
                Math.sin(((angle + 360) * Math.PI) / 180) * 100,
              ],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Properties */}
      <div className="flex justify-center gap-8 mt-12">
        {["Verifies, does not decide", "Reads chain, returns truth", "No custody, no state"].map(
          (text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="text-xs text-muted-foreground font-mono text-center max-w-[120px]"
            >
              {text}
            </motion.div>
          )
        )}
      </div>
    </motion.div>
  );
};
