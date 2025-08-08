"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Clock, Bell, ArrowRight, X, Heart, Star } from 'lucide-react'
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { getNewsArticles, type NewsArticle } from "@/lib/news"
import { getClientInfo, type ClientInfo } from "@/lib/client-info"
import { getHeroContent, type HeroContent } from "@/lib/hero-content"
import { trackUserInteraction, setupExitTracking } from "@/lib/user-tracking"
import { getStoryContent, type StoryContent } from "@/lib/story-content"
import HeroSection from "@/components/section/HeroSection";
import FeaturesSection from "@/components/section/FeaturesSection";

// 스토리 뷰어 컴포넌트
function StoryViewer({
stories,
currentIndex,
onClose,
onNext,
onPrev,
}: {
stories: StoryContent[]
currentIndex: number
onClose: () => void
onNext: () => void
onPrev: () => void
}) {
const currentStory = stories[currentIndex]
const progress = ((currentIndex + 1) / stories.length) * 100

const fireStoryPixel = (dir: 'prev'|'next') => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq('trackCustom', `tab_${dir}_${currentIndex}`, {
      content_type: 'story',
      dir
    })
  }
}

const handleTap = (e: React.MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const width = rect.width

  if (x < width / 2) {
    onPrev()
    // 이전 스토리 픽셀 이벤트는 useEffect에서 자동 호출됨
    fireStoryPixel('prev')
  } else {
    onNext()
    // 다음 스토리 픽셀 이벤트는 useEffect에서 자동 호출됨
    fireStoryPixel('next')
    console.log('next')
  }
}

