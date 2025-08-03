"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Star } from "lucide-react"

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RatingModal({ isOpen, onClose }: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setIsSubmitting(true)

    try {
      // localStorage에 평가 완료 표시
      localStorage.setItem("hasRatedService", "true")
      localStorage.setItem("serviceRating", rating.toString())
      if (feedback) {
        localStorage.setItem("serviceFeedback", feedback)
      }

      // 실제 서비스에서는 여기서 API 호출
      console.log("Rating submitted:", { rating, feedback })

      // 시뮬레이션 딜레이
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setHasSubmitted(true)

      // 3초 후 모달 닫기
      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (error) {
      console.error("Error submitting rating:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
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
            {rating >= 4
              ? "높은 기대를 보여주셔서 감사합니다. 더 좋은 서비스로 보답하겠습니다!"
              : rating === 3
                ? "의견을 참고하여 더 나은 서비스를 만들어가겠습니다."
                : "소중한 피드백 감사합니다. 개선사항을 반영하여 더 나은 서비스를 제공하겠습니다."}
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
            <h2 className="text-xl font-bold">서비스 기대도 평가</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">우리 서비스가 출시되면 사용하시겠나요?</h3>
              <p className="text-gray-600 text-sm mb-6">서비스에 대한 기대도를 별점으로 평가해주세요</p>

              <div className="flex justify-center space-x-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    {rating === 5 && "매우 기대됩니다! 🌟"}
                    {rating === 4 && "기대됩니다! ⭐"}
                    {rating === 3 && "보통입니다 😐"}
                    {rating === 2 && "별로 기대되지 않습니다 😕"}
                    {rating === 1 && "전혀 기대되지 않습니다 😞"}
                  </p>
                </div>
              )}
            </div>

            {rating > 0 && rating <= 2 && (
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  어떤 부분이 아쉬우신가요? (선택사항)
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder="개선했으면 하는 점이나 아쉬운 부분을 자유롭게 적어주세요"
                  rows={4}
                />
              </div>
            )}

            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                나중에 하기
              </Button>
              <Button
                type="submit"
                disabled={rating === 0 || isSubmitting}
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
