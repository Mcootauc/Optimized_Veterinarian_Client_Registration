# OVIForm — Production Supabase Migration Plan (Prod ← Staging Parity)

> Status: PLANNING ONLY. No SQL has been run against prod. Only read-only
> inspection (`list_tables`, `SELECT`) was performed during research.
>
> - Staging (source of truth, fully migrated/tested): `acmgofotwucibmtwaeob`
> - Production (target of this migration): `uqdolredkukdkoolnubw`
>
> Run every step with the Supabase MCP against `project_id = uqdolredkukdkoolnubw`.
> Use `apply_migration` for DDL (CREATE/ALTER/DROP/RENAME), `execute_sql` for the
> backfill DML and all verification `SELECT`s.

---

## 0. Current Prod State (verified via inspection)

Prod is still on the original legacy schema:

- `public.hospitals` — bigint PK, 3 rows:
    - `1 = Valley Veterinary Hospital` (slug `Valley_Vet_Hospital`) — owns ALL real data
    - `2 = Test Hospital`
    - `3 = Vet Villa Animal Hospital`
- `public.clients` — bigint PK, **619 rows, all `hospital_id = 1`**. This table is
  **denormalized**: every row is one owner _and_ one pet (every row has
  `owner_name`, `pet_name`, `breed`, `species`). `birth_date` is `timestamptz`.
- `public.pets` — bigint PK, **3 rows of test data**, no `client_id` column, just
  `owner_name`/contact. Superseded by the denormalized `clients` table.
- `public.VVH_Clients` — bigint PK, **39 rows**, the older denormalized table the
  `clients` table replaced (comment on `clients`: "This is a duplicate of VVH_Clients").
- `public.breeds` — 329 rows, **RLS disabled**.
- `public.profiles` — 5 real staff rows, all `hospital_id = 1` (bigint FK), `id` → `auth.users.id`.
- Legacy RPCs present (NOT in staging final state): `public.create_client`,
  `public.create_pet`, `public.create_vvh_client`.
- No `internal` schema, no `_v2` tables, no `legacy_id_map`/`pets_unmatched`,
  no `create_client_with_pet`/`create_pet_for_client`, no pet trigger.

### Target (staging) final state to reach

- `public.hospitals/clients/pets` with UUID PKs, RLS + policies (policy names keep the
  `_v2` prefix, e.g. `clients_v2 select own hospital`).
- `public.legacy_id_map`, `public.pets_unmatched` (permanent, never dropped).
- `internal` schema with `current_user_hospital_v2_id()` and
  `set_pet_hospital_from_client()`; `BEFORE INSERT` trigger `pets_v2_set_hospital_id` on `pets`.
- RPCs `create_client_with_pet(p_client jsonb, p_pet jsonb)` and `create_pet_for_client(p_pet jsonb)`.
- `breeds` RLS enabled with `breeds readable to authenticated`.
- `profiles.hospital_id` is `uuid` FK → `hospitals(id)`; legacy bigint column gone.

---

## Prod-specific decisions (confirmed)

1. **Backfill = dedupe + multi-pet owners (SAFE dedupe, not name-only).**
    - 619 legacy rows → remove **34 true repeat submissions** (identical normalized
      `owner_name + pet_name + cell_phone + email`; keep earliest by `created_at,id`).
    - Remaining **585** rows → group by owner identity (`owner_name + cell_phone`) into
      **575 clients**; each client owns 1+ pets (**10 legitimate multi-pet owners**, e.g.
      "koi li" with 4 cats, are preserved). Result: **575 clients, 585 pets**.
    - WARNING: a pure owner-name dedupe (→574) would delete real pets and is rejected.
2. **Kiosk auth user** is created in the **Supabase Dashboard** (Auth → Users), then a
   `profiles` row is inserted via SQL. Email: `kiosk.valleyvet@gmail.com` (confirm final).
3. Staging only ever held a ~7-row sample, so **prod is the first real full backfill**.
4. Legacy prod RPCs (`create_client`, `create_pet`, `create_vvh_client`) and the extra
   `VVH_Clients` table are dropped (they do not exist in staging final state).

