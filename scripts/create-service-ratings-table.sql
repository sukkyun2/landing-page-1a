-- 서비스 평가 정보를 저장할 테이블 생성
CREATE TABLE IF NOT EXISTS service_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rating_type VARCHAR(50) NOT NULL CHECK (rating_type IN ('want_to_use', 'dont_want_to_use', 'not_sure')),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 생성일에 대한 인덱스 생성 (날짜별 조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_service_ratings_created_at ON service_ratings(created_at);

-- 평가 타입에 대한 인덱스 생성 (타입별 조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_service_ratings_type ON service_ratings(rating_type);
