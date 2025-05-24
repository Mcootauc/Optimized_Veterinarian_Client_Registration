import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function CardContainer({
    children,
    hasError,
    paddingVertical, // Kept for backward compatibility but not used
    paddingBottom = 25,
}: {
    children: React.ReactNode;
    hasError: boolean;
    paddingVertical?: number;
    paddingBottom?: number;
}) {
    const dynamicStyles = StyleSheet.create({
        card: {
            paddingBottom,
        },
    });

    return (
        <View style={styles.cardContainer}>
            <View
                style={[
                    styles.card,
                    dynamicStyles.card,
                    hasError && styles.cardError,
                ]}
            >
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
        backgroundColor: Colors.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#76767633',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
        paddingHorizontal: 10,
        paddingTop: 0, // No padding at the top
    },
    cardError: {
        borderColor: Colors.red,
    },
});
