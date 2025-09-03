import React, { createContext, useContext, useState, ReactNode } from 'react';
import { I18n } from 'i18n-js';
import en from '../translations/en.json';
import zh from '../translations/zh.json';

// Configure i18n
const i18n = new I18n({
    en,
    zh,
});

i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export type Language = 'en' | 'zh';

interface LanguageContextType {
    currentLanguage: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, options?: object) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
    children,
}) => {
    const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

    const setLanguage = (language: Language) => {
        setCurrentLanguage(language);
        i18n.locale = language;
    };

    const t = (key: string, options?: object) => {
        return i18n.t(key, options);
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
