# OVIForm — Windows Dev Setup & Bug Fixes (Jun 11, 2026)

## Context

The developer moved from a MacBook to a Windows machine and needed to get the Expo
development environment running again. Along the way several bugs surfaced and were fixed.

---

## Issue 1 — Development Build Not Installed on Emulator

### Problem
Running `npx expo start` and pressing `a` to open Android gave:

```
CommandError: No development build (com.mcootauc.OVIForm) for this project is installed.
```

The Android emulator (`Medium_Tablet`) launched but had never had the OVIForm dev client
APK installed on it (unlike the Mac, which already had it).

### Fix
1. Go to [expo.dev → Builds](https://expo.dev/accounts/mcootaucs-team/projects/OVIForm/builds) and download the latest **development** build APK.
2. Install it on the running emulator:
   ```bash
   adb install "path\to\downloaded.apk"
   ```
   Or drag-and-drop the `.apk` onto the emulator window.
3. Restart Metro (`npx expo start`) and press `a` — the dev client will connect.

> **Note:** The `development` EAS profile uses `APP_VARIANT: staging`, so the installed
> package ID is `com.mcootauc.OVIForm.staging`.

---

## Issue 2 — `react-native-url-polyfill/auto` Could Not Be Resolved

### Problem
After the APK was installed, Metro threw a bundling error:

```
Unable to resolve "react-native-url-polyfill/auto" from "app\Services\SupabaseService.ts"
```

### Root Cause
`node_modules` had never been installed on the Windows machine (fresh checkout).
The package was listed in `package.json` but not on disk.

### Fix
```bash
npm install
```

---

## Issue 3 — `crypto.randomUUID is not a function`

### Problem
After the app loaded and a form was submitted, an error dialog appeared:

```
Failed to submit data: crypto.randomUUID is not a function (it is undefined)
```

### Root Cause
`lib/uuid.ts` called `crypto.randomUUID()` directly. React Native's Hermes JS engine
does not implement `crypto.randomUUID` — it only has `crypto.getRandomValues` (polyfilled
by `react-native-get-random-values`).

### Fix (`lib/uuid.ts`)
Replaced the `crypto.randomUUID()` call with a manual RFC 4122 v4 UUID implementation
using `crypto.getRandomValues`, which Hermes supports via the polyfill:

```ts
import 'react-native-get-random-values';

export const uuid = (): string => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return [...bytes]
        .map((b, i) =>
            [4, 6, 8, 10].includes(i)
                ? '-' + b.toString(16).padStart(2, '0')
                : b.toString(16).padStart(2, '0')
        )
        .join('');
};
```

---

## Issue 4 — Table Names Renamed from `_v2` to Plain Names

### Background
The Supabase staging DB had already been migrated: tables were renamed from
`clients_v2` / `pets_v2` / `hospitals_v2` to `clients` / `pets` / `hospitals`.
However, the codebase and Supabase function bodies had not been updated to match.

### Changes Made

#### `app/Services/SupabaseService.ts`
```ts
// Before
.from('clients_v2')

// After
.from('clients')
```

#### `types/supabase.ts`
- Removed the old legacy `clients`, `pets`, `hospitals` table definitions (integer-ID schema).
- Renamed `clients_v2`, `pets_v2`, `hospitals_v2` type blocks to `clients`, `pets`, `hospitals`.
- Updated all internal `referencedRelation` and foreign key name strings accordingly.

#### Supabase RPC — `create_client_with_pet` (staging: `acmgofotwucibmtwaeob`)
```sql
-- Before
INSERT INTO public.clients_v2 ...
INSERT INTO public.pets_v2 ...

-- After
INSERT INTO public.clients ...
INSERT INTO public.pets ...
```

#### Supabase RPC — `create_pet_for_client` (staging)
```sql
-- Before
SELECT 1 FROM public.clients_v2 ...
INSERT INTO public.pets_v2 ...

-- After
SELECT 1 FROM public.clients ...
INSERT INTO public.pets ...
```

---

## Issue 5 — `relation "public.clients_v2" does not exist` (Trigger)

### Problem
After the RPC bodies were updated, form submission still failed with:

```
Failed to submit data: relation "public.clients_v2" does not exist
```

### Root Cause
A BEFORE INSERT trigger on the `pets` table fired a function
`internal.set_pet_hospital_from_client()` that was missed during the initial sweep.
It looked up `hospital_id` by querying `public.clients_v2`, which no longer exists:

```sql
SELECT hospital_id
  INTO parent_hospital_id
  FROM public.clients_v2        -- ← still pointing at old name
 WHERE id = new.client_id;
```

### Fix
Updated `internal.set_pet_hospital_from_client` in Supabase to query `public.clients`:

```sql
CREATE OR REPLACE FUNCTION internal.set_pet_hospital_from_client()
 RETURNS trigger LANGUAGE plpgsql AS $$
declare
  parent_hospital_id uuid;
begin
  select hospital_id
    into parent_hospital_id
    from public.clients
   where id = new.client_id;

  if parent_hospital_id is null then
    raise exception 'pets.client_id % does not reference a valid client row', new.client_id;
  end if;

  new.hospital_id := parent_hospital_id;
  return new;
end;
$$;
```

Also dropped a stray `public.set_pet_hospital_from_client()` function that had been
accidentally created in the wrong schema during an earlier fix attempt.

A final sweep confirmed zero remaining `clients_v2 / pets_v2 / hospitals_v2` references
across all Supabase functions.

---

## Issue 6 — `profiles.hospital_id` Cleanup (int8 → uuid rename)

### Background
The `profiles` table had two hospital columns left over from the legacy-to-v2 migration:

| Column | Type | Purpose |
|---|---|---|
| `hospital_id` | `bigint` | Legacy integer FK (unused) |
| `hospital_id_v2` | `uuid` | Active FK → `public.hospitals(id)` |

The goal was to drop the dead integer column and rename `hospital_id_v2` → `hospital_id`.

### Schema Changes (staging: `acmgofotwucibmtwaeob`)

```sql
-- 1. Drop the old FK constraint on hospital_id_v2
ALTER TABLE public.profiles DROP CONSTRAINT profiles_hospital_id_v2_fkey;

-- 2. Drop the legacy integer column
ALTER TABLE public.profiles DROP COLUMN hospital_id;

-- 3. Rename uuid column to the clean name
ALTER TABLE public.profiles RENAME COLUMN hospital_id_v2 TO hospital_id;

-- 4. Re-add FK under the clean constraint name
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_hospital_id_fkey
  FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id) ON DELETE RESTRICT;
```

### Function Updated — `internal.current_user_hospital_v2_id()`

This helper is called by both RPCs to resolve the logged-in kiosk user's hospital.
It was reading `p.hospital_id_v2`; updated to read `p.hospital_id`:

```sql
CREATE OR REPLACE FUNCTION internal.current_user_hospital_v2_id()
 RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT p.hospital_id          -- was: p.hospital_id_v2
  FROM public.profiles p
  WHERE p.id = auth.uid()
    AND p.is_active = true
  LIMIT 1;
$$;
```

> The function name `current_user_hospital_v2_id` was kept as-is to avoid cascading
> renames in the two RPCs that call it.

### RPCs Updated (error message strings only)

Both `create_client_with_pet` and `create_pet_for_client` had error messages that
referenced `hospital_id_v2` as a string — updated to `hospital_id` for clarity.

### `types/supabase.ts` — `profiles` block

- Removed `hospital_id: number` and `hospital_id_v2: string` fields
- Added single `hospital_id: string` (uuid) field
- Removed the `profiles_hospital_id_v2_fkey` relationship entry

---

## Final State

| Area | Status |
|---|---|
| `node_modules` installed | ✓ |
| `lib/uuid.ts` — Hermes-compatible UUID | ✓ |
| `SupabaseService.ts` — `.from('clients')` | ✓ |
| `types/supabase.ts` — `_v2` types removed | ✓ |
| RPC `create_client_with_pet` | ✓ Updated in staging |
| RPC `create_pet_for_client` | ✓ Updated in staging |
| Trigger `internal.set_pet_hospital_from_client` | ✓ Updated in staging |
| `profiles.hospital_id` bigint column | ✓ Dropped |
| `profiles.hospital_id_v2` → `hospital_id` (uuid) | ✓ Renamed in staging |
| `internal.current_user_hospital_v2_id()` | ✓ Reads new `hospital_id` column |
