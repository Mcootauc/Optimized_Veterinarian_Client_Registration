import { Stack } from 'expo-router';
import { Text } from 'react-native';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Valley Veterinary Hospital',
                    headerStyle: { backgroundColor: '#224d94' },
                    headerTintColor: '#fff',
                    headerTitleAlign: 'center', // still keep this
                    headerTitle: () => (
                        <Text
                            style={{
                                fontFamily: 'Montserrat_700Bold',
                                color: '#fff',
                                fontSize: 25,
                                textAlign: 'center',
                                width: '100%',
                                padding: 0,
                                margin: 0,
                            }}
                        >
                            Valley Veterinary Hospital
                        </Text>
                    ),
                }}
            />
        </Stack>
    );
}
