-- 히어로 섹션 콘텐츠 테이블 생성
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  variant_key VARCHAR(10) NOT NULL UNIQUE, -- '1', '2', '3', '4' 등
  main_title TEXT NOT NULL,
  sub_title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- variant_key에 대한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_hero_content_variant ON hero_content(variant_key);

-- 활성 상태에 대한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_hero_content_active ON hero_content(is_active);
