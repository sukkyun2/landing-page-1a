-- 스토리 콘텐츠를 저장할 테이블 생성
CREATE TABLE IF NOT EXISTS story_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(300),
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  background_color VARCHAR(20) DEFAULT '#000000',
  text_color VARCHAR(20) DEFAULT '#ffffff',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 표시 순서에 대한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_story_content_order ON story_content(display_order);

-- 활성 상태에 대한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_story_content_active ON story_content(is_active);

-- 카테고리에 대한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_story_content_category ON story_content(category);
