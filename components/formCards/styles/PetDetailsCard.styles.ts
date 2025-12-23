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

    row: {
        flexDirection: 'row',
        gap: 8,
        width: '100%',
    },
    col: {
        flex: 1,
        minWidth: 0,
    },

    input: {
        width: '100%',
        height: 35,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 6,
        paddingLeft: 10,
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
    },
    inputError: {
        borderColor: Colors.red,
        borderWidth: 1,
    },

    dateButton: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 0,
    },
    dateButtonText: {
        color: Colors.black,
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
        paddingLeft: 0,
    },
    dateButtonPlaceholder: {
        color: Colors.gray,
    },

    selectErrorText: {
        color: Colors.red,
        fontSize: 8,
        marginTop: 4,
        marginLeft: 5,
        marginBottom: 0,
        fontFamily: 'Inter_600SemiBold',
    },
    birthDateErrorText: {
        color: Colors.red,
        fontSize: 8,
        marginTop: 4,
        marginLeft: 5,
        marginBottom: 0,
        fontFamily: 'Inter_600SemiBold',
    },

    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 6,
        marginBottom: 0,
        height: 35,
        justifyContent: 'center',
    },

    chevronIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
});

// RNPickerSelect expects a special "style" object, not a StyleSheet style.
export const pickerSelectStyles = {
    inputAndroid: {
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        paddingVertical: 0,
        paddingHorizontal: 0,
        paddingLeft: 10,
        color: Colors.black,
    },
    placeholder: {
        color: Colors.gray,
        paddingLeft: 10,
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
    },
};
