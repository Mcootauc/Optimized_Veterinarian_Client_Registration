// This file should be in your frontend app's components folder

const API_URL = 'http://localhost:1337'; // Change this to your deployed backend URL in production

export const submitFormData = async (formData: any) => {
    try {
        const response = await fetch(`${API_URL}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit data');
        }

        const data = await response.json();
        return data.message;
    } catch (error: any) {
        console.error('Error submitting form:', error);
        throw error;
    }
};