### Ordering note (dependency fix vs. the staging narrative)

The staging history lists "RLS policies" in Phase 1 and "functions" in Phase 2, but the
v2 RLS policies _reference_ `internal.current_user_hospital_v2_id()`. So that helper
function must be created **before** the policies. The ordered steps below resolve this;
each step is tagged with its narrative phase number for traceability.

### Optional consolidation (lower risk, fewer rewrites)

Because prod has no live traffic during the migration, you may instead create all
functions/trigger/RPCs **once, after the renames + profiles cleanup**, directly against
the final `public.clients/pets` and `profiles.hospital_id`. That skips the Phase 6 rewrites
entirely. The plan below follows the staging sequence verbatim (the tested path); the
consolidation is called out again at Step 13.

---

## Pre-flight (do before Step 1)

- [ ] Take a **PITR/manual backup** of prod (Supabase Dashboard → Database → Backups).
      This migration drops real tables.
- [ ] Optionally rehearse the whole plan on a Supabase **dev branch** first.
- [ ] Confirm app downtime window (the kiosk should be offline during Steps 9–15).

Baseline counts (record these now):

```sql
select 'hospitals' t, count(*) from public.hospitals
union all select 'clients', count(*) from public.clients
union all select 'pets', count(*) from public.pets
union all select 'VVH_Clients', count(*) from public."VVH_Clients"
union all select 'breeds', count(*) from public.breeds
union all select 'profiles', count(*) from public.profiles;
-- expect: hospitals 3, clients 619, pets 3, VVH_Clients 39, breeds 329, profiles 5
```

---

## Step 1 — Create v2 + support tables (Phase 1)

```sql
create table public.hospitals_v2 (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  created_at timestamptz not null default now()
);

create table public.clients_v2 (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid not null references public.hospitals_v2(id),
  owner_name text not null,
  secondary_contact_name text,
  secondary_contact_cell_phone text,
  street text,
  city text,
  state text,
  zip_code text,
  cell_phone text,
  email text,
  initials text,
  created_at timestamptz not null default now()
);

create table public.pets_v2 (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients_v2(id),
  hospital_id uuid not null references public.hospitals_v2(id),
  pet_name text not null,
  species text,
  breed text,
  birth_date date,
  sex text,
  spayed_or_neutered text,
  color text,
  microchip text,
  initials text,
  created_at timestamptz not null default now()
);

create table public.legacy_id_map (
  source_table text not null check (source_table = any (array['hospitals','clients','pets'])),
  source_id bigint not null,
  new_id uuid not null,
  migrated_at timestamptz not null default now(),
  primary key (source_table, source_id)
);
comment on table public.legacy_id_map is
  'Audit trail mapping legacy bigint IDs to new uuid IDs across the v2 migration. Permanent.';

create table public.pets_unmatched (
  id uuid primary key default gen_random_uuid(),
  source_pet_id bigint not null,
  legacy_hospital_id bigint not null,
  pet_name text, species text, breed text, birth_date date, sex text,
  spayed_or_neutered text, color text, microchip text, initials text,
  owner_name text, email text, cell_phone text,
  candidate_match_count integer not null default 0,
  candidate_client_ids uuid[] not null default '{}'::uuid[],
  source_created_at timestamptz,
  quarantined_at timestamptz not null default now()
);
comment on table public.pets_unmatched is
  'Pets that could not be auto-matched to a client during the v2 migration. Manual review required.';
```

**Verify:**

```sql
select table_name from information_schema.tables
where table_schema='public'
  and table_name in ('hospitals_v2','clients_v2','pets_v2','legacy_id_map','pets_unmatched')
order by 1; -- expect all 5
```

---

## Step 2 — Add `profiles.hospital_id_v2` (Phase 1)

```sql
alter table public.profiles
  add column hospital_id_v2 uuid;

alter table public.profiles
  add constraint profiles_hospital_id_v2_fkey
  foreign key (hospital_id_v2) references public.hospitals_v2(id) on delete restrict;
```

