import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with hardcoded values for the frontend
export const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!, // assert Non-null
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY! // assert Non-null
);

// Submit form data to Supabase
export const submitFormData = async (formData: any) => {
    try {
        // Create an ISO format timestamp instead of using the localized string
        const timestamp = new Date().toISOString();

        // Transform data to match Supabase column names
        const { data, error } = await supabase.from('VVH_Clients').insert([
            {
                timestamp: timestamp, // Use the ISO format timestamp
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
        return 'Successfully submitted! Thank you!';
    } catch (error: any) {
        console.error('Error submitting form:', error);
        throw error;
    }
};
