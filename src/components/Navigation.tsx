import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = () => {
    const location = useLocation();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explorer" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-wire bg-background/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo / Protocol Name */}
                <Link
                    to="/"
                    className="font-mono text-sm tracking-wider text-foreground hover:text-primary transition-colors"
                >
                    AGENT402
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors relative py-1",
                                location.pathname === link.href
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {link.label}
                            {location.pathname === link.href && (
                                <span className="absolute -bottom-[1px] left-0 right-0 h-px bg-foreground" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <a
                    href="https://docs.example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    Docs
                </a>
            </div>
        </nav>
    );
};

export default Navigation;
