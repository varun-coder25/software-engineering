create extension if not exists pgcrypto;

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  student_email text,
  file_name text,
  file_url text,
  hash text not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'VERIFIED', 'REJECTED')),
  tx_hash text,
  block_number bigint,
  timestamp timestamptz,
  created_at timestamptz not null default now(),
  gpa numeric(4,2),
  cgpa numeric(4,2)
);

alter table public.certificates enable row level security;

create policy "students can view own certificates"
on public.certificates
for select
using (auth.uid() = user_id);

create policy "students can insert own certificates"
on public.certificates
for insert
with check (
  auth.uid() = user_id
  and coalesce(auth.jwt() -> 'user_metadata' ->> 'role', 'student') = 'student'
);

create policy "admins can view all certificates"
on public.certificates
for select
using (coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'admin');

create policy "admins can update all certificates"
on public.certificates
for update
using (coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'admin')
with check (coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'admin');

create policy "employers can view verified certificates"
on public.certificates
for select
using (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'employer'
  and status = 'VERIFIED'
);
