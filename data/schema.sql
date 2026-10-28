-- Schema do banco de dados — Jornal Escolar Ana Neri
-- Execute este arquivo no seu banco PostgreSQL (Neon, Supabase, Railway, etc.)
-- Exemplo (Neon): psql "URL_DE_CONEXÃO" -f data/schema.sql

CREATE TABLE IF NOT EXISTS project_cards (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  media_type  TEXT        NOT NULL DEFAULT 'video' CHECK (media_type IN ('image', 'video')),
  media_url   TEXT,       -- URL da imagem (upload local ou Vercel Blob)
  video_url   TEXT,       -- URL do vídeo (upload local, Vercel Blob ou link externo)
  is_home     BOOLEAN     NOT NULL DEFAULT FALSE,
  position    INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS project_cards_is_home_position_idx
  ON project_cards (is_home DESC, position ASC, id ASC);

-- Se a tabela já existir de uma versão anterior, garante as colunas novas:
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_cards' AND column_name = 'media_type') THEN
    ALTER TABLE project_cards ADD COLUMN media_type TEXT NOT NULL DEFAULT 'video';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_cards' AND column_name = 'media_url') THEN
    ALTER TABLE project_cards ADD COLUMN media_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_cards' AND column_name = 'updated_at') THEN
    ALTER TABLE project_cards ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;
