"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Clock, Bell, Smartphone, ArrowRight, X, Heart, Star } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { getNewsArticles, type NewsArticle } from "@/lib/news"
import { getClientInfo, type ClientInfo } from "@/lib/client-info"

// 필요한 import 추가
import { getHeroContent, type HeroContent } from "@/lib/hero-content"
import { trackUserInteraction, setupExitTracking } from "@/lib/user-tracking"

// 뉴스 데이터는 이제 동적으로 로드됩니다

// 스토리 뷰어 컴포넌트
function StoryViewer({
  news,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: {
  news: NewsArticle[]
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
          <Image
            src={currentNews.image_url || "/placeholder.svg"}
            alt={currentNews.title}
            fill
            className="object-cover"
          />

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
              <span>{currentNews.read_time} 읽기</span>
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
  const [interests, setInterests] = useState("")
  const [expectedFeatures, setExpectedFeatures] = useState<string[]>([])
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null)

  // 모달이 열릴 때 클라이언트 정보 수집
  useEffect(() => {
    if (isOpen && !clientInfo) {
      getClientInfo().then(setClientInfo)
    }
  }, [isOpen, clientInfo])

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setExpectedFeatures((prev) => [...prev, feature])
    } else {
      setExpectedFeatures((prev) => prev.filter((f) => f !== feature))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !agreedToTerms) return

    setIsSubmitting(true)

    try {
      // Check if Supabase is available
      if (!supabase) {
        // Fallback behavior when Supabase is not configured
        console.log("Supabase not configured. Form data:", {
          email,
          interests: interests || null,
          expected_features: expectedFeatures,
          ip_address: clientInfo?.ip_address || null,
          referrer_source: clientInfo?.referrer_source || null,
        })

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        alert(
          `알림 신청이 완료되었습니다! (데모 모드)\n이메일: ${email}\n관심 주제: ${interests}\n기대 기능: ${expectedFeatures.join(", ")}`,
        )

        onClose()
        // 폼 초기화
        setEmail("")
        setInterests("")
        setExpectedFeatures([])
        setAgreedToTerms(false)
        return
      }

      // Supabase is available, proceed with database insertion
      const { data, error } = await supabase.from("email_signups").insert([
        {
          email,
          interests: interests || null,
          expected_features: expectedFeatures,
          ip_address: clientInfo?.ip_address || null,
          referrer_source: clientInfo?.referrer_source || null,
        },
      ])

      if (error) {
        if (error.code === "23505") {
          // 중복 이메일 에러
          alert("이미 등록된 이메일입니다.")
        } else {
          throw error
        }
      } else {
        alert(
          `알림 신청이 완료되었습니다!\n이메일: ${email}\n관심 주제: ${interests}\n기대 기능: ${expectedFeatures.join(", ")}`,
        )
        onClose()
        // 폼 초기화
        setEmail("")
        setInterests("")
        setExpectedFeatures([])
        setAgreedToTerms(false)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("알림 신청 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
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
              <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
                관심 주제를 입력해주세요
              </label>
              <textarea
                id="interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder="예: 기술, 경제, 스타트업, AI 등"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">관심있는 주제를 자유롭게 입력해주세요 (선택사항)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">가장 기대되는 기능을 선택해주세요</label>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="timeline-feature"
                    checked={expectedFeatures.includes("타임라인 형태의 기사")}
                    onChange={(e) => handleFeatureChange("타임라인 형태의 기사", e.target.checked)}
                    className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <div>
                    <label htmlFor="timeline-feature" className="text-sm font-medium text-gray-700">
                      타임라인 형태의 기사
                    </label>
                    <p className="text-xs text-gray-500 mt-1">인스타그램 스토리처럼 탭으로 넘기며 뉴스를 빠르게 소비</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="followup-feature"
                    checked={expectedFeatures.includes("후속기사 알림")}
                    onChange={(e) => handleFeatureChange("후속기사 알림", e.target.checked)}
                    className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <div>
                    <label htmlFor="followup-feature" className="text-sm font-medium text-gray-700">
                      후속기사 알림
                    </label>
                    <p className="text-xs text-gray-500 mt-1">관심있는 뉴스의 후속 소식을 놓치지 않고 받아보기</p>
                  </div>
                </div>
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
  const [newsData, setNewsData] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadNews = async () => {
      try {
        const articles = await getNewsArticles()
        setNewsData(articles)
      } catch (error) {
        console.error("Failed to load news:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNews()
  }, [])

  const openStory = (index: number) => {
    setSelectedNewsIndex(index)
  }

  const closeStory = () => {
    setSelectedNewsIndex(null)
  }

  const nextStory = () => {
    if (selectedNewsIndex !== null) {
      setSelectedNewsIndex((selectedNewsIndex + 1) % newsData.length)
    }
  }

  const prevStory = () => {
    if (selectedNewsIndex !== null) {
      setSelectedNewsIndex(selectedNewsIndex === 0 ? newsData.length - 1 : selectedNewsIndex - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">뉴스를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[600px] overflow-y-auto scrollbar-hide">
      <div className="space-y-3">
        {newsData.map((news, index) => (
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
                <p className="text-xs text-gray-500">{news.published_at}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {news.category}
              </Badge>
            </div>

            <div className="relative">
              <Image
                src={news.image_url || "/placeholder.svg"}
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
                </div>
                <span className="text-xs text-gray-400">{news.read_time}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 스토리 뷰어 */}
      {selectedNewsIndex !== null && newsData.length > 0 && (
        <StoryViewer
          news={newsData}
          currentIndex={selectedNewsIndex}
          onClose={closeStory}
          onNext={nextStory}
          onPrev={prevStory}
        />
      )}
    </div>
  )
}

// 별점 평가 모달 컴포넌트
function ServiceRatingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const options = [
    { value: "want_to_use", label: "써보고 싶어요", emoji: "😍" },
    { value: "dont_want_to_use", label: "안쓰고 싶어요", emoji: "😕" },
    { value: "not_sure", label: "잘 모르겠어요", emoji: "🤔" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOption) return

    setIsSubmitting(true)

    try {
      // Check if Supabase is available
      if (!supabase) {
        // Fallback behavior when Supabase is not configured
        console.log("Supabase not configured. Form data:", {
          rating_type: selectedOption,
          feedback: feedback || null,
        })

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        localStorage.setItem("hasRatedService", "true")
        setHasSubmitted(true)

        // 3초 후 모달 닫기
        setTimeout(() => {
          onClose()
        }, 3000)
        return
      }

      // Supabase is available, proceed with database insertion
      const { data, error } = await supabase.from("service_ratings").insert([
        {
          rating_type: selectedOption,
          feedback: feedback || null,
        },
      ])

      if (error) {
        throw error
      } else {
        localStorage.setItem("hasRatedService", "true")
        setHasSubmitted(true)

        // 3초 후 모달 닫기
        setTimeout(() => {
          onClose()
        }, 3000)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("평가 제출 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedOption("")
    setFeedback("")
    setHasSubmitted(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  if (hasSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-green-600 fill-current" />
          </div>
          <h2 className="text-xl font-bold mb-2">소중한 의견 감사합니다!</h2>
          <p className="text-gray-600 mb-4">
            {selectedOption === "want_to_use" && "높은 관심을 보여주셔서 감사합니다. 더 좋은 서비스로 보답하겠습니다!"}
            {selectedOption === "dont_want_to_use" &&
              "소중한 피드백 감사합니다. 개선사항을 반영하여 더 나은 서비스를 제공하겠습니다."}
            {selectedOption === "not_sure" && "의견을 참고하여 더 나은 서비스를 만들어가겠습니다."}
          </p>
          <div className="text-sm text-gray-500">잠시 후 자동으로 닫힙니다...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">서비스 평가하기</h2>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center">저희 서비스에 대해서 어떻게 생각하세요?</h3>

              <div className="space-y-3">
                {options.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedOption === option.value ? "border-teal-500 bg-teal-50" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={option.value}
                      checked={selectedOption === option.value}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{option.emoji}</span>
                    <span className="font-medium text-gray-800">{option.label}</span>
                    {selectedOption === option.value && (
                      <div className="ml-auto w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {(selectedOption === "dont_want_to_use" || selectedOption === "not_sure") && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  피드백을 남겨주세요!
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder={
                    selectedOption === "dont_want_to_use"
                      ? "어떤 부분이 아쉬우신가요? 개선했으면 하는 점을 알려주세요."
                      : "어떤 부분이 궁금하거나 확신이 서지 않으시나요?"
                  }
                  rows={4}
                />
              </div>
            )}

            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                나중에 하기
              </Button>
              <Button
                type="submit"
                disabled={!selectedOption || isSubmitting}
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50"
              >
                {isSubmitting ? "제출 중..." : "평가 완료"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// LandingPage 컴포넌트 수정
export default function LandingPage() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null)
  const [hasTrackedDemo, setHasTrackedDemo] = useState(false)

  // 히어로 콘텐츠 로드
  useEffect(() => {
    const loadHeroContent = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const variantKey = urlParams.get("x")
      const content = await getHeroContent(variantKey || undefined)
      setHeroContent(content)
    }

    loadHeroContent()
  }, [])

  // 페이지 나갈 때 추적 설정
  useEffect(() => {
    const cleanup = setupExitTracking()
    return cleanup
  }, [])

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100

      // 데모 섹션 추적 (한 번만)
      const demoSection = document.getElementById("demo")
      if (demoSection && !hasTrackedDemo) {
        const rect = demoSection.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          trackUserInteraction("demo_scroll")
          setHasTrackedDemo(true)
        }
      }

      // 페이지 하단 도달시 평가 모달
      if (scrollPercentage >= 90 && !hasScrolledToBottom) {
        const hasRated = localStorage.getItem("hasRatedService")
        if (!hasRated) {
          setIsRatingModalOpen(true)
          setHasScrolledToBottom(true)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasScrolledToBottom, hasTrackedDemo])

  // 데모 섹션 클릭 추적
  const handleDemoClick = () => {
    if (!hasTrackedDemo) {
      trackUserInteraction("demo_click")
      setHasTrackedDemo(true)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션바 제거됨 */}

      {/* 히어로 섹션 */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent md:text-4xl">
              {heroContent?.main_title || "뉴스 읽을 시간이 부족하다면?"}
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
              {heroContent?.sub_title || "시점으로 해결하세요"}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {heroContent?.description || "인스타그램처럼 빠르게 관심있는 뉴스만 소비하세요."}
              <br />
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
                <h3 className="font-semibold mb-1">이게 무슨 이야기지?</h3>
                <p className="text-gray-600 text-sm">어떤 기사를 봤는데, 무슨 논란인지 감이 안 왔던 적 있나요?</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-3">
                  <Image src="/logo.svg" alt="시점" width={24} height={24} className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-1">관심 없는 기사</h3>
                <p className="text-gray-600 text-sm">
                  기사 수는 너무 많은데, 정작 내가 기다리던 이슈는 놓친 경험있나요?
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold mb-1">뒤늦은 발견</h3>
                <p className="text-gray-600 text-sm">
                  까먹고 있다가, 이미 커진 논란이 된 후에야 뒤늦게 기사를 찾아본 적 있나요?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 데모 섹션 - 클릭 추적 추가 */}
      <section id="demo" className="py-20 bg-gray-50" onClick={handleDemoClick}>
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

      {/* 나머지 섹션들은 동일 */}
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
              <h3 className="font-semibold text-lg mb-2">토픽 타임라인</h3>
              <p className="text-gray-600">최근 떠오른 이슈가 왜 나왔는지 시간순으로 설명해드려요.</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">후속 기사 알림</h3>
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

      {/* 이메일 모달 추가 */}
      <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />

      {/* 별점 평가 모달 */}
      <ServiceRatingModal isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)} />
    </div>
  )
}
