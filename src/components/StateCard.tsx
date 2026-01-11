import { motion } from "framer-motion";
import { Lock, Zap, CheckCircle } from "lucide-react";

interface StateCardProps {
  variant: "denied" | "settlement" | "verified";
  index: number;
}

const cardConfig = {
  denied: {
    icon: Lock,
    label: "Payment Required",
    description: "Access locked until proof of payment",
    colorClass: "text-premium",
    borderClass: "border-premium/30 hover:border-premium/60",
    glowClass: "hover:glow-premium",
    bgClass: "bg-premium/5",
  },
  settlement: {
    icon: Zap,
    label: "On-chain Payment",
    description: "Transaction settles on-chain",
    colorClass: "text-payment",
    borderClass: "border-payment/30 hover:border-payment/60",
    glowClass: "hover:glow-payment",
    bgClass: "bg-payment/5",
  },
  verified: {
    icon: CheckCircle,
    label: "Access Granted",
    description: "Resource flows back to requester",
    colorClass: "text-verified-bright",
    borderClass: "border-verified/30 hover:border-verified/60",
    glowClass: "hover:glow-verified",
    bgClass: "bg-verified/5",
  },
};

export const StateCard = ({ variant, index }: StateCardProps) => {
  const config = cardConfig[variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      viewport={{ once: true }}
      className={`relative p-8 rounded-2xl border-2 transition-all duration-500 ${config.borderClass} ${config.glowClass} ${config.bgClass} group`}
    >
      {/* State number */}
      <div className="absolute -top-3 left-6 px-3 py-1 bg-background text-xs font-mono text-muted-foreground border border-border rounded-full">
        STATE {index + 1}
      </div>

      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl ${config.bgClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-6 h-6 ${config.colorClass}`} />
      </div>

      {/* Label */}
      <h3 className={`text-xl font-semibold mb-2 ${config.colorClass}`}>
        {config.label}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground">
        {config.description}
      </p>

      {/* Visual accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl ${config.bgClass} opacity-50`} />
    </motion.div>
  );
};
