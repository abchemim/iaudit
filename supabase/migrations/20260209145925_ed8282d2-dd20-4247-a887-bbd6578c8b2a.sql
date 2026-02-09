-- Drop orphaned tables that have RLS enabled but no policies
-- All 5 tables are:
-- 1. Empty (0 rows)
-- 2. Not referenced in application code
-- 3. Have RLS enabled but ZERO policies (completely locked)
-- 4. Manually created outside of migrations

DROP TABLE IF EXISTS logs_envio CASCADE;
DROP TABLE IF EXISTS consultas_fgts CASCADE;
DROP TABLE IF EXISTS consultas_cnd_estadual CASCADE;
DROP TABLE IF EXISTS consultas_cnd_federal CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;