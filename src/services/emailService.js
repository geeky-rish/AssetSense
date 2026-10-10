// Service to handle sending email alerts securely via the backend

const API_URL = 'http://localhost:3000/api/send-alert';

export const sendCriticalAlert = async (alertPacket) => {
    try {
        console.log('EmailService: Sending alert packet to backend...', alertPacket);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(alertPacket),
        });

        if (!response.ok) {
            throw new Error(`Backend responded with status ${response.status}`);
        }

        const data = await response.json();
        console.log('EmailService: Success:', data);
        return true;
    } catch (error) {
        console.error('EmailService: Failed to send email alert:', error);
        // We do not throw here so the simulation doesn't crash, but we log the error.
        return false;
    }
};
