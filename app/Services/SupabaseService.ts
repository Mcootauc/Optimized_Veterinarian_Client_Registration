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
