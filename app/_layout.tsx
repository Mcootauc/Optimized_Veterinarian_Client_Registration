import { Stack } from 'expo-router';
import { Text } from 'react-native';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Valley Veterinary Hospital',
                    headerStyle: { backgroundColor: '#03045E' },
                    headerTintColor: '#FEFEFE',
                    headerTitleAlign: 'center', // still keep this
                    headerTitle: () => (
                        <Text
                            style={{
                                fontFamily: 'Montserrat_700Bold',
                                color: '#FEFEFE',
                                fontSize: 48,
                                textAlign: 'center',
                                width: '100%',
                                paddingBottom: 30,
                                paddingTop: 20,
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
