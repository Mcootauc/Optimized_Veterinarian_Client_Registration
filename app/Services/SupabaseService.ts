import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with hardcoded values for the frontend
export const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!, // assert Non-null
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY! // assert Non-null
);

// Submit new client form data to Supabase
export const submitClientFormData = async (formData: any) => {
    try {
        // Transform data to match Supabase column names
        const { data, error } = await supabase.from('clients').insert([
            {
                hospital_id: 1,
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
                birth_date: formData.birthDate,
                sex: formData.sex,
                spayed_or_neutered: formData.spayedOrNeutered,
                color: formData.color,
                microchip: formData.microchip,
                initials: formData.initials,
            },
        ]);

        if (error) throw error;
        return 'Successfully submitted client! Thank you!';
    } catch (error: any) {
        console.error('Error submitting client form:', error);
        throw error;
    }
};

// Submit new client form data to Supabase
export const submitPetFormData = async (formData: any) => {
    try {
        // Transform data to match Supabase column names
        const { data, error } = await supabase.from('clients').insert([
            {
                hospital_id: 1,
                owner_name: formData.ownerName,
                cell_phone: formData.cellPhone,
                email: formData.email,
                pet_name: formData.petName,
                species: formData.selectSpecies,
                breed: formData.breed,
                birth_date: formData.birthDate,
                sex: formData.sex,
                spayed_or_neutered: formData.spayedOrNeutered,
                color: formData.color,
                microchip: formData.microchip,
                initials: formData.initials,
            },
        ]);

        if (error) throw error;
        return 'Successfully submitted pet! Thank you!';
    } catch (error: any) {
        console.error('Error submitting pet form:', error);
        throw error;
    }
};