**Verify:**

```sql
select column_name, data_type from information_schema.columns
where table_schema='public' and table_name='profiles' and column_name like 'hospital_id%';
-- expect: hospital_id (bigint), hospital_id_v2 (uuid)
```

---

## Step 3 — Create `internal` schema + hospital-resolver helper (Phase 2, must precede Step 4)

Created reading `p.hospital_id_v2` (the column that exists now). Updated to `p.hospital_id`
later at Step 14.

```sql
create schema if not exists internal;

create or replace function internal.current_user_hospital_v2_id()
returns uuid language sql stable security definer as $$
  select p.hospital_id_v2
  from public.profiles p
  where p.id = auth.uid()
    and p.is_active = true
  limit 1;
$$;
```

**Verify:**

```sql
select n.nspname, p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='internal' and p.proname='current_user_hospital_v2_id';
```

---

## Step 4 — Enable RLS + policies on v2/support tables + breeds (Phase 1)

```sql
alter table public.hospitals_v2     enable row level security;
alter table public.clients_v2       enable row level security;
alter table public.pets_v2          enable row level security;
alter table public.legacy_id_map    enable row level security;
alter table public.pets_unmatched   enable row level security;
alter table public.breeds           enable row level security;

-- hospitals
create policy "hospitals_v2 select own hospital" on public.hospitals_v2
  for select to authenticated
  using (id = internal.current_user_hospital_v2_id());

-- clients
create policy "clients_v2 select own hospital" on public.clients_v2
  for select to authenticated
  using (hospital_id = internal.current_user_hospital_v2_id());
create policy "clients_v2 insert own hospital" on public.clients_v2
  for insert to authenticated
  with check (hospital_id = internal.current_user_hospital_v2_id());
create policy "clients_v2 update own hospital" on public.clients_v2
  for update to authenticated
  using (hospital_id = internal.current_user_hospital_v2_id())
  with check (hospital_id = internal.current_user_hospital_v2_id());

-- pets
create policy "pets_v2 select own hospital" on public.pets_v2
  for select to authenticated
  using (hospital_id = internal.current_user_hospital_v2_id());
create policy "pets_v2 insert own hospital" on public.pets_v2
  for insert to authenticated
  with check (exists (
    select 1 from public.clients_v2 c
    where c.id = pets_v2.client_id
      and c.hospital_id = internal.current_user_hospital_v2_id()));
create policy "pets_v2 update own hospital" on public.pets_v2
  for update to authenticated
  using (hospital_id = internal.current_user_hospital_v2_id())
  with check (hospital_id = internal.current_user_hospital_v2_id());

-- read-only support / reference tables
create policy "legacy_id_map readable to authenticated" on public.legacy_id_map
  for select to authenticated using (true);
create policy "pets_unmatched readable to authenticated" on public.pets_unmatched
  for select to authenticated using (true);
create policy "breeds readable to authenticated" on public.breeds
  for select to authenticated using (true);
```

> Note: `profiles` already has the policy `select own hospital mapping by email` on prod —
> leave it as-is. `breeds` keeps its 329 rows; we only add RLS + a read policy.

**Verify:**

```sql
select tablename, policyname, cmd from pg_policies
where schemaname='public'
  and tablename in ('hospitals_v2','clients_v2','pets_v2','legacy_id_map','pets_unmatched','breeds')
order by tablename, policyname;
-- expect 9 new policies (1 hospitals, 3 clients, 3 pets, legacy_id_map, pets_unmatched, breeds)
select relname, relrowsecurity from pg_class
where relname in ('breeds') ; -- relrowsecurity = true
```

---

## Step 5 — Backfill hospitals (Phase 1 backfill)

Migrate all 3 hospitals; record the bigint→uuid mapping.

```sql
with ins as (
  insert into public.hospitals_v2 (name, slug, created_at)
  select name, slug, created_at from public.hospitals h
  returning id, slug
)
insert into public.legacy_id_map (source_table, source_id, new_id)
select 'hospitals', h.id, ins.id
from public.hospitals h
join ins on ins.slug is not distinct from h.slug;
```

