-- DSAR / DPDP Act 2023: mark a ConsentLog row as anonymised-for-erasure without deleting
-- it — the consent proof (action/version/scopes/timestamp) is retained while identifiers
-- are stripped by the backend erasure. Idempotent (IF NOT EXISTS) because the shared
-- FastAPI backend also applies this column on boot via init_db().
ALTER TABLE "ConsentLog" ADD COLUMN IF NOT EXISTS "erasedForRequestId" TEXT;
