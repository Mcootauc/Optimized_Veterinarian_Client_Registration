import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function CardContainer({
    children,
    hasError,
}: {
    children: React.ReactNode;
    hasError: boolean;
}) {
    return (
        <View style={styles.cardContainer}>
            <View style={[styles.card, hasError && styles.cardError]}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25,
    },
    card: {
        width: '100%',
        backgroundColor: '#FEFEFE',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#76767633',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        paddingBottom: 25,
        marginVertical: 5,
    },
    cardError: {
        borderColor: Colors.red,
    },
});