**Verify:**

```sql
select count(*) from public.hospitals_v2;                 -- expect 3
select source_id, new_id from public.legacy_id_map
where source_table='hospitals' order by source_id;        -- expect ids 1,2,3 mapped
-- capture VVH uuid for later sanity:
select new_id as vvh_uuid from public.legacy_id_map where source_table='hospitals' and source_id=1;
```

---

## Step 6 — Build the dedupe scratch map (Phase 1 backfill, prod-specific)

A durable scratch table assigns every legacy client row to its owner's new UUID. (It is
NOT `legacy_id_map`/`pets_unmatched`; it is dropped at Step 8.)

```sql
create table public._mig_client_src as
with base as (
  select
    id as legacy_client_id,
    created_at,
    lower(trim(owner_name))                              as o,
    regexp_replace(coalesce(cell_phone,''),'\D','','g')  as ph,
    lower(trim(coalesce(pet_name,'')))                   as p,
    lower(trim(coalesce(email,'')))                      as e
  from public.clients
),
owner_ids as (
  select o, ph, gen_random_uuid() as new_client_id
  from base
  group by o, ph
)
select b.*, oi.new_client_id
from base b
join owner_ids oi using (o, ph);
```

**Verify (these are the prod-specific dedupe gates — eyeball before continuing):**

```sql
select
  count(*)                          as legacy_rows,          -- 619
  count(distinct new_client_id)     as clients_to_create,    -- 575
  count(distinct (o||'|'||p||'|'||ph||'|'||e)) as pets_to_create -- 585
from public._mig_client_src;
```

---

## Step 7 — Backfill clients + pets + legacy_id_map (Phase 1 backfill, prod-specific)

```sql
-- 7a. clients: one row per owner UUID, attributes from earliest legacy row
insert into public.clients_v2
  (id, hospital_id, owner_name, secondary_contact_name, secondary_contact_cell_phone,
   street, city, state, zip_code, cell_phone, email, initials, created_at)
select distinct on (m.new_client_id)
  m.new_client_id,
  (select new_id from public.legacy_id_map where source_table='hospitals' and source_id=1),
  c.owner_name, c.secondary_contact_name, c.secondary_contact_cell_phone,
  c.street, c.city, c.state, c.zip_code, c.cell_phone, c.email, c.initials, c.created_at
from public._mig_client_src m
join public.clients c on c.id = m.legacy_client_id
order by m.new_client_id, c.created_at, c.id;

-- 7b. legacy_id_map for ALL 619 legacy client ids -> merged client uuid
insert into public.legacy_id_map (source_table, source_id, new_id)
select 'clients', m.legacy_client_id, m.new_client_id
from public._mig_client_src m;

-- 7c. pets: one row per de-duped submission, linked to owner's client.
--     hospital_id set explicitly (the pet trigger does not exist yet).
insert into public.pets_v2
  (id, client_id, hospital_id, pet_name, species, breed, birth_date,
   sex, spayed_or_neutered, color, microchip, initials, created_at)
select distinct on (m.o, m.p, m.ph, m.e)
  gen_random_uuid(),
  m.new_client_id,
  (select new_id from public.legacy_id_map where source_table='hospitals' and source_id=1),
  c.pet_name, c.species, c.breed, c.birth_date::date,
  c.sex, c.spayed_or_neutered, c.color, c.microchip, c.initials, c.created_at
from public._mig_client_src m
join public.clients c on c.id = m.legacy_client_id
order by m.o, m.p, m.ph, m.e, c.created_at, c.id;
```

> `pets_unmatched` is intentionally left empty: in prod's denormalized model every pet
> rides on a client row, so there is nothing to quarantine. The 3 legacy `public.pets`
> test rows are NOT migrated.

**Verify:**

