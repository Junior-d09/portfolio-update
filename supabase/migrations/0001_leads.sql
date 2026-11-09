-- Phase 2 · Conversion : messages et demandes de devis.
-- À exécuter dans Supabase > SQL Editor (ou `supabase db push` avec la CLI).

create type lead_type as enum ('message', 'devis');
create type lead_status as enum ('new', 'review', 'sent', 'won', 'lost', 'closed');

create sequence lead_message_seq;
create sequence lead_devis_seq;

create table leads (
  id uuid primary key default gen_random_uuid(),
  ref text unique,                          -- "MSG-0001", "DV-0001" (rempli par le trigger)
  type lead_type not null,
  status lead_status not null default 'new',
  lang text not null default 'fr' check (lang in ('fr', 'en')),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 5 and 200),
  phone text check (phone is null or char_length(phone) <= 40),
  service text,                             -- slug du service (table services en phase 3)
  subject text,                             -- clé du sujet pour les messages
  message text not null check (char_length(message) between 10 and 5000),
  deadline text,
  existing_url text check (existing_url is null or char_length(existing_url) <= 300),
  budget text check (budget is null or char_length(budget) <= 100),  -- saisi librement, facultatif
  ip_hash text,                             -- IP hachée, sert uniquement à limiter les envois
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_ip_recent on leads (ip_hash, created_at desc);
create index leads_status on leads (status, created_at desc);

create function set_lead_ref() returns trigger
  language plpgsql as $$
begin
  if new.ref is null then
    new.ref := case new.type
      when 'devis' then 'DV-' || lpad(nextval('lead_devis_seq')::text, 4, '0')
      else 'MSG-' || lpad(nextval('lead_message_seq')::text, 4, '0')
    end;
  end if;
  return new;
end $$;

create trigger leads_set_ref before insert on leads
  for each row execute function set_lead_ref();

create function touch_updated_at() returns trigger
  language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger leads_touch before update on leads
  for each row execute function touch_updated_at();

-- Sécurité : RLS activé SANS aucune policy.
-- → la clé publique (anon) ne peut ni lire ni écrire dans leads.
-- → seule la clé service_role, utilisée côté serveur par la Server Action, y accède.
-- Les policies admin (lecture et gestion des demandes) arrivent en phase 3.
alter table leads enable row level security;

-- Droits explicites pour le serveur (certains nouveaux projets Supabase ne les donnent plus automatiquement).
grant select, insert, update on table leads to service_role;
grant usage, select on sequence lead_message_seq, lead_devis_seq to service_role;
