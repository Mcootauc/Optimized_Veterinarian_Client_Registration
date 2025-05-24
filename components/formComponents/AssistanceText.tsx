import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function AssistanceText({ width }: { width: number }) {
    return (
        <View style={[styles.assistanceText, { width: width }]}>
            <Text style={styles.assistanceTextBase}>
                If you have any questions, please ask the{' '}
            </Text>
            <Text style={styles.assistanceTextHighlight}>front desk</Text>
            <Text style={styles.assistanceTextBase}> or any available </Text>
            <Text style={styles.assistanceTextHighlight}>vet technician</Text>
            <Text style={styles.assistanceTextBase}>!</Text>
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
        color: Colors.darkBlue,
        textAlign: 'center',
    },
});