```sql
select count(*) as clients from public.clients_v2;  -- expect 575
select count(*) as pets    from public.pets_v2;      -- expect 585
-- every pet links to a real client and shares its hospital:
select count(*) as orphan_pets from public.pets_v2 p
  left join public.clients_v2 c on c.id=p.client_id where c.id is null;          -- 0
select count(*) as hosp_mismatch from public.pets_v2 p
  join public.clients_v2 c on c.id=p.client_id where p.hospital_id<>c.hospital_id; -- 0
-- all 619 legacy client ids mapped:
select count(*) from public.legacy_id_map where source_table='clients';          -- 619
-- multi-pet owners preserved (spot check):
select c.owner_name, count(*) pets from public.pets_v2 p
  join public.clients_v2 c on c.id=p.client_id
  group by c.owner_name having count(*)>1 order by pets desc;  -- includes "koi li" = 4
```

---

## Step 8 — Backfill `profiles.hospital_id_v2` + drop scratch (Phase 1 backfill)

```sql
update public.profiles p
set hospital_id_v2 = m.new_id
from public.legacy_id_map m
where m.source_table='hospitals' and m.source_id = p.hospital_id;

drop table public._mig_client_src;
```

**Verify:**

```sql
select count(*) as profiles_unmapped from public.profiles where hospital_id_v2 is null; -- 0
select to_regclass('public._mig_client_src') is null as scratch_dropped;                -- true
```

---

## Step 9 — Pet hospital trigger function + trigger (Phase 2)

Created against `clients_v2` (the name that exists now); updated to `clients` at Step 14.

```sql
create or replace function internal.set_pet_hospital_from_client()
returns trigger language plpgsql as $$
declare
  parent_hospital_id uuid;
begin
  select hospital_id into parent_hospital_id
  from public.clients_v2
  where id = new.client_id;

  if parent_hospital_id is null then
    raise exception 'pets.client_id % does not reference a valid client row', new.client_id;
  end if;

  new.hospital_id := parent_hospital_id;
  return new;
end;
$$;

create trigger pets_v2_set_hospital_id
  before insert on public.pets_v2
  for each row execute function internal.set_pet_hospital_from_client();
```

**Verify:**

```sql
select tgname from pg_trigger where tgrelid='public.pets_v2'::regclass and not tgisinternal;
-- expect pets_v2_set_hospital_id
```

---

## Step 10 — RPCs `create_client_with_pet` / `create_pet_for_client` (Phase 2)

Created against `clients_v2`/`pets_v2`; updated to `clients`/`pets` at Step 14.

```sql
create or replace function public.create_client_with_pet(p_client jsonb, p_pet jsonb)
returns jsonb language plpgsql security definer
set search_path to 'public','internal' as $$
declare
  v_hospital  uuid := internal.current_user_hospital_v2_id();
  v_client_id uuid := coalesce((p_client->>'id')::uuid, gen_random_uuid());
  v_pet_id    uuid := coalesce((p_pet->>'id')::uuid,    gen_random_uuid());
begin
  if v_hospital is null then
    raise exception 'caller has no hospital_id (kiosk profile not provisioned)'
      using errcode = '28000';
  end if;

  insert into public.clients_v2 (id, hospital_id, owner_name, secondary_contact_name,
    secondary_contact_cell_phone, street, city, state, zip_code, cell_phone, email, initials)
  values (v_client_id, v_hospital,
    p_client->>'owner_name', p_client->>'secondary_contact_name',
    p_client->>'secondary_contact_cell_phone', p_client->>'street', p_client->>'city',
    p_client->>'state', p_client->>'zip_code', p_client->>'cell_phone',
    p_client->>'email', p_client->>'initials');

  insert into public.pets_v2 (id, client_id, pet_name, species, breed, birth_date,
    sex, spayed_or_neutered, color, microchip, initials)
  values (v_pet_id, v_client_id,
    p_pet->>'pet_name', p_pet->>'species', p_pet->>'breed',
    (p_pet->>'birth_date')::date, p_pet->>'sex', p_pet->>'spayed_or_neutered',
    p_pet->>'color', p_pet->>'microchip', p_pet->>'initials');
  -- pets.hospital_id auto-set by trigger

  return jsonb_build_object('client_id', v_client_id, 'pet_id', v_pet_id);
end;
$$;

create or replace function public.create_pet_for_client(p_pet jsonb)
returns jsonb language plpgsql security definer
set search_path to 'public','internal' as $$
declare
  v_hospital  uuid := internal.current_user_hospital_v2_id();
  v_client_id uuid := (p_pet->>'client_id')::uuid;
  v_pet_id    uuid := coalesce((p_pet->>'id')::uuid, gen_random_uuid());
begin
  if v_hospital is null then
    raise exception 'caller has no hospital_id' using errcode = '28000';
  end if;
  if not exists (select 1 from public.clients_v2 c
                 where c.id = v_client_id and c.hospital_id = v_hospital) then
    raise exception 'client_id % not found in caller hospital', v_client_id
      using errcode = '23503';
  end if;

  insert into public.pets_v2 (id, client_id, pet_name, species, breed, birth_date,
    sex, spayed_or_neutered, color, microchip, initials)
  values (v_pet_id, v_client_id,
    p_pet->>'pet_name', p_pet->>'species', p_pet->>'breed',
    (p_pet->>'birth_date')::date, p_pet->>'sex', p_pet->>'spayed_or_neutered',
    p_pet->>'color', p_pet->>'microchip', p_pet->>'initials');

  return jsonb_build_object('pet_id', v_pet_id);
end;
$$;
```

