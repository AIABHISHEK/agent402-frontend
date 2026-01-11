import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface FacilitatorCardProps {
    name: string;
    endpoint: string;
    tokens: string[];
    id: string;
}

export function FacilitatorCard({
    name,
    endpoint,
    tokens,
    id,
}: FacilitatorCardProps) {
    const [copied, setCopied] = useState<string | null>(null);

    const copy = async (value: string, key: string) => {
        await navigator.clipboard.writeText(value);
        setCopied(key);
        setTimeout(() => setCopied(null), 1200);
    };

    return (
        <div
            className="rounded-xl backdrop-blur-md px-5 py-5 flex flex-col justify-between"
            style={{
                background: "rgba(10,10,11,0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            {/* Title */}
            <div className="mb-4">
                <div className="text-sm font-medium text-foreground">
                    {name}
                </div>
            </div>

            {/* Endpoint */}
            <div className="mb-4">
                <div className="text-[11px] text-muted-foreground mb-1">
                    Endpoint
                </div>
                <div className="flex items-center justify-between gap-3 font-mono text-sm text-foreground">
                    <span className="truncate">{endpoint}</span>
                    <button
                        onClick={() => copy(endpoint, "endpoint")}
                        className="p-2 -m-2 text-muted-foreground hover:text-foreground"
                    >
                        {copied === "endpoint" ? (
                            <Check size={14} />
                        ) : (
                            <Copy size={14} />
                        )}
                    </button>
                </div>
            </div>

            {/* Tokens */}
            <div className="mb-4">
                <div className="text-[11px] text-muted-foreground mb-2">
                    Accepted Tokens
                </div>
                <div className="flex flex-wrap gap-2">
                    {tokens.map(token => (
                        <span
                            key={token}
                            className="text-xs px-2 py-1 rounded-md"
                            style={{
                                background: "rgba(82,183,136,0.12)",
                                color: "#9AE6B4",
                            }}
                        >
                            {token}
                        </span>
                    ))}
                </div>
            </div>

            {/* Facilitator ID */}
            <div>
                <div className="text-[11px] text-muted-foreground mb-1">
                    Facilitator ID
                </div>
                <div className="flex items-center justify-between gap-3 font-mono text-sm text-foreground">
                    <span>{id}</span>
                    <button
                        onClick={() => copy(id, "id")}
                        className="p-2 -m-2 text-muted-foreground hover:text-foreground"
                    >
                        {copied === "id" ? (
                            <Check size={14} />
                        ) : (
                            <Copy size={14} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
