import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en.json';
import zh from './locales/zh.json';

const resources = {
    en: {
        translation: en,
    },
    zh: {
        translation: zh,
    },
};

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'en',
    debug: __DEV__,
    interpolation: {
        escapeValue: false, // React already escapes values
    },
    react: {
        useSuspense: false, // React Native doesn't support Suspense yet
    },
});

// Function to change language (without persistence for now)
export const changeLanguage = async (language: 'en' | 'zh') => {
    try {
        await i18n.changeLanguage(language);
    } catch (error) {
        console.log('Error changing language:', error);
    }
};

// Function to initialize language (default to English for now)
export const initializeLanguage = async () => {
    try {
        // Default to English for now
        await i18n.changeLanguage('en');
    } catch (error) {
        console.log('Error initializing language:', error);
    }
};

export default i18n;
