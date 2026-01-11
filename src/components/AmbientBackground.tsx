"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Pulse {
  id: number;
  x: number;
  y: number;
  color: string;
  duration: number;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const PULSE_COLORS = [
  "rgba(157,78,221,0.22)", // Orchid
  "rgba(230,162,60,0.20)", // Amber
  "rgba(82,183,136,0.18)", // Jade
  "rgba(217,70,239,0.18)", // Magenta hint
  "rgba(29, 30, 31, 0.16)",
];

export function AmbientBackground() {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [spark, setSpark] = useState<Spark | null>(null);

  /* -----------------------------
      PULSES —
  ------------------------------*/
  useEffect(() => {
    const createPulse = () => {
      setPulses(prev => [
        ...prev.slice(-2),
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: PULSE_COLORS[Math.floor(Math.random() * PULSE_COLORS.length)],
          duration: 5 + Math.random() * 5, // faster
        },
      ]);
    };

    createPulse();
    const interval = setInterval(createPulse, 2000);

    return () => clearInterval(interval);
  }, []);

  /* -----------------------------
     SPARKS — BRIGHT
  ------------------------------*/
  useEffect(() => {
    const spawnSpark = () => {
      setSpark({
        id: Date.now(),
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        dx: (Math.random() - 0.5) * 60,
        dy: (Math.random() - 0.5) * 60,
      });

      setTimeout(() => setSpark(null), 800);
    };

    const loop = () => {
      setTimeout(() => {
        spawnSpark();
        loop();
      }, 100);
    };

    loop();
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1 }}
    >
      {/* BASE */}
      <div className="absolute inset-0 bg-[#0A0A00]" />

      {/* NOISE — STRONG */}
      {/* <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'>
              <filter id='noise'>
                <feTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='4'/>
              </filter>
              <rect width='100%' height='100%' filter='url(#noise)'/>
            </svg>
          `)}")`,
          opacity: 0.08,
        }}
      /> */}

      {/* PULSES */}
      <AnimatePresence>
        {pulses.map(pulse => (
          <motion.div
            key={pulse.id}
            className="absolute"
            style={{
              left: `${pulse.x}%`,
              top: `${pulse.y}%`,
              transform: "translate(-150%, -150%)",
            }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1.8 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: pulse.duration,
              ease: "linear",
            }}
          >
            <div
              style={{
                width: "90vw",
                height: "90vw",
                maxWidth: "1200px",
                maxHeight: "1200px",
                background: `radial-gradient(circle, ${pulse.color} 0%, transparent 60%)`,
                filter: "blur(40px)",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* SPARK */}
      <AnimatePresence>
        {spark && (
          <motion.div
            key={spark.id}
            className="absolute"
            style={{ left: `${spark.x}%`, top: `${spark.y}%` }}
            initial={{ opacity: 1, x: 0, y: 0 }}
            animate={{ opacity: 0, x: spark.dx, y: spark.dy }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#FAFAFA",
                boxShadow: "0 0 18px rgba(250,250,250,0.9)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
