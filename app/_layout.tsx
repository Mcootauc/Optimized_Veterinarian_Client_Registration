import { Stack } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import {
    Inter_400Regular,
    Inter_700Bold,
    useFonts,
} from '@expo-google-fonts/inter';
import { LanguageProvider } from '../contexts/LanguageContext';
import { TranslatedHeader } from '../components/TranslatedHeader';

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <LanguageProvider>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Valley Veterinary Hospital',
                        headerStyle: { backgroundColor: '#03045E' },
                        headerTintColor: '#FEFEFE',
                        headerTitleAlign: 'center', // still keep this
                        headerTitle: () => (
                            <TranslatedHeader
                                titleKey="appTitle"
                                style={{
                                    fontFamily: 'Inter_700Bold',
                                    color: '#FEFEFE',
                                    fontSize: 28,
                                    textAlign: 'center',
                                    width: '100%',
                                    paddingBottom: 40,
                                    paddingTop: 20,
                                    paddingRight: 30,
                                    margin: 0,
                                }}
                            />
                        ),
                    }}
                />

                {/* New‑client form */}
                <Stack.Screen
                    name="screens/NewClientForm" // <‑ file‑system route
                    options={{
                        headerStyle: { backgroundColor: Colors.darkBlue },
                        headerTintColor: Colors.white, // colour for the back arrow
                        // override the title so we can use our own font
                        headerTitle: () => (
                            <TranslatedHeader
                                titleKey="newClientRegistration"
                                style={{
                                    fontFamily: 'Inter_700Bold',
                                    fontSize: 16,
                                    color: Colors.white,
                                }}
                            />
                        ),
                    }}
                />
                {/* New‑pet form */}
                <Stack.Screen
                    name="screens/NewPetForm" // <‑ file‑system route
                    options={{
                        headerStyle: { backgroundColor: Colors.steelBlue },
                        headerTintColor: Colors.white, // colour for the back arrow
                        // override the title so we can use our own font
                        headerTitle: () => (
                            <TranslatedHeader
                                titleKey="newPetRegistration"
                                style={{
                                    fontFamily: 'Inter_700Bold',
                                    fontSize: 16,
                                    color: Colors.white,
                                }}
                            />
                        ),
                    }}
                />
            </Stack>
        </LanguageProvider>
    );
}
