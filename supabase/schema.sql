-- ==========================================
-- BROCANTE ISABELLA - SCHEMA SUPABASE
-- ==========================================
-- À exécuter dans Supabase SQL Editor

-- 1. Extension pour UUID
create extension if not exists "uuid-ossp";

-- 2. Table products
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,

  -- Infos principales
  title text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  currency text default 'EUR' not null,

  -- Catégorisation
  category text not null check (category in (
    'robes', 'hauts', 'bas', 'chaussures', 'accessoires', 'sacs', 'autre'
  )),
  size text,
  brand text,
  color text,
  condition text check (condition in ('neuf', 'tres-bon', 'bon', 'correct')),

  -- Photos (URLs Supabase Storage)
  images text[] default '{}' not null,

  -- Statut
  status text default 'available' not null check (status in (
    'available', 'reserved', 'sold'
  )),

  -- SEO / tri
  slug text unique
);

-- 3. Index pour performance
create index if not exists products_status_idx on public.products(status);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_created_at_idx on public.products(created_at desc);

-- 4. Trigger updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- 5. Slug auto-generation
create or replace function public.generate_slug()
returns trigger as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug = lower(regexp_replace(
      regexp_replace(new.title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )) || '-' || substring(new.id::text from 1 for 8);
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_products_slug on public.products;
create trigger set_products_slug
  before insert on public.products
  for each row execute function public.generate_slug();

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

alter table public.products enable row level security;

-- Tout le monde peut LIRE les produits disponibles/réservés/vendus
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public"
  on public.products for select
  using (true);

-- Seuls les utilisateurs authentifiés peuvent INSÉRER
drop policy if exists "products_insert_authenticated" on public.products;
create policy "products_insert_authenticated"
  on public.products for insert
  with check (auth.role() = 'authenticated');

-- Seuls les utilisateurs authentifiés peuvent METTRE À JOUR
drop policy if exists "products_update_authenticated" on public.products;
create policy "products_update_authenticated"
  on public.products for update
  using (auth.role() = 'authenticated');

-- Seuls les utilisateurs authentifiés peuvent SUPPRIMER
drop policy if exists "products_delete_authenticated" on public.products;
create policy "products_delete_authenticated"
  on public.products for delete
  using (auth.role() = 'authenticated');

-- ==========================================
-- STORAGE BUCKET
-- ==========================================
-- À exécuter aussi dans SQL Editor (ou créer manuellement via Dashboard)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760, -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Storage policies
drop policy if exists "product_images_select_public" on storage.objects;
create policy "product_images_select_public"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "product_images_insert_authenticated" on storage.objects;
create policy "product_images_insert_authenticated"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "product_images_update_authenticated" on storage.objects;
create policy "product_images_update_authenticated"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "product_images_delete_authenticated" on storage.objects;
create policy "product_images_delete_authenticated"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
