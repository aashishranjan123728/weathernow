-- ============================================================
-- WeatherNow – Supabase Database Schema
-- Run this in your Supabase project:
--   Dashboard → SQL Editor → New query → paste & Run
-- ============================================================

-- ── 1. Users ─────────────────────────────────────────────────
-- Stores credentials for the custom NextAuth CredentialsProvider.
-- (If you later switch to Supabase Auth, you can drop this table
--  and use the built-in auth.users instead.)
CREATE TABLE IF NOT EXISTS public.users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 50),
  email       text NOT NULL UNIQUE,
  password    text NOT NULL,           -- bcrypt-hashed, never plain-text
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

-- ── 2. Favorite Cities ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.favorite_cities (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     text NOT NULL,           -- matches NextAuth session user id
  city_name   text NOT NULL,
  country     text NOT NULL DEFAULT '',
  lat         double precision,
  lon         double precision,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL,
  UNIQUE (user_id, city_name)
);

CREATE INDEX IF NOT EXISTS idx_favorite_cities_user_id ON public.favorite_cities (user_id);

-- ── 3. Weather History ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.weather_history (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           text NOT NULL,
  city_name         text NOT NULL,
  temperature       double precision NOT NULL DEFAULT 0,
  weather_condition text NOT NULL DEFAULT 'Clear',
  humidity          double precision NOT NULL DEFAULT 0,
  wind_speed        double precision NOT NULL DEFAULT 0,
  searched_at       timestamptz DEFAULT now() NOT NULL,
  created_at        timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_weather_history_user_searched
  ON public.weather_history (user_id, searched_at DESC);

-- ── 4. Row Level Security ────────────────────────────────────
-- The API routes use the service-role key which bypasses RLS.
-- Enable RLS anyway for defence-in-depth (anon key cannot read data).
ALTER TABLE public.users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_history ENABLE ROW LEVEL SECURITY;

-- No RLS policies are needed for server-side service-role access.
-- If you ever expose data directly to the browser with the anon key,
-- add user-scoped policies here.
