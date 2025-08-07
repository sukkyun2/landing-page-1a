import { supabase, type Database } from "./supabase"

// 뉴스 타입 정의
export type NewsArticle = Database["public"]["Tables"]["news_articles"]["Row"]

// 폴백 뉴스 데이터 (Supabase가 설정되지 않았을 때 사용)
const fallbackNews: NewsArticle[] = [
  {
    id: "1",
    title: "삼성전자, AI 반도체 시장 점유율 1위 달성",
    summary: "삼성전자가 글로벌 AI 반도체 시장에서 점유율 1위를 기록했다고 발표했습니다.",
    category: "기술",
    read_time: "2분",
    image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center",
    source: "테크뉴스",
    published_at: "1시간 전",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "국내 스타트업, 해외 투자 유치 급증",
    summary: "올해 국내 스타트업들의 해외 투자 유치 규모가 전년 대비 150% 증가했습니다.",
    category: "경제",
    read_time: "3분",
    image_url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop&crop=center",
    source: "비즈니스타임즈",
    published_at: "2시간 전",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "메타, 새로운 VR 헤드셋 공개",
    summary: "메타가 차세대 VR 헤드셋 Quest 4를 공개했습니다.",
    category: "기술",
    read_time: "2분",
    image_url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=400&fit=crop&crop=center",
    source: "테크리뷰",
    published_at: "3시간 전",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "전기차 배터리 재활용 기술 혁신",
    summary: "국내 연구진이 전기차 배터리의 리튬을 95% 이상 회수할 수 있는 새로운 재활용 기술을 개발했습니다.",
    category: "환경",
    read_time: "4분",
    image_url: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400&h=400&fit=crop&crop=center",
    source: "그린테크",
    published_at: "4시간 전",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "코스피, 3개월 만에 2600선 돌파",
    summary: "코스피 지수가 3개월 만에 2600선을 돌파했습니다.",
    category: "경제",
    read_time: "2분",
    image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop&crop=center",
    source: "파이낸셜뉴스",
    published_at: "5시간 전",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "챗GPT-5, 내년 상반기 출시 예정",
    summary: "OpenAI가 차세대 언어모델 GPT-5를 내년 상반기에 출시할 예정이라고 발표했습니다.",
    category: "기술",
    read_time: "3분",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop&crop=center",
    source: "AI뉴스",
    published_at: "6시간 전",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// 뉴스 데이터 가져오기
export async function getNewsArticles(): Promise<NewsArticle[]> {
  try {
    // Supabase가 설정되지 않은 경우 폴백 데이터 반환
    if (!supabase) {
      console.log("Supabase not configured, using fallback news data")
      return fallbackNews
    }

    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching news articles:", error)
      return fallbackNews
    }

    return data || fallbackNews
  } catch (error) {
    console.error("Error in getNewsArticles:", error)
    return fallbackNews
  }
}

// 특정 카테고리의 뉴스 가져오기
export async function getNewsArticlesByCategory(category: string): Promise<NewsArticle[]> {
  try {
    if (!supabase) {
      return fallbackNews.filter((news) => news.category === category)
    }

    const { data, error } = await supabase
      .from("news_articles")
      .select("*")
      .eq("is_active", true)
      .eq("category", category)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching news articles by category:", error)
      return fallbackNews.filter((news) => news.category === category)
    }

    return data || []
  } catch (error) {
    console.error("Error in getNewsArticlesByCategory:", error)
    return fallbackNews.filter((news) => news.category === category)
  }
}
