import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const phases = [
  { id: 0, label: "Agent 1 requests access", from: "agent1", to: "agent2", direction: "right" },
  { id: 1, label: "Payment Required", from: "agent2", to: "agent1", direction: "left", state: "payment" },
  { id: 2, label: "On-chain payment", from: "agent1", to: "blockchain", direction: "down", state: "payment" },
  { id: 3, label: "Retry with proof", from: "agent1", to: "agent2", direction: "right", state: "payment" },
  { id: 4, label: "Verify payment", from: "agent2", to: "facilitator", direction: "down" },
  { id: 5, label: "Verified ✓", from: "facilitator", to: "agent2", direction: "up", state: "verified" },
  { id: 6, label: "Resource granted", from: "agent2", to: "agent1", direction: "left", state: "verified" },
];

type Line = { x1: number; y1: number; x2: number; y2: number };

export const SequenceDiagram = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentPhase((prev) => ((prev + 1) % 7) as Phase);
    }, 2000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const getNodeState = (nodeId: string) => {
    const phase = phases[currentPhase];
    if (phase.from === nodeId || phase.to === nodeId) {
      return phase.state || "active";
    }
    return "idle";
  };

  const getNodeColor = (nodeId: string) => {
    const state = getNodeState(nodeId);
    switch (state) {
      case "payment":
        return "border-payment bg-payment/10";
      case "verified":
        return "border-verified-bright bg-verified/10";
      case "active":
        return "border-foreground bg-foreground/5";
      default:
        return "border-border bg-card";
    }
  };

  const getNodeGlow = (nodeId: string) => {
    const state = getNodeState(nodeId);
    switch (state) {
      case "payment":
        return "glow-payment";
      case "verified":
        return "glow-verified";
      case "active":
        return "shadow-lg shadow-white/10";
      default:
        return "";
    }
  };
  const containerRef = useRef<HTMLDivElement | null>(null);
  const agent1Ref = useRef<HTMLDivElement | null>(null);
  const agent2Ref = useRef<HTMLDivElement | null>(null);
  const blockchainRef = useRef<HTMLDivElement | null>(null);
  const facilitatorRef = useRef<HTMLDivElement | null>(null);

  const [lines, setLines] = useState<{ id: string; coords: Line }[]>([
    { id: "a1-a2", coords: { x1: 0, y1: 0, x2: 0, y2: 0 } },
    { id: "a1-chain", coords: { x1: 0, y1: 0, x2: 0, y2: 0 } },
    { id: "a2-fac", coords: { x1: 0, y1: 0, x2: 0, y2: 0 } },
  ]);

  // helper to compute edge-center point on rect
  const edgePoint = (rect: DOMRect, edge: "left" | "right" | "top" | "bottom") => {
    switch (edge) {
      case "left":
        return { x: rect.left, y: rect.top + rect.height / 2 };
      case "right":
        return { x: rect.right, y: rect.top + rect.height / 2 };
      case "top":
        return { x: rect.left + rect.width / 2, y: rect.top };
      case "bottom":
        return { x: rect.left + rect.width / 2, y: rect.bottom };
    }
  };

  // compute line coordinates relative to svg (container)
  const updateLines = () => {
    const c = containerRef.current;
    const a1 = agent1Ref.current;
    const a2 = agent2Ref.current;
    const chain = blockchainRef.current;
    const fac = facilitatorRef.current;
    if (!c || !a1 || !a2 || !chain || !fac) return;

    const crect = c.getBoundingClientRect();
    const a1r = a1.getBoundingClientRect();
    const a2r = a2.getBoundingClientRect();
    const chr = chain.getBoundingClientRect();
    const fr = fac.getBoundingClientRect();

    // Agent1 right-center -> Agent2 left-center
    const p1 = edgePoint(a1r, "right");
    const p2 = edgePoint(a2r, "left");

    // Agent1 bottom-center -> Blockchain top-center
    const p3 = edgePoint(a1r, "bottom");
    const p4 = edgePoint(chr, "top");

    // Agent2 bottom-center -> Facilitator top-center
    const p5 = edgePoint(a2r, "bottom");
    const p6 = edgePoint(fr, "top");

    const toLocal = (pt: { x: number; y: number }) => ({ x: pt.x - crect.left, y: pt.y - crect.top });

    setLines([
      { id: "a1-a2", coords: { x1: toLocal(p1).x, y1: toLocal(p1).y, x2: toLocal(p2).x, y2: toLocal(p2).y } },
      { id: "a1-chain", coords: { x1: toLocal(p3).x, y1: toLocal(p3).y, x2: toLocal(p4).x, y2: toLocal(p4).y } },
      { id: "a2-fac", coords: { x1: toLocal(p5).x, y1: toLocal(p5).y, x2: toLocal(p6).x, y2: toLocal(p6).y } },
    ]);
  };

  // measure on layout, resize and when fonts/styles change
  useLayoutEffect(() => {
    updateLines();

    const ro = new ResizeObserver(updateLines);
    if (containerRef.current) ro.observe(containerRef.current);
    if (agent1Ref.current) ro.observe(agent1Ref.current);
    if (agent2Ref.current) ro.observe(agent2Ref.current);
    if (blockchainRef.current) ro.observe(blockchainRef.current);
    if (facilitatorRef.current) ro.observe(facilitatorRef.current);

    window.addEventListener("resize", updateLines);
    // also update when fonts load / flow changes
    const t = setTimeout(updateLines, 50);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateLines);
      clearTimeout(t);
    };
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Phase indicator */}
      <div className="flex justify-center gap-2 mb-8">
        {phases.map((phase, i) => (
          <button
            key={phase.id}
            onClick={() => {
              setCurrentPhase(i as Phase);
              setIsPlaying(false);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentPhase
                ? phase.state === "payment"
                  ? "bg-payment w-6"
                  : phase.state === "verified"
                  ? "bg-verified-bright w-6"
                  : "bg-foreground w-6"
                : "bg-border hover:bg-muted-foreground"
            }`}
          />
        ))}
      </div>

      {/* Diagram */}
      <div ref={containerRef} className="relative h-[400px]">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          {/* Agent 1 to Agent 2 */}
          {lines.map((line) => (
            <line
              key={line.id}
              x1={line.coords.x1}
              y1={line.coords.y1}
              x2={line.coords.x2}
              y2={line.coords.y2}
              className="stroke-wire"
              strokeWidth={1}
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          ))}
        </svg>

        {/* Nodes */}
        {/* Agent 1 */}
        <motion.div
          ref={agent1Ref}
          className={`absolute left-[15%] top-[20%] w-28 h-28 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-500 ${getNodeColor("agent1")} ${getNodeGlow("agent1")}`}
          animate={{ scale: getNodeState("agent1") !== "idle" ? 1.02 : 1 }}
        >
          <div className="w-6 h-6 rounded-full bg-foreground/20 mb-2" />
          <span className="text-sm font-medium">Agent 1</span>
          <span className="text-xs text-muted-foreground">Requester</span>
        </motion.div>

        {/* Agent 2 */}
        <motion.div
          ref={agent2Ref}
          className={`absolute right-[15%] top-[20%] w-28 h-28 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-500 ${getNodeColor("agent2")} ${getNodeGlow("agent2")}`}
          animate={{ scale: getNodeState("agent2") !== "idle" ? 1.02 : 1 }}
        >
          <div className="w-6 h-6 rounded-full bg-premium/30 mb-2" />
          <span className="text-sm font-medium">Agent 2</span>
          <span className="text-xs text-muted-foreground">Premium</span>
        </motion.div>

        {/* Blockchain */}
        <motion.div
          ref={blockchainRef}
          className={`absolute left-[15%] bottom-[10%] w-28 h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-500 ${getNodeColor("blockchain")} ${getNodeGlow("blockchain")}`}
          animate={{ scale: getNodeState("blockchain") !== "idle" ? 1.02 : 1 }}
        >
          <span className="text-xs font-mono text-payment">◆ Chain</span>
        </motion.div>

        {/* Facilitator */}
        <motion.div
          ref={facilitatorRef}
          className={`absolute right-[15%] bottom-[10%] w-28 h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-500 ${getNodeColor("facilitator")} ${getNodeGlow("facilitator")}`}
          animate={{ scale: getNodeState("facilitator") !== "idle" ? 1.02 : 1 }}
        >
          <span className="text-xs font-mono text-verified-bright">⬡ Facilitator</span>
        </motion.div>

        {/* Animated flow indicator */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-[45%] top-[55%] -translate-x-1/2 text-center"
          >
            <div
              className={`px-4 py-2 rounded-full border text-sm font-medium ${
                phases[currentPhase].state === "payment"
                  ? "border-payment text-payment glow-payment"
                  : phases[currentPhase].state === "verified"
                  ? "border-verified-bright text-verified-bright glow-verified"
                  : "border-foreground/30 text-foreground"
              }`}
            >
              {phases[currentPhase].label}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Play/Pause */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>
    </div>
  );
};
