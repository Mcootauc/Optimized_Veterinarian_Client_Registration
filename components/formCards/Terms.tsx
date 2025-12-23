import { View, Text, TextInput } from 'react-native';
import Divider from '@/components/Divider';
import CardContainer from '@/components/cardContainer';
import { useLanguage } from '../../contexts/LanguageContext';
import { styles } from './styles/Terms.styles';

export default function Terms({
    initials,
    setInitials,
    initialsError,
    setInitialsError,
    width,
    hasError,
    dividerColor,
}: {
    initials: string;
    setInitials: (text: string) => void;
    initialsError: string;
    setInitialsError: (text: string) => void;
    width: number;
    hasError: boolean;
    dividerColor: string;
}) {
    const { t } = useLanguage();
    return (
        <CardContainer hasError={hasError} paddingBottom={0}>
            <View style={[styles.container, { width: width - 80 }]}>
                <Text style={styles.pageTitle}>{t('terms')}</Text>
                <Divider
                    color={dividerColor}
                    width={2}
                    orientation="horizontal"
                />
                <Text style={styles.terms}>{t('termsText1')}</Text>
                <Text style={styles.terms}>{t('termsText2')}</Text>
                <TextInput
                    style={[
                        styles.input,
                        initialsError ? styles.inputError : null,
                    ]}
                    placeholder={t('enterInitials')}
                    value={initials}
                    onChangeText={(text) => {
                        setInitials(text);
                        setInitialsError('');
                    }}
                />
                {initialsError ? (
                    <Text style={styles.errorText}>{initialsError}</Text>
                ) : null}
            </View>
        </CardContainer>
    );
}
