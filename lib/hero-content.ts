import { supabase } from "./supabase"

// 히어로 콘텐츠 타입 정의
export interface HeroContent {
  id: string
  variant_key: string
  main_title: string
  sub_title: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// 폴백 히어로 콘텐츠 데이터
const fallbackHeroContent: { [key: string]: HeroContent } = {
  "1": {
    id: "1",
    variant_key: "1",
    main_title: "뉴스 읽을 시간이 부족하다면?",
    sub_title: "시점으로 해결하세요",
    description: "인스타그램처럼 빠르게 관심있는 뉴스만 소비하세요.",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "2": {
    id: "2",
    variant_key: "2",
    main_title: "매일 쏟아지는 뉴스, 정말 다 읽고 계신가요?",
    sub_title: "시점에서 핵심만 골라드려요",
    description: "스토리 형태로 빠르게 훑어보는 스마트한 뉴스 소비.",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "3": {
    id: "3",
    variant_key: "3",
    main_title: "중요한 뉴스를 놓치고 계시지 않나요?",
    sub_title: "시점이 알려드릴게요",
    description: "관심 주제의 후속 소식까지 놓치지 않게 알림으로.",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  "4": {
    id: "4",
    variant_key: "4",
    main_title: "복잡한 이슈, 배경이 궁금하지 않으세요?",
    sub_title: "시점에서 타임라인으로 정리해드려요",
    description: "사건의 전후 맥락을 한눈에 파악할 수 있게.",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
}

// 기본 히어로 콘텐츠 (x 파라미터가 없거나 매칭되지 않을 때)
const defaultHeroContent: HeroContent = fallbackHeroContent["1"]

// 히어로 콘텐츠 가져오기
export async function getHeroContent(variantKey?: string): Promise<HeroContent> {
  try {
    // variant key가 없으면 기본값 사용
    if (!variantKey) {
      return defaultHeroContent
    }

    // Supabase가 설정되지 않은 경우 폴백 데이터 반환
    if (!supabase) {
      console.log("Supabase not configured, using fallback hero content")
      return fallbackHeroContent[variantKey] || defaultHeroContent
    }

    const { data, error } = await supabase
      .from("hero_content")
      .select("*")
      .eq("variant_key", variantKey)
      .eq("is_active", true)
      .single()

    if (error) {
      console.error("Error fetching hero content:", error)
      return fallbackHeroContent[variantKey] || defaultHeroContent
    }

    return data || fallbackHeroContent[variantKey] || defaultHeroContent
  } catch (error) {
    console.error("Error in getHeroContent:", error)
    return fallbackHeroContent[variantKey] || defaultHeroContent
  }
}
