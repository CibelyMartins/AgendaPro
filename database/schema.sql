-- AgendaPro API - Estrutura do banco de dados
-- Execute este arquivo no SQL Editor do Supabase.

create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null unique,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null,
  name varchar(100) not null,
  description text,
  price numeric(10, 2) not null check (price > 0),
  duration_minutes integer not null check (duration_minutes > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint appointments_service_id_fkey
    foreign key (service_id) references services(id) on delete restrict
);

create index if not exists idx_services_category_id on services(category_id);
create index if not exists idx_appointments_service_id on appointments(service_id);
create index if not exists idx_appointments_scheduled_at on appointments(scheduled_at);

-- Um serviço não pode ter dois agendamentos ativos no mesmo horário.
create unique index if not exists appointments_active_service_schedule_unique
  on appointments(service_id, scheduled_at)
  where status <> 'cancelado';

-- Mantém updated_at atualizado automaticamente após alterações.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists categories_set_updated_at on categories;
create trigger categories_set_updated_at
before update on categories
for each row execute function set_updated_at();

drop trigger if exists services_set_updated_at on services;
create trigger services_set_updated_at
before update on services
for each row execute function set_updated_at();

drop trigger if exists appointments_set_updated_at on appointments;
create trigger appointments_set_updated_at
before update on appointments
for each row execute function set_updated_at();
