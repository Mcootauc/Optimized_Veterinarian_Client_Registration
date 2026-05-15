# OVIForm React Native App — Refactor Plan (v2 Tables Cutover)

**Purpose:** Refactor the OVIForm React Native Android app (the intake-forms app) to write to the new normalized `clients_v2`, `pets_v2`, and `hospitals_v2` tables instead of the legacy `clients` and `pets` tables. The schema migration is applied on staging (Supabase project `acmgofotwucibmtwaeob`), and the Next.js website refactor is complete. The RN app is the only remaining piece before production cutover.

**This is the planning prompt.** Do not modify code yet — produce a detailed implementation plan first, get it approved, then execute.

---

## 1. Context

The RN app contains two intake forms used by vet practice staff on an Android device:

- **New Client form** — registers a new owner *and* their first pet at the same time. Currently inserts one row into the legacy `clients` table, which mixed owner and pet fields together.
- **New Pet form** — registers an additional pet for an owner who already exists. Currently inserts into the legacy `pets` table, which has no FK to a client.

The website (separate Next.js project) reads what this app writes and displays it as a feed of recent submissions for vet techs to copy into IDEXX.

Schema state on staging (already applied):

- `hospitals_v2` — uuid PK, replaces `hospitals` (still bigint)
- `clients_v2` — uuid PK, hospital_id is uuid, owner fields only
- `pets_v2` — uuid PK, `client_id` FK to `clients_v2`, `hospital_id` uuid (auto-set by trigger from parent client)
- `legacy_id_map` — audit trail of bigint → uuid mappings
- `pets_unmatched` — quarantine for un-linkable pets (3 rows from staging seed data only)
- `profiles.hospital_id_v2` — uuid column added to profiles, FK to `hospitals_v2`, RLS helper now returns this

RLS enforces `hospital_id` filtering on all `_v2` tables. Anon access is **not** allowed — all inserts must come from an authenticated session.

## 2. Goals

1. New Client form writes one row to `clients_v2` and one row to `pets_v2`, linked via `client_id`, in a single atomic operation.
2. New Pet form writes one row to `pets_v2` with a `client_id` referencing an existing `clients_v2` row.
3. All client_id and pet_id values are UUIDs generated **client-side** before insert.
4. `hospital_id` on inserts comes from the authenticated user's `profiles.hospital_id_v2` — never hardcoded, never trusted from form input.
5. The RN app has a switchable environment configuration so a debug build can talk to staging Supabase while release builds talk to prod.
6. Regenerate Supabase TypeScript types in the RN project from the staging schema.
7. End-to-end test loop: a debug build of the RN app submits a form against staging, and the submission appears as a new card on the website preview URL.

## 3. Non-Goals

- Not redesigning the form UX (no new fields, no layout changes, no validation rule changes — only data plumbing changes).
- Not adding offline support or sync features.
- Not changing the Supabase Auth provider or login flow.
- Not running the migration against prod yet.
- Not modifying the website (already refactored on `feature/normalize-clients-pets` branch).

## 4. Project Audit (Cursor must produce this before any code changes)

Information needed before a precise plan can be written:

1. **Project type:** Expo (managed or bare workflow) or vanilla React Native CLI? Check `package.json`, `app.json`, `app.config.js`, `babel.config.js`.
2. **Current env config:** How are `SUPABASE_URL` and `SUPABASE_ANON_KEY` currently provided to the app? Look for `.env`, `expo-constants`, `react-native-config`, `react-native-dotenv`, hardcoded values, etc.
3. **Supabase client initialization:** Where is `createClient()` called? What does the file look like? Is there one shared instance?
4. **UUID library:** Is `react-native-uuid`, `expo-crypto`, or `crypto.randomUUID()` already available? If not, what should be added?
5. **Form file locations:** Find the New Client form and the New Pet form. Identify the exact insert calls today.
6. **Profile / hospital_id access:** How does the app currently access the logged-in user's `profiles.hospital_id`? Is it cached, fetched on each submit, or both?
7. **Build / run setup:** What's the dev workflow — Expo Go, EAS Build, Android Studio, sideload via USB? Cursor should report what it sees so the testing instructions can be tailored.
8. **Existing TypeScript types:** Where do generated Supabase types live? When were they last generated?

Output a written report of findings before proposing changes.

## 5. Required Changes

### 5.1 Environment configuration — point a debug build at staging

The app needs two sets of Supabase credentials available to the build:

| Env | `SUPABASE_URL` | `SUPABASE_ANON_KEY` |
|---|---|---|
| Production (release builds) | `https://uqdolredkukdkoolnubw.supabase.co` | prod anon key |
| Staging (debug builds) | `https://acmgofotwucibmtwaeob.supabase.co` | staging anon key |

The exact mechanism depends on findings from §4. Common patterns:

- **Expo managed:** `app.config.js` reads from `process.env` at build time, exposes via `expo-constants`. Use EAS Build secrets or `.env.staging` / `.env.production` files plus a build profile to switch.
- **Bare RN with react-native-config:** `.env.staging` and `.env.production`, selected via `ENVFILE=.env.staging` when running.
- **Expo with EAS Build profiles:** define `staging` and `production` profiles in `eas.json` with different env vars per profile.

Cursor proposes the specific approach based on §4 findings. Two requirements regardless:

- **No hardcoded URLs or keys anywhere in source code.** All come from env config.
- The Supabase client setup must log on startup (debug builds only) which environment it connected to (URL is fine to log; anon key is not). This is the single most valuable line of defense against "I thought I was testing against staging but actually hit prod."

### 5.2 Regenerate TypeScript types from staging

```bash
npx supabase gen types typescript \
  --project-id acmgofotwucibmtwaeob \
  > src/types/supabase.ts
```

Adjust the output path to wherever the project currently keeps types. Same as the website — commit this as its own commit so the diff is isolated from logic changes.

### 5.3 UUID generation client-side

Both pet and client IDs are generated in the app before any network call. This lets the New Client form insert both rows in one transaction with the relationship already known, and lets the New Pet form pass a known pet_id to any optimistic UI.

Preferred libraries in order:

1. **`expo-crypto`** if it's an Expo project — `Crypto.randomUUID()` returns a v4 UUID synchronously.
2. **`react-native-get-random-values`** + **`uuid`** package — works in bare RN, polyfills crypto.
3. **`react-native-uuid`** — older, still works.

Centralize the UUID generation in a single helper file (e.g. `src/lib/uuid.ts`) so swapping libraries is a one-line change later.

### 5.4 New Client form refactor

**Old shape (one insert to legacy `clients`):**

```ts
await supabase.from('clients').insert({
  owner_name, cell_phone, email, street, city, state, zip_code,
  pet_name, species, breed, birth_date, sex, color, microchip,
  spayed_or_neutered, initials, hospital_id, // bigint
  secondary_contact_name, secondary_contact_cell_phone,
});
```

**New shape (atomic two-table insert via RPC — recommended):**

Define a Postgres function on the Supabase side:

```sql
CREATE OR REPLACE FUNCTION public.create_client_with_pet(
  p_client jsonb,
  p_pet    jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER  -- runs as the calling user, respects RLS
AS $$
DECLARE
  v_client_id uuid := (p_client->>'id')::uuid;
  v_pet_id    uuid := (p_pet->>'id')::uuid;
BEGIN
  INSERT INTO clients_v2 (id, hospital_id, owner_name, ... ) 
    VALUES (v_client_id, ...);
  INSERT INTO pets_v2 (id, client_id, pet_name, ... )
    VALUES (v_pet_id, v_client_id, ...);
  RETURN jsonb_build_object('client_id', v_client_id, 'pet_id', v_pet_id);
END;
$$;
```

The function runs in a single implicit transaction, so if either insert fails, both roll back. No orphaned client rows.

App-side call:

```ts
const clientId = uuid();
const petId = uuid();
const hospitalId = profile.hospital_id_v2;

const { data, error } = await supabase.rpc('create_client_with_pet', {
  p_client: { id: clientId, hospital_id: hospitalId, owner_name, ... },
  p_pet:    { id: petId,                              pet_name,   ... },
});
```

The `hospital_id` for pets_v2 is auto-populated by the existing BEFORE INSERT trigger from the parent client's hospital_id, so it doesn't need to be passed in the pet payload.

**Fallback (sequential inserts, NOT recommended):** if the RPC approach is rejected, two sequential awaits with explicit rollback on the second-insert failure. The RPC approach is strictly safer and should be the default.

### 5.5 New Pet form refactor — including client lookup

The New Pet form needs a `client_id` to attach the pet to. Today that's not enforced; tomorrow it is. The form needs a way to look up an existing client.

UX options to surface in the plan for Mitchell to choose:

1. **Search field at the top of the form** — type owner name, email, or phone; show matching clients; tap to select. Pet form remains as today below.
2. **Pre-fill from context** — if the form is launched from a "client detail" screen elsewhere in the app, pass the client_id in. Standalone navigation requires search.
3. **Combined** — search is the default entry; pre-fill is supported when navigated from a client context.

