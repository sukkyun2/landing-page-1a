-- email_signups 테이블에 IP 주소와 referrer 정보 컬럼 추가
ALTER TABLE email_signups 
ADD COLUMN IF NOT EXISTS ip_address INET,
ADD COLUMN IF NOT EXISTS referrer_source VARCHAR(500);

-- IP 주소에 대한 인덱스 생성 (분석 목적)
CREATE INDEX IF NOT EXISTS idx_email_signups_ip ON email_signups(ip_address);

-- referrer_source에 대한 인덱스 생성 (분석 목적)
CREATE INDEX IF NOT EXISTS idx_email_signups_referrer ON email_signups(referrer_source);
