import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import {
    useFonts,
    Inter_300Light,
    Inter_600SemiBold,
} from '@expo-google-fonts/inter';

export default function Index() {
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        Inter_300Light,
        Inter_600SemiBold,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('./images/homepageImage.png')}
                style={styles.image}
                resizeMode="contain"
            />

            <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={() => router.push('/screens/NewClientForm')}
            >
                <Text style={styles.buttonText}>New Client Registration</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => router.push('/screens/NewPetForm')}
            >
                <Text style={styles.buttonText}>New Pet Registration</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>
                © 2025 OVIForm. All rights reserved.
            </Text>
        </View>
    );
}

const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: 20,
    },
    image: {
        width: '75%',
        height: screenHeight * 0.4, // Use 40% of screen height
        maxHeight: 400, // Set a maximum height
    },
    button: {
        width: '75%',
        height: 70,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: Colors.darkBlue,
    },
    secondaryButton: {
        backgroundColor: Colors.steelBlue,
    },
    buttonText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 22,
        color: Colors.white,
    },
    footer: {
        fontFamily: 'Inter_300Light',
        fontSize: 12,
        color: Colors.gray,
    },
});
