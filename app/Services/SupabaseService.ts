import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { uuid } from '@/lib/uuid';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const variant = process.env.EXPO_PUBLIC_APP_VARIANT ?? 'production';

// Initialize Supabase client
export const supabase = createClient(url, key, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

if (__DEV__) {
    console.log(`[supabase] variant=${variant} url=${url}`);
}

// Keep the old submit functions signature so things don't break until we refactor them
export const submitClientFormData = async (formData: any) => {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session)
        throw new Error('Device not provisioned. Please contact staff.');

    const p_client = {
        id: uuid(),
        owner_name: formData.ownerName,
        secondary_contact_name: formData.secondaryContactName || null,
        secondary_contact_cell_phone: formData.contactCellPhone || null,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        cell_phone: formData.cellPhone,
        email: formData.email,
        initials: formData.initials,
    };
    const p_pet = {
        id: uuid(),
        pet_name: formData.petName,
        species: formData.selectSpecies,
        breed: formData.breed,
        birth_date: formData.birthDate, // YYYY-MM-DD
        sex: formData.sex,
        spayed_or_neutered: formData.spayedOrNeutered,
        color: formData.color,
        microchip: formData.microchip,
        initials: formData.initials,
    };

    const { data, error } = await supabase.rpc('create_client_with_pet', {
        p_client,
        p_pet,
    });
    if (error) throw error;
    return 'Successfully submitted client information! Thank you!';
};

export type ClientSearchResult = {
    id: string;
    owner_name: string;
    email: string | null;
    cell_phone: string | null;
};

export const searchClients = async (
    q: string
): Promise<ClientSearchResult[]> => {
    const trimmed = q.trim();
    if (trimmed.length < 2) return [];
    const pattern = `%${trimmed}%`;
    const { data, error } = await supabase
        .from('clients')
        .select('id, owner_name, email, cell_phone')
        .or(
            `owner_name.ilike.${pattern},email.ilike.${pattern},cell_phone.ilike.${pattern}`
        )
        .order('owner_name')
        .limit(10);
    if (error) throw error;
    return data ?? [];
};

export const submitPetFormData = async (formData: any) => {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session)
        throw new Error('Device not provisioned. Please contact staff.');
    if (!formData.clientId) throw new Error('No client selected.');

    const p_pet = {
        id: uuid(),
        client_id: formData.clientId,
        pet_name: formData.petName,
        species: formData.selectSpecies,
        breed: formData.breed,
        birth_date: formData.birthDate,
        sex: formData.sex,
        spayed_or_neutered: formData.spayedOrNeutered,
        color: formData.color,
        microchip: formData.microchip,
        initials: formData.initials,
    };
    const { data, error } = await supabase.rpc('create_pet_for_client', {
        p_pet,
    });
    if (error) throw error;
    return 'Successfully submitted pet information! Thank you!';
};

// types you can reuse in UI
export type BreedSuggestion = { label: string; value: string };

function speciesToDbSpecies(uiSpecies: string): 'Canine' | 'Feline' | null {
    if (uiSpecies === 'Dog') return 'Canine';
    if (uiSpecies === 'Cat') return 'Feline';
    return null;
}

export async function searchBreedsTop5(params: {
    uiSpecies: string;
    query: string;
}): Promise<BreedSuggestion[]> {
    const dbSpecies = speciesToDbSpecies(params.uiSpecies);
    const q = params.query.trim();

    if (!dbSpecies) return [];
    if (q.length < 2) return [];

    const prefixPattern = `${q}%`;

    const { data: prefixRows, error: prefixErr } = await supabase
        .from('breeds')
        .select('name')
        .eq('species', dbSpecies)
        .ilike('name', prefixPattern)
        .order('name', { ascending: true })
        .limit(5);

    if (prefixErr) throw prefixErr;

    const prefix = (prefixRows ?? []).map((r: any) => r.name);
    if (prefix.length >= 5) {
        return prefix.slice(0, 5).map((name) => ({ label: name, value: name }));
    }

    const remaining = 5 - prefix.length;
    const containsPattern = `%${q}%`;

    const { data: containsRows, error: containsErr } = await supabase
        .from('breeds')
        .select('name')
        .eq('species', dbSpecies)
        .ilike('name', containsPattern)
        .order('name', { ascending: true })
        .limit(10);

    if (containsErr) throw containsErr;

    const contains = (containsRows ?? []).map((r: any) => r.name);

    const out: string[] = [];
    const seen = new Set<string>();
    for (const name of [...prefix, ...contains]) {
        if (seen.has(name)) continue;
        seen.add(name);
        out.push(name);
        if (out.length === 5) break;
    }

    return out.map((name) => ({ label: name, value: name }));
}
