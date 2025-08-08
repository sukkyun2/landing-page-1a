import { Card } from "@/components/ui/card";

export default function FeaturesSection() {
    return (
        <section id="features" className="py-20" style={{ backgroundColor: '#121A23' }}>
            <div className="container mx-auto px-4">
                {/* 제목 영역 - 카드 폭과 맞춤 */}
                <div className="mb-16 max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-medium mb-4 text-white">
                        뉴스가 필요한 모든 순간, 시점
                    </h2>
                </div>

                {/* 카드 영역 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* 첫 번째 카드 */}
                    <Card className="flex flex-col justify-between p-8 hover:shadow-lg transition-all duration-300 border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                        <div>
                            <div className="flex items-baseline mb-4">
                                <div className="text-5xl font-bold text-white mr-3">74%</div>
                                <span className="text-gray-400 text-sm">의 사람들이 겪는 문제</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-6 leading-snug">
                                후속 기사가 궁금하지만 <br /> 까먹고 지나칩니다
                            </h3>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                시점과 함께라면, 더 이상 "그 사건은 어떻게 됐지?" 하고 검색하지 않아도 됩니다.
                            </p>
                        </div>
                        {/*<div className="mt-8 p-4 bg-gray-700/30 border border-gray-600/30 rounded-lg">*/}
                        {/*    <p className="text-gray-200 font-medium">*/}
                        {/*        사건의 시작부터 결말까지 후속 보도를 빠르게 알려드립니다*/}
                        {/*    </p>*/}
                        {/*</div>*/}
                    </Card>

                    {/* 두 번째 카드 */}
                    <Card className="flex flex-col justify-between p-8 hover:shadow-lg transition-all duration-300 border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                        <div>
                            <div className="flex items-baseline mb-4">
                                <div className="text-5xl font-bold text-white mr-3">90%</div>
                                <span className="text-gray-400 text-sm">시간 절약 효과</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-6 leading-snug">
                                내게 필요한 기사만 보고 싶다면, <br /> 시점입니다
                            </h3>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                관심 없는 기사로 피드를 채우지 않습니다. 오직 팔로우한 주제와 관심사 기반 뉴스만 제공합니다.
                            </p>
                        </div>
                        {/*<div className="mt-8 p-4 bg-gray-700/30 border border-gray-600/30 rounded-lg">*/}
                        {/*    <p className="text-gray-200 font-medium">*/}
                        {/*        필요한 정보만 얻고, 시간은 절약하세요*/}
                        {/*    </p>*/}
                        {/*</div>*/}
                    </Card>
                </div>

                {/* 추가 통계 섹션 */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="text-center p-6 bg-gray-800/30 rounded-lg border border-gray-700/50">
                        <div className="text-4xl font-bold text-white mb-2">5분</div>
                        <p className="text-gray-300">일평균 뉴스 소비 시간</p>
                        <p className="text-sm text-gray-400 mt-1">기존 대비 90% 단축</p>
                    </div>
                    <div className="text-center p-6 bg-gray-800/30 rounded-lg border border-gray-700/50">
                        <div className="text-4xl font-bold text-white mb-2">95%</div>
                        <p className="text-gray-300">관련성 높은 기사 제공</p>
                        <p className="text-sm text-gray-400 mt-1">AI 맞춤 추천 시스템</p>
                    </div>
                    <div className="text-center p-6 bg-gray-800/30 rounded-lg border border-gray-700/50">
                        <div className="text-4xl font-bold text-white mb-2">24/7</div>
                        <p className="text-gray-300">실시간 후속보도 알림</p>
                        <p className="text-sm text-gray-400 mt-1">놓치는 소식 없이</p>
                    </div>
                </div>
            </div>
        </section>
    );
}