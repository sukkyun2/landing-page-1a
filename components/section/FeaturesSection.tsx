import { Card } from "@/components/ui/card";

export default function FeaturesSection() {
    return (
        <section id="features" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* 제목 영역 - 카드 폭과 맞춤 */}
                <div className="mb-16 max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-medium mb-4 text-gray-900">
                        뉴스가 필요한 모든 순간, 시점
                    </h2>
                </div>

                {/* 카드 영역 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* 첫 번째 카드 */}
                    <Card className="flex flex-col justify-between p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
                        <div>
                            <div className="flex items-baseline mb-4">
                                <div className="text-5xl font-bold text-gray-900 mr-3">74%</div>
                                <span className="text-gray-600 text-sm">의 사람들이 겪는 문제</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 leading-snug">
                                후속 기사가 궁금하지만 <br /> 까먹고 지나칩니다
                            </h3>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                시점과 함께라면, 더 이상 "그 사건은 어떻게 됐지?" 하고 검색하지 않아도 됩니다.
                            </p>
                        </div>
                    </Card>

                    {/* 두 번째 카드 */}
                    <Card className="flex flex-col justify-between p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
                        <div>
                            <div className="flex items-baseline mb-4">
                                <div className="text-5xl font-bold text-gray-900 mr-3">90%</div>
                                <span className="text-gray-600 text-sm">시간 절약 효과</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 leading-snug">
                                내게 필요한 기사만 보고 싶다면, <br /> 시점입니다
                            </h3>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                관심 없는 기사로 피드를 채우지 않습니다. 오직 팔로우한 주제와 관심사 기반 뉴스만 제공합니다.
                            </p>
                        </div>
                    </Card>
                </div>

                {/* 새로운 기능 카드 영역 */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* 원하는 주제만 팔로우 */}
                    <Card className="p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">
                                원하는 주제만 팔로우
                            </h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            스포츠, 정치, 연예 등 거대한 카테고리부터<br />
                            'AI 트렌드', '해외축구 이적설'과 같은 세부 주제들을 팔로우해보세요.
                        </p>
                    </Card>

                    {/* 추천 뉴스 피드 */}
                    <Card className="p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">
                                추천 뉴스 피드
                            </h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            '시점 AI'만의 기술력으로
                            당신이 궁금해할 만한 소식만 보여드려요.
                        </p>
                    </Card>

                    {/* 후속 기사 알림 */}
                    <Card className="p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 2.828A4 4 0 015.5 2h9A4 4 0 0118 6v7a4 4 0 01-1.172 2.828L15 17.828A4 4 0 0112 19H5.5a4 4 0 01-4-4v-9a4 4 0 011.172-2.828z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">
                                후속 기사 알림
                            </h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            후속 기사가 궁금한 사건이 있다면?
                            '알림 설정'만 눌러주세요.<br />
                            후속 기사 발행 시 5분 내로 보내드려요.
                        </p>
                    </Card>
                </div>

                {/* 추가 통계 섹션 */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-4xl font-bold text-gray-900 mb-2">5분</div>
                        <p className="text-gray-700">일평균 뉴스 소비 시간</p>
                        <p className="text-sm text-gray-600 mt-1">기존 대비 90% 단축</p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
                        <p className="text-gray-700">관련성 높은 기사 제공</p>
                        <p className="text-sm text-gray-600 mt-1">AI 맞춤 추천 시스템</p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
                        <p className="text-gray-700">실시간 후속보도 알림</p>
                        <p className="text-sm text-gray-600 mt-1">놓치는 소식 없이</p>
                    </div>
                </div>
            </div>
        </section>
    );
}