**Verify:**

```sql
select proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and proname in ('create_client_with_pet','create_pet_for_client');
```

---

## Step 11 — Rename legacy tables out of the way (Phase 3)

```sql
alter table public.clients      rename to clients_legacy;
alter table public.pets         rename to pets_legacy;
alter table public.hospitals    rename to hospitals_legacy;
alter table public."VVH_Clients" rename to "VVH_Clients_legacy";
```

**Verify:**

```sql
select table_name from information_schema.tables where table_schema='public'
  and table_name in ('clients_legacy','pets_legacy','hospitals_legacy','VVH_Clients_legacy')
order by 1; -- expect all 4
```

---

## Step 12 — Promote v2 tables to canonical names (Phase 3)

```sql
alter table public.hospitals_v2 rename to hospitals;
alter table public.clients_v2   rename to clients;
alter table public.pets_v2      rename to pets;
```

> FK/policy/trigger names keep their `_v2` strings (e.g. `clients_v2_hospital_id_fkey`,
> `pets_v2_set_hospital_id`, policy `clients_v2 select own hospital`). This matches staging
> exactly — cosmetic only.

**Verify:**

```sql
select table_name from information_schema.tables where table_schema='public'
  and table_name in ('hospitals','clients','pets') order by 1; -- 3, now uuid-based
select c.relname, a.attname, t.typname from pg_class c
  join pg_attribute a on a.attrelid=c.oid join pg_type t on t.oid=a.atttypid
where c.relname in ('clients','pets','hospitals') and a.attname='id' and a.attnum>0;
-- id typname = uuid for all three
```

---

## Step 13 — Update function bodies after renames (Phase 6)

> Between Step 12 and here the trigger/RPCs reference the now-renamed `clients_v2`/`pets_v2`
> and are temporarily non-functional. That is safe because the kiosk is offline during
> migration. (If you took the **optional consolidation** path, create the functions in
> Steps 9–10 directly against `clients`/`pets`/`p.hospital_id` and skip this step + Step 14's
> helper update.)