Recommend option 3 since it covers both flows.

Search query (server-side, filtered by RLS to the user's hospital):

```ts
supabase
  .from('clients_v2')
  .select('id, owner_name, email, cell_phone')
  .or(`owner_name.ilike.%${q}%, email.ilike.%${q}%, cell_phone.ilike.%${q}%`)
  .limit(10);
```

Insert call:

```ts
const petId = uuid();
const { data, error } = await supabase.from('pets_v2').insert({
  id: petId,
  client_id: selectedClient.id,
  pet_name, species, breed, birth_date, sex, color, microchip,
  spayed_or_neutered, initials,
  // hospital_id intentionally omitted — auto-set by trigger
});
```

### 5.6 Authentication state — must be present at submit time

Both forms must check `supabase.auth.getSession()` before submitting and short-circuit with a clear error if the user is not authenticated. The previous schema allowed loose inserts; the new RLS does not.

If the app is meant to be usable by signed-out staff on a shared device, that's a product decision to surface — but currently the staging RLS rejects anon inserts, so as the code stands, sign-in is required.

### 5.7 Hospital ID handling

`profiles.hospital_id_v2` (uuid) is the source of truth. The app must fetch this once on sign-in, cache it in app state, and pass it into the New Client RPC. Never read it from user input. Never default to a hardcoded UUID. If `hospital_id_v2` is null on the profile, the user must be blocked from submitting with a clear error message.

## 6. Testing Loop

The RN app doesn't have a Vercel preview URL — testing requires a real Android target:

1. Build a debug variant with staging env vars (`.env.staging`, EAS staging profile, or equivalent).
2. Run on Android emulator or sideload to a physical test device via USB.
3. Sign in with a staging test user.
4. Verify the startup log shows the staging Supabase URL.
5. Submit a **New Client** form. Confirm the app reports success.
6. Open the website preview URL (which also points at staging). Confirm a new card appears in the feed with the owner + pet just submitted.
7. Submit a **New Pet** form for that same client (search by owner name, select, fill pet info, submit).
8. Refresh the website preview URL. Confirm a second card appears for the same owner with the new pet.
9. Open the staging Supabase dashboard → Table editor → `clients_v2` and `pets_v2`. Confirm the actual rows exist with correct `client_id` linkage and `hospital_id` matching the test user's hospital.
10. Confirm prod Supabase (`uqdolredkukdkoolnubw`) was **not** written to. If any row appears there from the test, environment config has a leak — stop and fix immediately.

## 7. Rollback

All changes live on a feature branch in the RN repo. Rollback is `git revert` or branch reset. The RPC function added to staging is the only DB change; it can be `DROP FUNCTION`'d without affecting any data.

Production app remains the current release build on the Play Store / internal testing track until both apps work end-to-end against staging and the prod migration runs.

## 8. Commit Order

1. **Project audit report** — no code yet; the findings from §4.
2. **Environment config setup** — staging/prod separation, debug-build URL logging.
3. **TypeScript types regeneration** — large diff, isolated commit.
4. **UUID helper** — `src/lib/uuid.ts`.
5. **Supabase RPC function** — `create_client_with_pet` added to staging only.
6. **New Client form refactor** — switch to RPC call.
7. **New Pet form refactor** — including client lookup UX.
8. **Auth guard checks on submit**.
9. **Cleanup** — remove dead references to legacy tables, update any related tests.

Run the §6 testing loop after each meaningful commit.

## 9. Open Questions to Surface to Mitchell

Cursor should ask, not assume:

1. Is the project Expo (managed/bare) or vanilla React Native CLI?
2. Does the project already have a UUID library, env config tool, or testing setup?
3. New Pet form UX — option 1 (search only), option 2 (context pre-fill only), or option 3 (combined)?
4. Should the RPC `create_client_with_pet` be added permanently or scoped as a temporary migration helper?
5. Is sign-in required (current schema enforces it) or should there be an unauthenticated kiosk mode? (Note: anon RLS is currently off; enabling it would be a separate decision.)

## 10. Cursor — How to Use This Doc

1. Read this whole doc.
2. Run the §4 audit. Produce the written report.
3. Surface the §9 open questions before proposing code changes.
4. Once questions are answered, propose the §8 commit plan with file-level diffs.
5. Wait for explicit approval. Apply commits one at a time, running the §6 testing loop in between.

Do not modify code, run migrations, or change env config in this turn. Read-only project inspection and read-only Supabase MCP queries only.

---

**End of plan.**
