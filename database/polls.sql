-- Схема для системы опросов и фидбека (Polls & Feedback)
-- Выполните этот SQL в Supabase SQL Editor

-- Очистка старых таблиц (если они есть) для предотвращения конфликтов типов
drop table if exists public.poll_responses cascade;
drop table if exists public.polls cascade;

-- 1. Таблица опросов
create table public.polls (
  id uuid default uuid_generate_v4() primary key,
  creator_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  cover_image text, -- URL
  -- fields: [{id, type: 'choice'|'scale'|'text', question: "", options: [], required: bool}]
  fields jsonb not null default '[]'::jsonb, 
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- 2. Таблица ответов
create table public.poll_responses (
  id uuid default uuid_generate_v4() primary key,
  poll_id uuid references public.polls(id) on delete cascade not null,
  user_id uuid references public.profiles(id), -- Null for anonymous
  -- responses: { fieldId: value }
  responses jsonb not null default '{}'::jsonb, 
  created_at timestamp with time zone default now()
);

-- RLS Policies
alter table public.polls enable row level security;
alter table public.poll_responses enable row level security;

-- Polls: Все могут видеть активные опросы
create policy "Active polls are public" on public.polls for select using (is_active = true);

-- Polls: Только админы могут управлять (по email)
create policy "Admins can manage polls" on public.polls for all using (
  auth.jwt() ->> 'email' = 'andrewche2003@gmail.com'
);

-- Poll Responses: Все могут отправлять
create policy "Anyone can submit poll responses" on public.poll_responses for insert with check (true);

-- Poll Responses: Админы видят все, пользователи — свои
create policy "View poll responses" on public.poll_responses for select using (
  auth.uid() = user_id or auth.jwt() ->> 'email' = 'andrewche2003@gmail.com'
);
