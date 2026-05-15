# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This App Is

OVIForm (Valley Veterinary Hospital Kiosk) is a React Native / Expo kiosk app used by clients at a veterinary clinic to self-register new clients and new pets. It submits data to a Supabase backend via RPC calls (`create_client_with_pet`, `create_pet_for_client`). The app supports English and Mandarin Chinese.

## Commands

```bash
# Start dev server (requires a dev client build on device/emulator)
npm start                         # expo start --dev-client

# Run on Android emulator/device
npm run android                   # expo run:android

# Run tests (watch mode)
npm test

# Lint
npm run lint                      # expo lint

# Build for Android (EAS Cloud)
eas build --profile development --platform android
eas build --platform android --profile production

# Build for Android (local)
eas build --profile development --platform android --local
eas build --platform android --profile production --local

# Regenerate Android native project
npx expo prebuild -p android --clean --non-interactive
```

## Environment Variables

Required in a `.env.example` file (copy to `.env`) at the project root:

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=
EXPO_PUBLIC_APP_VARIANT=
```

The app uses `APP_VARIANT` branching in `app.config.js`. Staging builds resolve to staging url/keys and `com.mitchxcool.ValleyVetKiosk.staging` bundle ID, while production defaults to the prod bundle ID.

## Architecture

### Routing

Uses **expo-router** (file-based). Routes:
- `/` → `app/index.tsx` — Home screen with two buttons
- `/screens/NewClientForm` → `app/screens/NewClientForm.tsx` — Full new-client registration (2-page form)
- `/screens/NewPetForm` → `app/screens/NewPetForm.tsx` — Pet-only registration for existing clients

The root layout (`app/_layout.tsx`) wraps everything in `LanguageProvider` and configures the `Stack` navigator with custom branded headers.

### Forms

Both forms are **multi-page horizontal scroll views** with client-side validation before each page advance. Validation helpers live in `app/ErrorCheck.tsx`. Form state is all local `useState`; no global form state library is used.

**NewClientForm** (2 pages):
- Page 0: `OwnerDetailsCard` + `PetDetailsCard` + `AssistanceText`
- Page 1: `StatusCard` + `SecondaryContact` (optional) + `Terms`

**NewPetForm** (2 pages, similar structure but no address or secondary contact).

### Form Cards (`components/formCards/`)

Each card is a self-contained section passed all its state and error setters as props. Cards use `CardContainer` and `Divider` for consistent layout. Each card has a matching styles file in `components/formCards/styles/`.

| Card | Purpose |
|---|---|
| `OwnerDetailsCard` | Name, address (Google Places), phone, email |
| `PetDetailsCard` | Pet name, species, breed (autocomplete), DOB, sex, color |
| `SecondaryContact` | Optional emergency contact name + phone |
| `StatusCard` | Spayed/neutered status, microchip status |
| `Terms` | Terms text + initials field for agreement |

### Reusable Form Components (`components/formComponents/`)

- `InputField` — standard labeled text input with error display
- `SelectField` — button-group selector (Yes/No/Unknown)
- `DateField` — date picker wrapper
- `AddressInput` — Google Places Autocomplete wrapper
- `BreedAutocompleteField` — calls `searchBreedsTop5` in SupabaseService; queries `breeds` table
- `AssistanceText` — localized help prompt shown on page 1

### Supabase Integration (`app/Services/SupabaseService.ts`)

- Client initialized from `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `submitClientFormData(formData)` — calls RPC `create_client_with_pet` with a payload object
- `submitPetFormData(formData)` — calls RPC `create_pet_for_client`
- `searchBreedsTop5({ uiSpecies, query })` — queries the `breeds` table with prefix-first, then contains fallback
- **Auth / Kiosk mode**: The kiosk device must be provisioned once via a hidden setup screen (long-press the home screen image for 3 seconds to access `AdminSetup.tsx`). A single shared kiosk Supabase user is logged in, and its session is persisted. All RLS and inserts derive `hospital_id` server-side from this user's `profiles.hospital_id_v2`.

### Internationalization

`LanguageContext` (`contexts/LanguageContext.tsx`) uses **i18n-js** with locale files in `translations/en.json` and `translations/zh.json`. All UI strings must go through `const { t } = useLanguage()`. When adding new strings, add keys to both JSON files.

### Colors

All color values are in `constants/Colors.ts`. Never hardcode hex values in component files.
