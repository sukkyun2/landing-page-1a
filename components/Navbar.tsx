import Image from 'next/image';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-sm border-b border-white/10">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                            <Image
                                src="/logo.png"
                                alt="시점 로고"
                                width={120}
                                height={40}
                                className="h-8 w-auto"
                                priority
                            />
                    </div>

                    {/* Navigation items (optional, for future use) */}
                    <div className="hidden md:flex items-center space-x-8">
                        {/* Add navigation items here if needed */}
                    </div>
                </div>
            </div>
        </nav>
    );
}
