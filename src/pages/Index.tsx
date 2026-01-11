import { motion } from "framer-motion";
import { SequenceDiagram } from "@/components/SequenceDiagram";
import { StateCard } from "@/components/StateCard";
import { FacilitatorVisual } from "@/components/FacilitatorVisual";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalPill } from "@/components/SignalPill";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { FacilitatorCard } from "@/components/Facilitatorcard";
import Navigation from "@/components/Navigation";

const signals = [
  "Agent monetization",
  "Protocol-level enforcement",
  "Crypto-native settlement",
  "Autonomous by design",
];

const Index = () => {
  return (
    <div className="min-h-screen text-foreground relative">
      {/* Ambient Background Layer */}
      <AmbientBackground />

      {/* Navigation */}
      {/* <nav className="relative z-10 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-mono font-semibold text-foreground">⬡</span>
            <span className="text-sm font-medium text-foreground">Protocol</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Architecture
            </Button>
            <Button variant="ghost" size="sm">
              Docs
            </Button>
            <Button variant="protocol" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </nav> */}
      <Navigation />
      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-6xl mx-auto px-6">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
              Autonomous agents transact
              <br />
              <span className="text-muted-foreground">by default.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Programmable payment-gated access between AI agents.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex justify-center gap-4 mb-20"
          >
            <Button variant="hero" size="lg">
              View Architecture
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="hero-outline" size="lg">
              <BookOpen className="w-4 h-4" />
              SDK Docs
            </Button>
          </motion.div>

          {/* Sequence Diagram - Center Stage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <SequenceDiagram />
          </motion.div>
        </div>
      </section>

      {/* State Transitions Section */}
      <section className="relative z-10 py-24 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono text-muted-foreground text-center mb-12 tracking-widest uppercase"
          >
            State Transitions
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            <StateCard variant="denied" index={0} />
            <StateCard variant="settlement" index={1} />
            <StateCard variant="verified" index={2} />
          </div>
        </div>
      </section>

      {/* Facilitator Section */}
      <section className="relative z-10 py-24 border-t border-border/50">
        
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-xs font-mono text-muted-foreground mb-4 tracking-widest uppercase">
              Trust Without Trust
            </h2>
            <p className="text-2xl font-medium text-foreground">
              The Facilitator
            </p>
            <section className="relative z-10 py-24 border-t border-border/50">
              <div className="max-w-6xl mx-auto px-6">

                {/* Header */}
                <div className="mb-14 text-center">
                  <h3 className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-3">
                    Facilitator Endpoints
                  </h3>
                  <p className="text-lg text-foreground/90">
                    Verified facilitator instances used by agents to resolve payment proofs.
                  </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FacilitatorCard
                    name="Primary Facilitator"
                    endpoint="https://facilitator.mainnet.yourdomain.xyz"
                    tokens={["ETH", "USDC"]}
                    id="0x9fA3…c81D"
                  />

                  <FacilitatorCard
                    name="Base Network"
                    endpoint="https://facilitator.base.yourdomain.xyz"
                    tokens={["ETH", "USDC"]}
                    id="0xB21D…91Ae"
                  />

                  <FacilitatorCard
                    name="Testnet"
                    endpoint="https://facilitator.testnet.yourdomain.xyz"
                    tokens={["ETH"]}
                    id="0x44C9…77D2"
                  />
                </div>
              </div>
            </section>
          </motion.div>

          <FacilitatorVisual />
        </div>
          {/* <FacilitatorCard /> */}
      </section>

      {/* SDK Section */}
      <section className="relative z-10 py-24 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-xs font-mono text-muted-foreground mb-4 tracking-widest uppercase">
              SDK Retry Model
            </h2>
            <p className="text-xl text-foreground">
              Simple proof-of-payment pattern
            </p>
          </motion.div>

          <CodeBlock />
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="relative z-10 py-24 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono text-muted-foreground text-center mb-12 tracking-widest uppercase"
          >
            Why This Matters
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-3">
            {signals.map((signal, i) => (
              <SignalPill key={signal} text={signal} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-32 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-medium text-foreground mb-12"
          >
            Infrastructure for agent economies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center gap-4"
          >
            <Button variant="hero" size="xl">
              Read Docs
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="hero-outline" size="xl">
              Start Building
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted-foreground">⬡ Protocol</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Machine-to-machine economy
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