```sql
-- trigger fn -> public.clients
create or replace function internal.set_pet_hospital_from_client()
returns trigger language plpgsql as $$
declare
  parent_hospital_id uuid;
begin
  select hospital_id into parent_hospital_id
  from public.clients
  where id = new.client_id;

  if parent_hospital_id is null then
    raise exception 'pets.client_id % does not reference a valid client row', new.client_id;
  end if;

  new.hospital_id := parent_hospital_id;
  return new;
end;
$$;

-- RPCs -> public.clients / public.pets
create or replace function public.create_client_with_pet(p_client jsonb, p_pet jsonb)
returns jsonb language plpgsql security definer
set search_path to 'public','internal' as $$
declare
  v_hospital  uuid := internal.current_user_hospital_v2_id();
  v_client_id uuid := coalesce((p_client->>'id')::uuid, gen_random_uuid());
  v_pet_id    uuid := coalesce((p_pet->>'id')::uuid,    gen_random_uuid());
begin
  if v_hospital is null then
    raise exception 'caller has no hospital_id (kiosk profile not provisioned)'
      using errcode = '28000';
  end if;
  insert into public.clients (id, hospital_id, owner_name, secondary_contact_name,
    secondary_contact_cell_phone, street, city, state, zip_code, cell_phone, email, initials)
  values (v_client_id, v_hospital,
    p_client->>'owner_name', p_client->>'secondary_contact_name',
    p_client->>'secondary_contact_cell_phone', p_client->>'street', p_client->>'city',
    p_client->>'state', p_client->>'zip_code', p_client->>'cell_phone',
    p_client->>'email', p_client->>'initials');
  insert into public.pets (id, client_id, pet_name, species, breed, birth_date,
    sex, spayed_or_neutered, color, microchip, initials)
  values (v_pet_id, v_client_id,
    p_pet->>'pet_name', p_pet->>'species', p_pet->>'breed',
    (p_pet->>'birth_date')::date, p_pet->>'sex', p_pet->>'spayed_or_neutered',
    p_pet->>'color', p_pet->>'microchip', p_pet->>'initials');
  return jsonb_build_object('client_id', v_client_id, 'pet_id', v_pet_id);
end;
$$;

create or replace function public.create_pet_for_client(p_pet jsonb)
returns jsonb language plpgsql security definer
set search_path to 'public','internal' as $$
declare
  v_hospital  uuid := internal.current_user_hospital_v2_id();
  v_client_id uuid := (p_pet->>'client_id')::uuid;
  v_pet_id    uuid := coalesce((p_pet->>'id')::uuid, gen_random_uuid());
begin
  if v_hospital is null then
    raise exception 'caller has no hospital_id' using errcode = '28000';
  end if;
  if not exists (select 1 from public.clients c
                 where c.id = v_client_id and c.hospital_id = v_hospital) then
    raise exception 'client_id % not found in caller hospital', v_client_id
      using errcode = '23503';
  end if;
  insert into public.pets (id, client_id, pet_name, species, breed, birth_date,
    sex, spayed_or_neutered, color, microchip, initials)
  values (v_pet_id, v_client_id,
    p_pet->>'pet_name', p_pet->>'species', p_pet->>'breed',
    (p_pet->>'birth_date')::date, p_pet->>'sex', p_pet->>'spayed_or_neutered',
    p_pet->>'color', p_pet->>'microchip', p_pet->>'initials');
  return jsonb_build_object('pet_id', v_pet_id);
end;
$$;
```

**Verify (no stale `_v2` table refs remain in any function):**

```sql
select n.nspname, p.proname
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname in ('public','internal')
  and pg_get_functiondef(p.oid) ~ '(clients_v2|pets_v2|hospitals_v2)';
-- expect 0 rows
```

---

## Step 14 — Legacy cleanup (Phase 4)

Order matters: drop legacy RPCs and the bigint FK first, then child legacy tables, then
parent. `legacy_id_map` and `pets_unmatched` are NEVER dropped.

```sql
-- 14a. drop prod-only legacy RPCs (they reference legacy tables; not in staging)
drop function if exists public.create_client(jsonb);
drop function if exists public.create_pet(jsonb);
drop function if exists public.create_vvh_client(jsonb);

-- 14b. drop the legacy bigint FK on profiles (profiles.hospital_id -> hospitals_legacy)
alter table public.profiles drop constraint profiles_hospital_id_fkey;

-- 14c. drop legacy tables (children before parent)
drop table public.clients_legacy;
drop table public.pets_legacy;
drop table public."VVH_Clients_legacy";
drop table public.hospitals_legacy;
```

