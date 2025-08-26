import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import Divider from '@/components/Divider';
import CardContainer from '@/components/cardContainer';
import { useLanguage } from '../../contexts/LanguageContext';

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

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
        paddingVertical: 15,
        marginBottom: 0,
    },
    pageTitle: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: Colors.black,
    },
    input: {
        width: '100%',
        height: 35,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 0,
        paddingLeft: 10,
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
    },
    terms: {
        fontSize: 10,
        fontFamily: 'Inter_400Regular',
        paddingBottom: 10,
    },
    inputError: {
        borderColor: Colors.red,
        borderWidth: 1,
    },
    errorText: {
        color: Colors.red,
        fontSize: 8,
        marginTop: 5,
        marginLeft: 5,
        fontFamily: 'Inter_600SemiBold',
    },
});
