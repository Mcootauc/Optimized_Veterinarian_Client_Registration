import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with hardcoded values for the frontend
export const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!, // assert Non-null
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY! // assert Non-null
);

// Submit new client form data to Supabase
export const submitClientFormData = async (formData: any) => {
    try {
        const payload = {
            owner_name: formData.ownerName,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode,
            cell_phone: formData.cellPhone,
            email: formData.email,
            pet_name: formData.petName,
            species: formData.selectSpecies,
            breed: formData.breed,
            birth_date: formData.birthDate, // ISO string
            sex: formData.sex,
            secondary_contact_name: formData.secondaryContactName,
            secondary_contact_cell_phone: formData.contactCellPhone,
            spayed_or_neutered: formData.spayedOrNeutered,
            color: formData.color,
            microchip: formData.microchip,
            initials: formData.initials,
            hospital_id: 1, // TODO: change to the hospital id to specify which hospital the client is from
        };

        const { error } = await supabase.rpc('create_client', { payload });
        if (error) throw error;
        return 'Successfully submitted client information! Thank you!';
    } catch (error: any) {
        console.error('Error submitting client form:', error);
        throw error;
    }
};

// Submit new pet form data to Supabase
export const submitPetFormData = async (formData: any) => {
    try {
        const payload = {
            owner_name: formData.ownerName,
            cell_phone: formData.cellPhone,
            email: formData.email,
            pet_name: formData.petName,
            species: formData.selectSpecies,
            breed: formData.breed,
            birth_date: formData.birthDate, // ISO string
            sex: formData.sex,
            spayed_or_neutered: formData.spayedOrNeutered,
            color: formData.color,
            microchip: formData.microchip,
            initials: formData.initials,
            hospital_id: 1, // TODO: change to the hospital id to specify which hospital the client is from
        };

        const { error } = await supabase.rpc('create_pet', { payload });
        if (error) throw error;
        return 'Successfully submitted pet information! Thank you!';
    } catch (error: any) {
        console.error('Error submitting pet form:', error);
        throw error;
    }
};

// types you can reuse in UI
export type BreedSuggestion = { label: string; value: string };

function speciesToDbSpecies(uiSpecies: string): 'Canine' | 'Feline' | null {
    if (uiSpecies === 'Dog') return 'Canine';
    if (uiSpecies === 'Cat') return 'Feline';
    return null;
}

export async function searchBreedsTop5(params: {
    uiSpecies: string; // 'Dog' | 'Cat' | ...
    query: string;
}): Promise<BreedSuggestion[]> {
    const dbSpecies = speciesToDbSpecies(params.uiSpecies);
    const q = params.query.trim(); // trim the query to remove any leading or trailing whitespace

    if (!dbSpecies) return [];
    if (q.length < 2) return [];

    // 1) prefix-first
    const prefixPattern = `${q}%`;

    const { data: prefixRows, error: prefixErr } = await supabase
        .from('breeds')
        .select('name')
        .eq('species', dbSpecies)
        .ilike('name', prefixPattern) // ilike is case-insensitive like
        .order('name', { ascending: true })
        .limit(5);

    if (prefixErr) throw prefixErr;

    const prefix = (prefixRows ?? []).map((r) => r.name);
    if (prefix.length >= 5) {
        return prefix.slice(0, 5).map((name) => ({ label: name, value: name }));
    }

    // 2) fallback contains to fill remaining slots (optional but nice)
    const remaining = 5 - prefix.length;
    const containsPattern = `%${q}%`;

    const { data: containsRows, error: containsErr } = await supabase
        .from('breeds')
        .select('name')
        .eq('species', dbSpecies)
        .ilike('name', containsPattern)
        .order('name', { ascending: true })
        .limit(10); // grab a few extra; we'll dedupe + take remaining

    if (containsErr) throw containsErr;

    const contains = (containsRows ?? []).map((r) => r.name);

    // de-dupe while preserving order
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
