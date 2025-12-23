import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const styles = StyleSheet.create({
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
