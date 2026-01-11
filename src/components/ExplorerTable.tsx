import { useState, useMemo, useEffect, useRef } from "react";
import { ExternalLink, Copy, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface AgentPayment {
    id: string;
    timestamp: Date;
    agentFrom: {
        name: string;
        address: string;
    };
    agentTo: {
        name: string;
        address: string;
    };
    amount: string;
    token: string;
    txHash: string;
    chain: string;
}

// Mock data for demonstration
const mockPayments: AgentPayment[] = [
    {
        id: "1",
        timestamp: new Date("2026-01-10T14:32:18"),
        agentFrom: { name: "DataOracle", address: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12" },
        agentTo: { name: "PremiumAnalytics", address: "0xdef456789012345678901234567890abcdef4567" },
        amount: "0.024",
        token: "ETH",
        txHash: "0x9fa3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0c81d",
        chain: "ethereum"
    },
    {
        id: "2",
        timestamp: new Date("2026-01-10T14:28:45"),
        agentFrom: { name: "MarketBot", address: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234" },
        agentTo: { name: "TradingEngine", address: "0xabc123456789012345678901234567890abcdef89" },
        amount: "0.156",
        token: "ETH",
        txHash: "0x8eb4a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9a2f1",
        chain: "ethereum"
    },
    {
        id: "3",
        timestamp: new Date("2026-01-10T14:15:02"),
        agentFrom: { name: "ContentGen", address: "0x3c4d5e6f7890abcdef1234567890abcdef123456" },
        agentTo: { name: "ImageProcessor", address: "0x789012345678901234567890abcdef1234567890ab" },
        amount: "0.008",
        token: "ETH",
        txHash: "0x7dc5b0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8b3e2",
        chain: "ethereum"
    },
    {
        id: "4",
        timestamp: new Date("2026-01-10T13:58:33"),
        agentFrom: { name: "ResearchAgent", address: "0x4d5e6f7890abcdef1234567890abcdef12345678" },
        agentTo: { name: "DataOracle", address: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12" },
        amount: "0.042",
        token: "ETH",
        txHash: "0x6cb6a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1c4d3",
        chain: "ethereum"
    },
    {
        id: "5",
        timestamp: new Date("2026-01-10T13:42:11"),
        agentFrom: { name: "PremiumAnalytics", address: "0xdef456789012345678901234567890abcdef4567" },
        agentTo: { name: "ReportGen", address: "0x5e6f7890abcdef1234567890abcdef1234567890" },
        amount: "0.018",
        token: "ETH",
        txHash: "0x5ba7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6d5e4",
        chain: "ethereum"
    },
];

interface AgentPayment {
    id: string;
    timestamp: Date;
    agentFrom: {
        name: string;
        address: string;
    };
    agentTo: {
        name: string;
        address: string;
    };
    amount: string;
    token: string;
    txHash: string;
    chain: string;
}

const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    return `${day} ${month} ${year} · ${time}`;
};

const truncateAddress = (address: string): string => {
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
};

const truncateHash = (hash: string): string => {
    return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
};

const formatToken = (token: string): string => {
    if (!token) return "";
    // keep short tokens (symbols) as-is, truncate long values (addresses)
    return token.length > 12 ? `${token.slice(0, 6)}…${token.slice(-4)}` : token;
};

const getExplorerUrl = (hash: string, chain: string): string => {
    const explorers: Record<string, string> = {
        ethereum: "https://etherscan.io/tx/",
        polygon: "https://polygonscan.com/tx/",
        arbitrum: "https://arbiscan.io/tx/",
    };
    return `${explorers[chain] || explorers.ethereum}${hash}`;
};

const mapRecordToPayment = (rec: Record<string, unknown>): AgentPayment => {
    const intent = (rec?.signedIntent as Record<string, unknown>)?.intent as Record<string, unknown> || {};
    const sender = (intent.sender as string) || "";
    const receiver = (intent.receiver as string) || "";
    const createdAt = rec.created_at ? new Date(rec.created_at as string | number) : (rec.createdAt ? new Date((rec.createdAt as number) * 1000) : new Date());
    const networkId = (intent.networkId as string) || "ethereum";
    const chain = networkId.split("-")[0] || "ethereum";

    return {
        id: (rec._id as string) || (intent.intentId as string) || Math.random().toString(36).slice(2),
        timestamp: createdAt,
        agentFrom: { name: sender, address: sender },
        agentTo: { name: receiver, address: receiver },
        amount: (intent.amount as string) || "0",
        token: (intent.token as string) || "",
        txHash: (rec.txHash as string) || "",
        chain,
    };
};

interface AddressCellProps {
    name: string;
    address: string;
}

const AddressCell = ({ name, address }: AddressCellProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-foreground text-sm truncate block max-w-[220px]">{name}</span>
            <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group"
            >
                <span className="font-mono text-xs">{truncateAddress(address)}</span>
                {copied ? (
                    <Check className="w-3 h-3 text-verified" />
                ) : (
                    <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </button>
        </div>
    );
};

const SkeletonRow = () => (
    <tr className="border-b border-wire">
        <td className="py-4 px-4"><div className="h-4 w-32 bg-wire rounded animate-pulse" /></td>
        <td className="py-4 px-4">
            <div className="flex flex-col gap-1">
                <div className="h-4 w-24 bg-wire rounded animate-pulse" />
                <div className="h-3 w-20 bg-wire rounded animate-pulse" />
            </div>
        </td>
        <td className="py-4 px-4">
            <div className="flex flex-col gap-1">
                <div className="h-4 w-24 bg-wire rounded animate-pulse" />
                <div className="h-3 w-20 bg-wire rounded animate-pulse" />
            </div>
        </td>
        <td className="py-4 px-4 text-right"><div className="h-4 w-16 bg-wire rounded animate-pulse ml-auto" /></td>
        <td className="py-4 px-4"><div className="h-4 w-24 bg-wire rounded animate-pulse" /></td>
    </tr>
);

interface ExplorerTableProps {
    isLoading?: boolean;
}

const ExplorerTable = ({ isLoading = false }: ExplorerTableProps) => {
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [remoteLoading, setRemoteLoading] = useState(false);
    const [payments, setPayments] = useState<AgentPayment[]>(mockPayments);

    const [searchResults, setSearchResults] = useState<AgentPayment[] | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const searchLastRef = useRef("");

    const loadingState = isLoading || remoteLoading || isSearching;

    const fetchLatest = async () => {
        try {
            setRemoteLoading(true);
            const res = await fetch("https://mnee.facilitator.agent402.tech/records/latest");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            if (!Array.isArray(data)) return;

            const mapped = data.map(mapRecordToPayment);

            setPayments(mapped);
        } catch (e) {
            console.error("Failed to fetch latest records", e);
        } finally {
            setRemoteLoading(false);
        }
    };

    const fetchSearch = async (query: string) => {
        const q = query.trim();
        if (!q) {
            setSearchResults(null);
            setIsSearching(false);
            return;
        }

        try {
            setIsSearching(true);
            searchLastRef.current = q;
            const res = await fetch(
                `https://mnee.facilitator.agent402.tech/records/search?q=${encodeURIComponent(q)}`
            );
            if (!res.ok) throw new Error("Search failed");
            const data = await res.json();
            if (!Array.isArray(data)) {
                setSearchResults([]);
                return;
            }
            // ensure response corresponds to latest query
            if (searchLastRef.current !== q) return;

            const mapped = data.map(mapRecordToPayment);
            setSearchResults(mapped);
        } catch (e) {
            console.error("Search failed", e);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        // initial fetch
        fetchLatest();

        // poll every 60s
        const id = setInterval(fetchLatest, 60_000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once

    // Debounced search effect: call /records/search when query changes
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults(null);
            return;
        }

        const t = setTimeout(() => fetchSearch(searchQuery), 350);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    const filteredPayments = useMemo(() => {
        if (searchQuery.trim()) return searchResults ?? [];
        return payments;
    }, [searchQuery, searchResults, payments]);

    if (loadingState) {
        return (
            <div className="w-full overflow-hidden">
                {/* Desktop Table */}
                <table className="w-full hidden md:table">
                    <thead>
                        <tr className="border-b border-wire">
                            <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date – Time</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Agent From</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Agent To</th>
                            <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Txn Hash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <SkeletonRow key={i} />
                        ))}
                    </tbody>
                </table>

                {/* Mobile Skeleton Cards */}
                <div className="md:hidden space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-4 border border-wire rounded-lg bg-card">
                            <div className="space-y-3">
                                <div className="h-4 w-3/4 bg-wire rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-wire rounded animate-pulse" />
                                <div className="h-3 w-2/3 bg-wire rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden">
            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by agent, address, or txn hash..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-card border-wire font-mono text-sm placeholder:font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-wire"
                    />
                </div>
            </div>

            {/* Empty State */}
            {filteredPayments.length === 0 && (
                <div className="flex items-center justify-center py-24">
                    <p className="text-muted-foreground text-sm">
                        {searchQuery ? "No matching transactions found." : "No agent-to-agent payments recorded yet."}
                    </p>
                </div>
            )}
            {/* Desktop Table */}
            {filteredPayments.length > 0 && (
                <table className="w-full hidden md:table">
                    <thead>
                        <tr className="border-b border-wire">
                            <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[180px]">
                                Date – Time
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Agent From
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Agent To
                            </th>
                            <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-[120px]">
                                Amount
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[140px]">
                                Txn Hash
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map((payment) => (
                            <tr
                                key={payment.id}
                                className={cn(
                                    "border-b border-wire transition-colors",
                                    hoveredRow === payment.id && "bg-wire/50"
                                )}
                                onMouseEnter={() => setHoveredRow(payment.id)}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                <td className="py-4 px-4">
                                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                                        {formatDate(payment.timestamp)}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <AddressCell name={payment.agentFrom.name} address={payment.agentFrom.address} />
                                </td>
                                <td className="py-4 px-4">
                                    <AddressCell name={payment.agentTo.name} address={payment.agentTo.address} />
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <span className="font-mono text-sm text-foreground font-medium">
                                        {payment.amount} {formatToken(payment.token)}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <a
                                        href={payment.txHash ? getExplorerUrl(payment.txHash, payment.chain) : '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors group"
                                    >
                                        <span>{payment.txHash ? truncateHash(payment.txHash) : '-'}</span>
                                        {payment.txHash && (
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Mobile Cards */}
            {filteredPayments.length > 0 && (
                <div className="md:hidden space-y-3">
                    {filteredPayments.map((payment) => (
                        <div
                            key={payment.id}
                            className="p-4 border border-wire rounded-lg bg-card"
                        >
                            {/* Agent Flow */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground truncate">{payment.agentFrom.name}</p>
                                    <button
                                        onClick={async () => {
                                            await navigator.clipboard.writeText(payment.agentFrom.address);
                                        }}
                                        className="font-mono text-xs text-muted-foreground"
                                    >
                                        {truncateAddress(payment.agentFrom.address)}
                                    </button>
                                </div>
                                <span className="text-muted-foreground text-xs">→</span>
                                <div className="flex-1 min-w-0 text-right">
                                    <p className="text-sm text-foreground truncate">{payment.agentTo.name}</p>
                                    <button
                                        onClick={async () => {
                                            await navigator.clipboard.writeText(payment.agentTo.address);
                                        }}
                                        className="font-mono text-xs text-muted-foreground"
                                    >
                                        {truncateAddress(payment.agentTo.address)}
                                    </button>
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="mb-3">
                                <span className="font-mono text-lg text-foreground font-medium">
                                    {payment.amount} {formatToken(payment.token)}
                                </span>
                            </div>

                            {/* Date & Txn */}
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-mono text-muted-foreground tabular-nums">
                                    {formatDate(payment.timestamp)}
                                </span>
                                <a
                                    href={getExplorerUrl(payment.txHash, payment.chain)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 font-mono text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <span>{truncateHash(payment.txHash)}</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Load More */}
            {filteredPayments.length > 0 && (
                <div className="flex justify-center py-8">
                    <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Load more
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExplorerTable;