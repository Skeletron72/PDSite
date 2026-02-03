-- Полная схема БД Pocket Dale
-- Выполните этот SQL в Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- ОЧИСТКА СТАРЫХ ТАБЛИЦ (если они есть) для предотвращения конфликтов имен колонок
-- Используем CASCADE для автоматического удаления зависимых объектов (напр. таблицы invites)
drop table if exists public.friends cascade;
drop table if exists public.islands cascade;
drop table if exists public.profiles cascade;
drop table if exists public.access_keys cascade;
drop table if exists public.telemetry_events cascade;

-- 1. Profiles
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  nickname text unique,
  avatar_id int default 0,
  current_seed text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles for select using ( true );
drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles for update using ( auth.uid() = id );

-- 2. Islands (Slots)
create table if not exists public.islands (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  slot_index int not null,
  name text not null,
  seed text not null,
  current_day int default 1,
  appearance_data jsonb,
  inventory_data jsonb,
  world_data jsonb,
  quest_data jsonb,
  stats_data jsonb,
  created_at timestamp with time zone default now(),
  unique(user_id, slot_index)
);

alter table public.islands enable row level security;
drop policy if exists "View own islands" on public.islands;
create policy "View own islands" on public.islands for select using ( auth.uid() = user_id );
drop policy if exists "Insert own islands" on public.islands;
create policy "Insert own islands" on public.islands for insert with check ( auth.uid() = user_id );
drop policy if exists "Update own islands" on public.islands;
create policy "Update own islands" on public.islands for update using ( auth.uid() = user_id );
drop policy if exists "Delete own islands" on public.islands;
create policy "Delete own islands" on public.islands for delete using ( auth.uid() = user_id );

-- 3. Friends
create table if not exists public.friends (
  id uuid default uuid_generate_v4() primary key,
  requester_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  status text check (status in ('pending', 'accepted')) not null default 'pending',
  created_at timestamp with time zone default now(),
  unique(requester_id, receiver_id)
);

alter table public.friends enable row level security;
drop policy if exists "View own friend requests" on public.friends;
create policy "View own friend requests" on public.friends for select using ( auth.uid() = requester_id or auth.uid() = receiver_id );
drop policy if exists "Create friend requests" on public.friends;
create policy "Create friend requests" on public.friends for insert with check ( auth.uid() = requester_id );

-- 4. Access Keys
create table if not exists public.access_keys (
    key_code text primary key,
    is_used boolean default false,
    used_by_user_id uuid references auth.users
);

-- 5. Telemetry
create table if not exists public.telemetry_events (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users,
    event_type text not null,
    event_data jsonb,
    created_at timestamp with time zone default now()
);
alter table public.telemetry_events enable row level security;
drop policy if exists "Insert telemetry" on public.telemetry_events;
create policy "Insert telemetry" on public.telemetry_events for insert with check ( auth.uid() = user_id );
