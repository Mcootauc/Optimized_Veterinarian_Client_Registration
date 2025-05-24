export const containsEmoji = (text: string) => {
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]/u;
    return emojiRegex.test(text);
};

export const containsOnlyLettersAndSpaces = (text: string) => {
    return /^[A-Za-z\s]+$/.test(text);
};
export const containsOnlyNumbers = (text: string) => {
    return /^\d+$/.test(text);
};
export const isValidAddress = (text: string) => {
    return /^[A-Za-z0-9\s\-\.,#]+$/.test(text);
};

export const isValidPhone = (text: string) => {
    return /^\d{10}$/.test(text.replace(/\D/g, ''));
};

export const isValidEmail = (text: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
};
