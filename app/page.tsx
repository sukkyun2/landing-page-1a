"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Clock, Bell, Smartphone, ArrowRight, X, Heart, Share } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// 샘플 뉴스 데이터
const sampleNews = [
  {
    id: 1,
    title: "삼성전자, AI 반도체 시장 점유율 1위 달성",
    summary: "삼성전자가 글로벌 AI 반도체 시장에서 점유율 1위를 기록했다고 발표했습니다.",
    category: "기술",
    readTime: "2분",
    image: "/placeholder.svg?height=400&width=400",
    source: "테크뉴스",
    publishedAt: "1시간 전",
  },
  {
    id: 2,
    title: "국내 스타트업, 해외 투자 유치 급증",
    summary: "올해 국내 스타트업들의 해외 투자 유치 규모가 전년 대비 150% 증가했습니다.",
    category: "경제",
    readTime: "3분",
    image: "/placeholder.svg?height=400&width=400",
    source: "비즈니스타임즈",
    publishedAt: "2시간 전",
  },
]

// 스토리 뷰어 컴포넌트
function StoryViewer({
  news,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: {
  news: typeof sampleNews
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}) {
  const currentNews = news[currentIndex]
  const progress = ((currentIndex + 1) / news.length) * 100

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    if (x < width / 2) {
      onPrev()
    } else {
      onNext()
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md h-full bg-black">
        {/* 진행 바 */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <Progress value={progress} className="h-1 bg-gray-600" />
        </div>

        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-white hover:text-gray-300">
          <X className="w-6 h-6" />
        </button>

        {/* 메인 콘텐츠 */}
        <div className="relative w-full h-full cursor-pointer" onClick={handleTap}>
          <Image src={currentNews.image || "/placeholder.svg"} alt={currentNews.title} fill className="object-cover" />

          {/* 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* 텍스트 콘텐츠 */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <Badge variant="secondary" className="mb-2">
              {currentNews.category}
            </Badge>
            <h2 className="text-xl font-bold mb-2 leading-tight">{currentNews.title}</h2>
            <p className="text-gray-200 text-sm mb-4 leading-relaxed">{currentNews.summary}</p>
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>{currentNews.source}</span>
              <span>{currentNews.readTime} 읽기</span>
            </div>
          </div>
        </div>

        {/* 네비게이션 힌트 */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/60 text-xs">
          탭하여 다음 기사 보기
        </div>
      </div>
    </div>
  )
}

// 이메일 수집 모달 컴포넌트
function EmailModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const topics = ["기술", "경제", "정치", "사회", "문화", "스포츠", "국제", "라이프스타일"]

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !agreedToTerms) return

    setIsSubmitting(true)
    // 여기서 실제 이메일 수집 로직 구현
    await new Promise((resolve) => setTimeout(resolve, 1000)) // 시뮬레이션

    alert(`알림 신청이 완료되었습니다!\n이메일: ${email}\n관심 토픽: ${selectedTopics.join(", ")}`)
    setIsSubmitting(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">앱 출시 알림 받기</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일 주소
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                관심있는 토픽을 선택해주세요 (복수 선택 가능)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTopics.includes(topic)
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                개인정보 수집 및 이용에 동의합니다. 수집된 정보는 앱 출시 알림 목적으로만 사용되며, 언제든지 구독을
                취소할 수 있습니다.
              </label>
            </div>

            <Button
              type="submit"
              disabled={!email || !agreedToTerms || isSubmitting}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>처리 중...</>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  알림 신청하기
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

// 뉴스 피드 컴포넌트
function NewsFeed() {
  const [selectedNewsIndex, setSelectedNewsIndex] = useState<number | null>(null)

  const openStory = (index: number) => {
    setSelectedNewsIndex(index)
  }

  const closeStory = () => {
    setSelectedNewsIndex(null)
  }

  const nextStory = () => {
    if (selectedNewsIndex !== null) {
      setSelectedNewsIndex((selectedNewsIndex + 1) % sampleNews.length)
    }
  }

  const prevStory = () => {
    if (selectedNewsIndex !== null) {
      setSelectedNewsIndex(selectedNewsIndex === 0 ? sampleNews.length - 1 : selectedNewsIndex - 1)
    }
  }

  return (
    <div className="w-full h-[600px] overflow-y-auto scrollbar-hide">
      <div className="space-y-3">
        {sampleNews.map((news, index) => (
          <Card
            key={news.id}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex-shrink-0"
            onClick={() => openStory(index)}
          >
            <div className="flex items-center p-3 border-b">
              <Avatar className="w-8 h-8 mr-3">
                <AvatarFallback>{news.source[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{news.source}</p>
                <p className="text-xs text-gray-500">{news.publishedAt}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {news.category}
              </Badge>
            </div>

            <div className="relative">
              <Image
                src={news.image || "/placeholder.svg"}
                alt={news.title}
                width={400}
                height={200}
                className="w-full aspect-[2/1] object-cover"
              />
            </div>

            <CardContent className="p-3">
              <h3 className="font-bold text-sm mb-2 line-clamp-2">{news.title}</h3>
              <p className="text-gray-600 text-xs mb-3 line-clamp-2">{news.summary}</p>

              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">좋아요</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-teal-500">
                    <Bell className="w-4 h-4" />
                    <span className="text-xs">알림</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500">
                    <Share className="w-4 h-4" />
                    <span className="text-xs">공유</span>
                  </button>
                </div>
                <span className="text-xs text-gray-400">{news.readTime}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 스토리 뷰어 */}
      {selectedNewsIndex !== null && (
        <StoryViewer
          news={sampleNews}
          currentIndex={selectedNewsIndex}
          onClose={closeStory}
          onNext={nextStory}
          onPrev={prevStory}
        />
      )}
    </div>
  )
}

export default function LandingPage() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="시점 로고" width={32} height={32} className="w-8 h-8" />
            <span className="font-bold text-xl">시점</span>
          </div>

          <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
            시작하기
          </Button>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              직장인이 뉴스를 소비할 시간이 없죠?
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">우리가 해결해드립니다</h2>
            <p className="text-xl text-gray-600 mb-8">
              인스타그램처럼 쉽고 빠르게 뉴스를 소비하세요.
              <br />
              <span className="font-semibold text-teal-600">후속기사 알림도 할 수 있어요!</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={() => setIsEmailModalOpen(true)}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
              >
                <Bell className="w-5 h-5 mr-2" />앱 출시 알림 받기
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold mb-1">2분 안에</h3>
                <p className="text-gray-600 text-sm">하루 주요 뉴스 완독</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-3">
                  <Image src="/logo.svg" alt="시점" width={24} height={24} className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-1">스토리 형태</h3>
                <p className="text-gray-600 text-sm">탭 한 번으로 다음 뉴스</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold mb-1">스마트 알림</h3>
                <p className="text-gray-600 text-sm">후속 기사 자동 알림</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 데모 섹션 */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">직접 체험해보세요</h2>
            <p className="text-gray-600 text-lg">인스타그램처럼 쉽고 빠른 뉴스 소비 경험</p>
          </div>

          <div className="max-w-sm mx-auto">
            <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl">
              <div className="bg-white rounded-[2rem] overflow-hidden" style={{ height: "720px" }}>
                <div className="bg-gray-900 h-6 rounded-t-[2rem] flex items-center justify-center">
                  <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
                </div>
                <div className="p-4 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">오늘의 뉴스</h3>
                    <Badge variant="secondary">실시간</Badge>
                  </div>
                  <NewsFeed />
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-gray-500 text-sm">💡 뉴스 카드를 클릭하면 스토리 모드로 볼 수 있어요</p>
            </div>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">왜 시점을 선택해야 할까요?</h2>
            <p className="text-gray-600 text-lg">바쁜 직장인을 위한 특별한 기능들</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">모바일 최적화</h3>
              <p className="text-gray-600">출퇴근길, 점심시간에 언제든지 편리하게 뉴스를 확인하세요.</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Image src="/logo.svg" alt="시점" width={24} height={24} className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">빠른 소비</h3>
              <p className="text-gray-600">핵심만 요약된 뉴스로 2-3분 안에 하루 이슈를 파악하세요.</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">후속 알림</h3>
              <p className="text-gray-600">관심 있는 뉴스의 후속 기사가 나오면 자동으로 알려드려요.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-gradient-to-r from-teal-500 to-cyan-500">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">지금 시작해보세요</h2>
            <p className="text-xl mb-8 opacity-90">바쁜 일상 속에서도 놓치지 않는 뉴스 소비의 새로운 경험</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setIsEmailModalOpen(true)}
                className="bg-white text-teal-600 hover:bg-gray-100"
              >
                <Bell className="w-5 h-5 mr-2" />앱 출시 알림 받기
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-teal-600 bg-transparent"
              >
                웹에서 시작하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/logo.svg" alt="시점 로고" width={32} height={32} className="w-8 h-8" />
                <span className="font-bold text-xl">시점</span>
              </div>
              <p className="text-gray-400">직장인을 위한 스마트 뉴스 요약 서비스</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    뉴스 피드
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    알림 설정
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    카테고리
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    소개
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    채용
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    블로그
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    고객센터
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    개인정보처리방침
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            &copy; 2024 시점. All rights reserved.
          </div>
        </div>
      </footer>

      {/* 이메일 모달 추가 */}
      <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />
    </div>
  )
}
