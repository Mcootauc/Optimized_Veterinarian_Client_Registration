import React from 'react';
import { Text } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

interface TranslatedHeaderProps {
    titleKey: string;
    style: any;
}

export const TranslatedHeader: React.FC<TranslatedHeaderProps> = ({
    titleKey,
    style,
}) => {
    const { t } = useLanguage();

    return <Text style={style}>{t(titleKey)}</Text>;
};