return (
  <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
    <div className="relative w-full max-w-md h-full" style={{ backgroundColor: currentStory.background_color }}>
      {/* 진행 바 */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <Progress value={progress} className="h-1 bg-white/30" />
      </div>

      {/* 닫기 버튼 */}
      <button onClick={onClose} className="absolute top-4 right-4 z-10 text-white hover:text-gray-300">
        <X className="w-6 h-6" />
      </button>

      {/* 메인 콘텐츠 */}
      <div className="relative w-full h-full cursor-pointer" onClick={handleTap}>
        <Image
          src={currentStory.image_url || "/placeholder.svg?height=600&width=400&query=story%20image"}
          alt={currentStory.title}
          fill
          className="object-cover"
        />

        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* 텍스트 콘텐츠 */}
        <div className="absolute bottom-0 left-0 right-0 p-6" style={{ color: currentStory.text_color }}>
          <Badge variant="secondary" className="mb-3">
            {currentStory.category}
          </Badge>
          <h2 className="text-2xl font-bold mb-2 leading-tight">{currentStory.title}</h2>
          {currentStory.subtitle && <h3 className="text-lg font-medium mb-3 opacity-90">{currentStory.subtitle}</h3>}
          <p className="text-sm mb-4 leading-relaxed opacity-90">{currentStory.content}</p>
        </div>
      </div>

      {/* 네비게이션 힌트 */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/60 text-xs">
        탭하여 다음 스토리 보기
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
      console.log("Supabase not configured. Form data:", {
        email,
        interests: interests || null,
        expected_features: expectedFeatures,
        ip_address: clientInfo?.ip_address || null,
        referrer_source: clientInfo?.referrer_source || null,
      })

      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 픽셀 이벤트 호출 (데모 모드)
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq('track', 'Lead',{
          email,
          interests: interests || null,
          expected_features: expectedFeatures,
          ip_address: clientInfo?.ip_address || null,
          referrer_source: clientInfo?.referrer_source || null,
        })
      }

      alert(
        `알림 신청이 완료되었습니다!`
      )

      onClose()
      setEmail("")
      setInterests("")
      setExpectedFeatures([])
      setAgreedToTerms(false)
      return
    }

    const { error } = await supabase.from("email_signups").insert([
      {
        email,
        interests: interests || null,
        expected_features: expectedFeatures,
        ip_address: clientInfo?.ip_address || null,
        referrer_source: clientInfo?.referrer_source || null,
      },
    ])

    if (error) {
      if ((error as any).code === "23505") {
        alert("이미 등록된 이메일입니다.")
      } else {
        throw error
      }
    } else {
      // 픽셀 이벤트 호출 (실제 제출 성공)
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq('track', 'Lead')
      }

      alert(
        `알림 신청이 완료되었습니다!\n이메일: ${email}\n관심 주제: ${interests}\n기대 기능: ${expectedFeatures.join(", ")}`,
      )
      onClose()
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
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null)
  const [newsData, setNewsData] = useState<NewsArticle[]>([])
  const [storyData, setStoryData] = useState<StoryContent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [articles, stories] = await Promise.all([getNewsArticles(), getStoryContent()])
        setNewsData(articles)
        setStoryData(stories)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // 뉴스 카드 클릭 시 픽셀 이벤트 호출 추가
  const openStory = (index: number) => {
    // 픽셀 이벤트 호출
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq('track', 'ViewContent', {
        content_type: 'feed',
        content_id: newsData[index]?.id,
        title: newsData[index]?.title,
      })
    }
    setSelectedStoryIndex(index)
  }
  const closeStory = () => setSelectedStoryIndex(null)
  const nextStory = () => setSelectedStoryIndex((i) => (i === null ? null : (i + 1) % storyData.length))
  const prevStory = () =>
    setSelectedStoryIndex((i) => (i === null ? null : i === 0 ? storyData.length - 1 : i - 1))

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
                src={news.image_url || "/placeholder.svg?height=200&width=400&query=news%20image"}
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
      {selectedStoryIndex !== null && storyData.length > 0 && (
        <StoryViewer
          stories={storyData}
          currentIndex={selectedStoryIndex}
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
    if (!supabase) {
      console.log("Supabase not configured. Form data:", { rating_type: selectedOption, feedback: feedback || null })
      await new Promise((r) => setTimeout(r, 1000))
      localStorage.setItem("hasRatedService", "true")
      setHasSubmitted(true)
      setTimeout(() => onClose(), 3000)

      // 픽셀 이벤트 호출 (데모 모드)
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq('track', 'SubmitApplication', { rating_type: selectedOption, feedback: feedback || null });
      }
      return
    }

    const { error } = await supabase.from("service_ratings").insert([
      {
        rating_type: selectedOption,
        feedback: feedback || null,
      },
    ])
    if (error) throw error
    localStorage.setItem("hasRatedService", "true")
    setHasSubmitted(true)
    setTimeout(() => onClose(), 3000)
  } catch (e) {
    console.error(e)
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

// LandingPage 컴포넌트
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
  <div className="min-h-screen" style={{ backgroundColor: '#121A23' }}>
    {/* 히어로 섹션 */}
    <HeroSection videoSrc={"hero.mp4"} />

    {/* 기능 섹션 */}
    <FeaturesSection />

    {/* 데모 섹션 - 클릭 추적 추가 */}
    <section id="demo" className="py-20 " onClick={handleDemoClick}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">직접 체험해보세요</h2>
          <p className="text-gray-400 text-lg">당신의 관심사를 중심으로 돌아가는 뉴스 서비스</p>
        </div>

        <div className="max-w-sm mx-auto">
          <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl">
            <div className="bg-white rounded-[2rem] overflow-hidden" style={{ height: "720px" }}>
              <div className="bg-gray-900 h-6 rounded-t-[2rem] flex items-center justify-center">
                <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
              </div>
              <div className="p-4 h-full">
                <NewsFeed />
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-200 text-sm px-4 py-2 rounded-lg" >
              💡 뉴스 카드를 클릭하면 스토리 모드로 볼 수 있어요.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA 섹션 */}
    <section className="relative py-20 overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <Image
          src="/cta.jpg"
          alt="CTA Background"
          fill
          className="object-cover"
        />
        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* 콘텐츠 */}
      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">지금 시작해보세요</h2>
          <p className="text-xl mb-8 opacity-90">바쁜 일상 속에서도 놓치지 않는 뉴스 소비의 새로운 경험</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setIsEmailModalOpen(true)}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Bell className="w-5 h-5 mr-2" />
              앱 출시 알림 받기
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
            >
              웹에서 시작하기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* 이메일 모달 */}
    <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />
    {/* 별점 평가 모달 */}
    <ServiceRatingModal isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)} />
  </div>
)
}
