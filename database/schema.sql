-- AgendaPro API - execute este script no SQL Editor do Supabase.

create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null unique,
  description text,
  active boolean not null default true
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null,
  name varchar(100) not null,
  description text,
  price numeric(10, 2) not null check (price > 0),
  duration_minutes integer not null check (duration_minutes > 0),
  active boolean not null default true,
  constraint services_category_id_fkey
    foreign key (category_id) references categories(id) on delete restrict
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null,
  client_name varchar(120) not null,
  client_phone varchar(20) not null,
  scheduled_at timestamptz not null,
  status varchar(20) not null default 'agendado'
    check (status in ('agendado', 'concluido', 'cancelado')),
  notes text,
  constraint appointments_service_id_fkey
    foreign key (service_id) references services(id) on delete restrict,
  constraint appointments_service_schedule_key unique (service_id, scheduled_at)
);
