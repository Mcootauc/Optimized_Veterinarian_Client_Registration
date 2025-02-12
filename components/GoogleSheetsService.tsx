export async function submitFormData(data: any) {
    try {
        const response = await fetch("https://valleyvetkiosk.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.text();
    } catch (error) {
        console.error("Error submitting data:", error);
        throw error;
    }
}
