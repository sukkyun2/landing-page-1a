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
    image_url: "/placeholder.svg?height=400&width=400&text=AI+반도체",
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
    image_url: "/placeholder.svg?height=400&width=400&text=스타트업+투자",
    source: "비즈니스타임즈",
    published_at: "2시간 전",
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
