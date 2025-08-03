-- 뉴스 데이터를 저장할 테이블 생성
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  summary TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  read_time VARCHAR(20) NOT NULL,
  image_url TEXT,
  source VARCHAR(200) NOT NULL,
  published_at VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 카테고리에 대한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);

-- 활성 상태에 대한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_news_articles_active ON news_articles(is_active);

-- 생성일에 대한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_news_articles_created_at ON news_articles(created_at);
