import { supabase } from "./supabase"
import { getClientInfo } from "./client-info"

// 사용자 상호작용 타입 정의
export interface UserInteraction {
  session_id: string
  ip_address?: string | null
  referrer_source?: string | null
  user_agent?: string
  interaction_type: string
  time_on_site?: number
  page_url?: string
}

// 세션 ID 생성
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 세션 ID 가져오기 (localStorage에서)
function getSessionId(): string {
  let sessionId = localStorage.getItem("session_id")
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem("session_id", sessionId)
  }
  return sessionId
}

// 페이지 시작 시간 기록
const pageStartTime = Date.now()

// 사용자 상호작용 기록
export async function trackUserInteraction(interactionType: string, additionalData?: Partial<UserInteraction>) {
  try {
    const sessionId = getSessionId()
    const clientInfo = await getClientInfo()
    const timeOnSite = Math.floor((Date.now() - pageStartTime) / 1000) // 초 단위

    // IP 주소 유효성 검사 - "unknown"이면 null로 설정
    let validIpAddress: string | null = clientInfo.ip_address
    if (validIpAddress === "unknown" || !validIpAddress) {
      validIpAddress = null
    }

    const interactionData: UserInteraction = {
      session_id: sessionId,
      ip_address: validIpAddress,
      referrer_source: clientInfo.referrer_source,
      user_agent: navigator.userAgent,
      interaction_type: interactionType,
      time_on_site: timeOnSite,
      page_url: window.location.href,
      ...additionalData,
    }

    // Supabase가 설정되지 않은 경우 콘솔에 로그만 출력
    if (!supabase) {
      console.log("User interaction tracked (demo mode):", interactionData)
      return
    }

    const { error } = await supabase.from("user_interactions").insert([interactionData])

    if (error) {
      console.error("Error tracking user interaction:", error)
    } else {
      console.log("User interaction tracked:", interactionType)
    }
  } catch (error) {
    console.error("Error in trackUserInteraction:", error)
  }
}

// 페이지 나갈 때 추적
export function setupExitTracking() {
  const handleBeforeUnload = () => {
    // 동기적으로 실행되어야 하므로 navigator.sendBeacon 사용
    trackUserInteraction("page_exit")
  }

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      trackUserInteraction("page_hidden")
    }
  }

  window.addEventListener("beforeunload", handleBeforeUnload)
  document.addEventListener("visibilitychange", handleVisibilityChange)

  // cleanup 함수 반환
  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload)
    document.removeEventListener("visibilitychange", handleVisibilityChange)
  }
}
