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
        marginBottom: 8,
    },
    section: {
        marginBottom: 5,
    },
    label: {
        fontSize: 12,
        marginLeft: 2,
        fontFamily: 'Inter_400Regular',
    },
    gridRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        width: '100%',
    },
    labelColumn: {
        width: 130,
        justifyContent: 'center',
    },
    buttonsColumn: {
        flexDirection: 'row',
        gap: 8,
        flex: 1,
    },
    button: {
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: Colors.white,
        flex: 1,
    },
    selectedButton: {
        backgroundColor: Colors.blue,
    },
    buttonText: {
        fontSize: 10,
        fontFamily: 'Inter_400Regular',
    },
    unselectedText: {
        color: Colors.black,
    },
    selectedText: {
        color: Colors.white,
    },
    input: {
        width: '100%',
        height: 35,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 6,
        marginTop: 5,
        paddingLeft: 10,
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
        backgroundColor: Colors.white,
    },
    inputError: {
        borderColor: Colors.red,
    },
    disabledInput: {
        backgroundColor: Colors.gray,
    },
    errorText: {
        color: Colors.red,
        fontSize: 8,
        marginLeft: 5,
        marginBottom: 5,
        fontFamily: 'Inter_600SemiBold',
    },
    microchipErrorText: {
        color: Colors.red,
        fontSize: 8,
        marginLeft: 5,
        marginTop: 5,
        fontFamily: 'Inter_600SemiBold',
    },
});