> If `drop function` complains about argument types, confirm exact signatures first:
> `select proname, pg_get_function_identity_arguments(oid) from pg_proc where proname in
('create_client','create_pet','create_vvh_client');` and adjust the `drop` arg lists.

**Verify:**

```sql
select table_name from information_schema.tables where table_schema='public'
  and table_name like '%_legacy'; -- expect 0 rows
select count(*) from public.legacy_id_map;   -- still 622 (3 hospitals + 619 clients)
select to_regclass('public.pets_unmatched') is not null as unmatched_kept; -- true
```

---

## Step 15 — `profiles` column cleanup (Phase 5)

```sql
alter table public.profiles drop constraint profiles_hospital_id_v2_fkey;
alter table public.profiles drop column hospital_id;               -- legacy bigint
alter table public.profiles rename column hospital_id_v2 to hospital_id;
alter table public.profiles
  add constraint profiles_hospital_id_fkey
  foreign key (hospital_id) references public.hospitals(id) on delete restrict;
```

Then update the resolver helper to read the renamed column:

```sql
create or replace function internal.current_user_hospital_v2_id()
returns uuid language sql stable security definer as $$
  select p.hospital_id
  from public.profiles p
  where p.id = auth.uid()
    and p.is_active = true
  limit 1;
$$;
```

**Verify:**

```sql
select column_name, data_type from information_schema.columns
where table_schema='public' and table_name='profiles' and column_name like 'hospital%';
-- expect exactly one: hospital_id (uuid)
select count(*) as broken_fk from public.profiles p
  left join public.hospitals h on h.id=p.hospital_id where h.id is null; -- 0
select pg_get_functiondef('internal.current_user_hospital_v2_id'::regproc) ~ 'p.hospital_id\b'
   and pg_get_functiondef('internal.current_user_hospital_v2_id'::regproc) !~ 'hospital_id_v2' as helper_ok;
```

---

## Step 16 — Post-migration validation & app wiring

1. **Security advisors** — confirm no `rls_disabled` findings remain:
   `get_advisors(project_id=uqdolredkukdkoolnubw, type='security')`.
2. **Smoke-test the RPCs** as the kiosk user (from a signed-in session, e.g. the kiosk
   device or a script using the kiosk JWT — not via `service_role`, so RLS + the helper are
   exercised):
    - `create_client_with_pet` → returns `{client_id, pet_id}`; new rows land in VVH.
    - `create_pet_for_client` with an existing `client_id` → returns `{pet_id}`.
3. **App config** — point the production build at prod
   (`EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` for `uqdolredkukdkoolnubw`,
   `EXPO_PUBLIC_APP_VARIANT=production`). Re-provision the kiosk device via the hidden
   AdminSetup screen using the new kiosk credentials.
4. **Types** — `types/supabase.ts` already matches this final schema, so no code change is
   expected; optionally regenerate to confirm: `generate_typescript_types(uqdolredkukdkoolnubw)`.
5. Final row sanity: `clients = 575`, `pets = 585`, `hospitals = 3`, `profiles = 6`
   (5 staff + 1 kiosk), `breeds = 329`.

---

## Prod-vs-staging differences (flagged)

- **Real data volume:** staging held ~7 sample rows; prod backfills 619 legacy rows into
  575 clients + 585 pets. The dedupe step is prod-only and gated by review queries (Step 6).
- **Denormalized source:** prod's real data is the embedded owner+pet `clients` table, not a
  separate normalized `pets` table — so `pets_unmatched` stays empty and the legacy `pets`
  (3 test rows) + `VVH_Clients` (39 rows) are discarded, not migrated.
- **Extra legacy RPCs:** prod has `create_client`, `create_pet`, `create_vvh_client` that
  staging lacks; dropped in Step 14a.
- **5 existing staff profiles:** must be remapped (Step 8) before the bigint column is
  dropped — staging effectively had none of this real staff data.
- **Ordering fix:** the v2 RLS policies depend on `internal.current_user_hospital_v2_id()`,
  so that helper is created at Step 3 (before Step 4), unlike the loose phase order in the
  staging write-up.
