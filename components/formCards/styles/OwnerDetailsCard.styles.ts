import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
        paddingVertical: 0,
        marginTop: 15,
    },
    pageTitle: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: Colors.black,
    },

    nameRow: {
        flexDirection: 'row',
        gap: 8,
        width: '100%',
    },
    nameCol: {
        flex: 1,
        minWidth: 0,
    },

    addressWrapBase: {
        position: 'relative',
    },

    addressErrorContainer: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        paddingLeft: 5,
    },
    addressErrorText: {
        color: Colors.red,
        fontSize: 8,
        fontFamily: 'Inter_600SemiBold',
    },

    clearButton: {
        position: 'absolute',
        right: 5,
        top: 8,
        paddingVertical: 3,
        paddingHorizontal: 7,
        backgroundColor: Colors.blue,
        borderRadius: 6,
        zIndex: 2,
    },
    clearButtonDisabled: {
        backgroundColor: Colors.gray,
    },
    clearButtonText: {
        color: Colors.white,
        fontSize: 8,
        fontFamily: 'Inter_700Bold',
    },
    clearButtonTextDisabled: {
        color: Colors.borderColor,
    },

    // Google places base styles (we'll conditionally override borderColor)
    gpTextInput: {
        height: 35,
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        borderWidth: 1,
        borderRadius: 6,
        paddingLeft: 10,
        paddingRight: 48,
        backgroundColor: Colors.white,
    },
    gpListView: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
        margin: 0,
        fontSize: 12,
        maxHeight: 304,
        position: 'absolute',
        width: '100%',
        top: 34,
        zIndex: 1000,
    },
    gpRow: {
        padding: 10,
        height: 35,
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
    },
    gpDescription: {
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
    },
});
