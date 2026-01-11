import Navigation from "@/components/Navigation";
import { AmbientBackground } from "@/components/AmbientBackground";
import ExplorerTable from "@/components/ExplorerTable";

const Explore = () => {
    return (
        <div className="min-h-screen text-foreground relative">
            {/* Ambient Background Layer */}
            <AmbientBackground />

            {/* Navigation */}
            <Navigation />

            {/* Main Content */}
            <main className="relative z-10 pt-24 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Page Header */}
                    <header className="mb-12">
                        <h1 className="text-xl font-medium text-foreground mb-1">
                            Explore
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Protocol activity feed
                        </p>
                    </header>

                    {/* Activity Table */}
                    <ExplorerTable />
                </div>
            </main>
        </div>
    );
};

export default Explore;
