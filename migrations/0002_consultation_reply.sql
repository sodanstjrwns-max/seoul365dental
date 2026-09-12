-- 상담문의 답변 기능 (2026-09-12)
ALTER TABLE consultations ADD COLUMN reply TEXT;
ALTER TABLE consultations ADD COLUMN replied_at DATETIME;
ALTER TABLE consultations ADD COLUMN lookup_code TEXT;
