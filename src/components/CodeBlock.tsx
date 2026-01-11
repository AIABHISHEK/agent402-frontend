import { motion } from "framer-motion";

export const CodeBlock = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative w-full max-w-2xl mx-auto"
    >
      {/* Window chrome */}
      <div className="bg-card border border-border rounded-t-xl px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-muted" />
          <div className="w-3 h-3 rounded-full bg-muted" />
          <div className="w-3 h-3 rounded-full bg-muted" />
        </div>
        <span className="text-xs text-muted-foreground font-mono ml-3">agent-call.ts</span>
      </div>

      {/* Code content */}
      <div className="bg-[#0d0d0f] border border-t-0 border-border rounded-b-xl p-6 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed">
          <code>
            <span className="text-purple-400">const</span>{" "}
            <span className="text-foreground">result</span>{" "}
            <span className="text-muted-foreground">=</span>{" "}
            <span className="text-purple-400">await</span>{" "}
            <span className="text-verified-bright">agent</span>
            <span className="text-muted-foreground">.</span>
            <span className="text-payment">call</span>
            <span className="text-muted-foreground">({"{"}</span>
            {"\n"}
            {"  "}
            <span className="text-foreground">agentId</span>
            <span className="text-muted-foreground">:</span>{" "}
            <span className="text-payment">"premium-agent"</span>
            <span className="text-muted-foreground">,</span>
            {"\n"}
            {"  "}
            <span className="text-foreground">proof</span>
            <span className="text-muted-foreground">:</span>{" "}
            <span className="text-muted-foreground">{"{"}</span>
            {"\n"}
            {"    "}
            <span className="text-foreground">txHash</span>
            <span className="text-muted-foreground">,</span>
            {"\n"}
            {"    "}
            <span className="text-foreground">amount</span>
            <span className="text-muted-foreground">,</span>
            {"\n"}
            {"    "}
            <span className="text-foreground">chain</span>
            {"\n"}
            {"  "}
            <span className="text-muted-foreground">{"}"}</span>
            {"\n"}
            <span className="text-muted-foreground">{"})"}</span>
          </code>
        </pre>
      </div>

      {/* Caption */}
      <p className="text-center text-sm text-muted-foreground mt-4 font-mono">
        Retry with proof. Access resolves automatically.
      </p>
    </motion.div>
  );
};
