import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';

export const useLanguage = () => {
    const { t, i18n } = useTranslation();

    const switchLanguage = async () => {
        const newLanguage = i18n.language === 'en' ? 'zh' : 'en';
        await changeLanguage(newLanguage);
    };

    const setLanguage = async (language: 'en' | 'zh') => {
        await changeLanguage(language);
    };

    return {
        t,
        currentLanguage: i18n.language,
        switchLanguage,
        setLanguage,
    };
};
