-- 사용자 상호작용 추적 테이블 생성
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  ip_address INET,
  referrer_source VARCHAR(500),
  user_agent TEXT,
  interaction_type VARCHAR(100) NOT NULL, -- 'demo_scroll', 'demo_click', 'page_exit' 등
  time_on_site INTEGER, -- 초 단위
  page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 세션 ID에 대한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_interactions_session ON user_interactions(session_id);

-- 상호작용 타입에 대한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);

-- 생성일에 대한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_interactions_created_at ON user_interactions(created_at);
