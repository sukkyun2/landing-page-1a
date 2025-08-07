import { supabase } from "./supabase"

// 스토리 콘텐츠 타입 정의
export interface StoryContent {
  id: string
  title: string
  subtitle: string | null
  content: string
  category: string
  image_url: string
  background_color: string
  text_color: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// 폴백 스토리 데이터 (Supabase가 설정되지 않았을 때 사용)
const fallbackStories: StoryContent[] = [
  {
    id: "1",
    title: "🚀 테슬라 주가 급등",
    subtitle: "일론 머스크의 새로운 발표",
    content: "테슬라가 완전 자율주행 기술의 새로운 돌파구를 마련했다고 발표했습니다. 이번 기술은 기존 대비 안전성을 300% 향상시켰으며, 2024년 하반기부터 상용화될 예정입니다.",
    category: "기술",
    image_url: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=600&fit=crop&crop=center",
    background_color: "#1a1a1a",
    text_color: "#ffffff",
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "💰 비트코인 6만달러 돌파",
    subtitle: "암호화폐 시장 대반등",
    content: "비트코인이 6개월 만에 6만 달러를 돌파하며 암호화폐 시장 전체가 상승세를 보이고 있습니다. 기관 투자자들의 대규모 매수가 주요 원인으로 분석됩니다.",
    category: "경제",
    image_url: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=600&fit=crop&crop=center",
    background_color: "#f59e0b",
    text_color: "#ffffff",
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "🤖 OpenAI 새로운 모델 공개",
    subtitle: "GPT-5 베타 버전 출시",
    content: "OpenAI가 차세대 언어모델 GPT-5의 베타 버전을 선별된 개발자들에게 공개했습니다. 이전 버전 대비 추론 능력이 크게 향상되었다고 평가받고 있습니다.",
    category: "기술",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=600&fit=crop&crop=center",
    background_color: "#10b981",
    text_color: "#ffffff",
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "🌍 기후변화 대응 새 기술",
    subtitle: "탄소 포집 혁신 기술 개발",
    content: "국내 연구진이 대기 중 이산화탄소를 효율적으로 포집하는 새로운 기술을 개발했습니다. 이 기술은 기존 방식 대비 비용을 70% 절감할 수 있을 것으로 예상됩니다.",
    category: "환경",
    image_url: "https://images.unsplash.com/photo-1569163139394-de44cb5894c6?w=400&h=600&fit=crop&crop=center",
    background_color: "#059669",
    text_color: "#ffffff",
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "📱 애플 새로운 혁신 발표",
    subtitle: "iPhone 16 Pro 공개",
    content: "애플이 iPhone 16 Pro를 공개하며 완전히 새로운 AI 칩셋과 혁신적인 카메라 시스템을 선보였습니다. 배터리 수명도 기존 대비 40% 향상되었습니다.",
    category: "기술",
    image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=600&fit=crop&crop=center",
    background_color: "#6366f1",
    text_color: "#ffffff",
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// 스토리 콘텐츠 가져오기
export async function getStoryContent(): Promise<StoryContent[]> {
  try {
    // Supabase가 설정되지 않은 경우 폴백 데이터 반환
    if (!supabase) {
      console.log("Supabase not configured, using fallback story data")
      return fallbackStories
    }

    const { data, error } = await supabase
      .from("story_content")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(5)

    if (error) {
      console.error("Error fetching story content:", error)
      return fallbackStories
    }

    return data || fallbackStories
  } catch (error) {
    console.error("Error in getStoryContent:", error)
    return fallbackStories
  }
}
