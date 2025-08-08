import {Button} from "@/components/ui/button";
import {Bell} from "lucide-react";

export default function HeroSection({
                                        videoSrc,
                                        posterSrc,
                                        heroContent,
                                        onNotifyClick,
                                    }: {
    videoSrc: string;
    posterSrc?: string;
    heroContent?: { main_title?: string; sub_title?: string };
    onNotifyClick?: () => void;
}) {
    return (
        <section className="relative isolate min-h-screen w-full overflow-hidden bg-black">
            {/* Background video */}
            <video
                className="absolute inset-0 h-full w-full object-cover"
                src={videoSrc}
                poster={posterSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
            />

            {/* Subtle overlay to improve text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

            {/* Content */}
            <div className="relative z-10 flex min-h-screen items-center justify-center py-20 pt-32">
                <div className="container mx-auto px-4 text-center mt-4">
                    <div className="mx-auto max-w-screen">
                        <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl xl:text-7xl drop-shadow-2xl tracking-tighter"
                            style={{ fontFamily: "'NanumSquare', sans-serif" }}>
                            {heroContent?.main_title || (
                                <>
                                    당신의 '시점'에서
                                    <br className="sm:hidden" />
                                    {" "}세상을 봅니다
                                </>
                            )}
                        </h1>

                        <h2 className="mb-12 text-xl text-white/90 sm:text-3xl xl:text-4xl drop-shadow-lg tracking-normal max-w-3xl mx-auto"
                            style={{ fontFamily: "'NanumSquare', sans-serif" }}>
                            {heroContent?.sub_title || "당신만을 위한 뉴스 서비스, 시점"}
                        </h2>

                        {/*/!* Enhanced CTA button with blue theme *!/*/}
                        {/*<div className="flex flex-col justify-center gap-4 sm:flex-row">*/}
                        {/*    <Button*/}
                        {/*        size="lg"*/}
                        {/*        onClick={onNotifyClick}*/}
                        {/*        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 border border-blue-400/20"*/}
                        {/*    >*/}
                        {/*        <Bell className="mr-2 h-5 w-5" />*/}
                        {/*        앱 출시 알림 받기*/}
                        {/*    </Button>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>

            {/* Bottom gradient feather */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
        </section>
    );
}
