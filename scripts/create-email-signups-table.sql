-- 이메일 가입 정보를 저장할 테이블 생성
CREATE TABLE IF NOT EXISTS email_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  interests TEXT,
  expected_features TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 이메일에 대한 인덱스 생성 (중복 방지 및 검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_email_signups_email ON email_signups(email);

-- 생성일에 대한 인덱스 생성 (날짜별 조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_email_signups_created_at ON email_signups(created_at);
