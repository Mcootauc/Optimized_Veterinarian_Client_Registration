import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AssistanceText({
    width,
    color = Colors.darkBlue,
}: {
    width: number;
    color: string | undefined;
}) {
    const { t } = useLanguage();

    return (
        <View style={[styles.assistanceText, { width: width }]}>
            <Text style={styles.assistanceTextBase}>
                {t('assistanceText')}{' '}
            </Text>
            <Text style={[styles.assistanceTextHighlight, { color: color }]}>
                {t('frontDesk')}
            </Text>
            <Text style={styles.assistanceTextBase}>
                {' '}
                {t('assistanceTextOr')}{' '}
            </Text>
            <Text style={[styles.assistanceTextHighlight, { color: color }]}>
                {t('vetTechnician')}
            </Text>
            <Text style={styles.assistanceTextBase}>
                {t('assistanceTextEnd')}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    assistanceText: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 0,
        paddingHorizontal: 20,
        width: '100%',
    },
    assistanceTextBase: {
        fontSize: 18,
        fontFamily: 'Inter_400Regular',
        color: Colors.black,
        textAlign: 'center',
    },
    assistanceTextHighlight: {
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
        textAlign: 'center',
    },
});
