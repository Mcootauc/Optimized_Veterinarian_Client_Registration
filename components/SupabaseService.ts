import { supabase } from './supabaseClient';

export const submitFormData = async (formData: any) => {
    try {
        // Create an ISO format timestamp instead of using the localized string
        const timestamp = new Date().toISOString();

        // Transform data to match Supabase column names
        const { data, error } = await supabase.from('clients').insert([
            {
                timestamp: timestamp, // Use the ISO format timestamp
                owner_name: formData.ownerName,
                home_address: formData.homeAddress,
                city: formData.city,
                state: formData.state,
                zip_code: formData.zipCode,
                cell_phone: formData.cellPhone,
                email: formData.email,
                pet_name: formData.petName,
                species: formData.species,
                breed: formData.breed,
                birth_date: formData.birthDate,
                sex: formData.sex,
                spayed_or_neutered: formData.spayedOrNeutered === 'Yes',
                color: formData.color,
                microchip: formData.microchip === 'Yes',
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
