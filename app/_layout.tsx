import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Valley Vet Hospital',
                    headerStyle: { backgroundColor: '#224d94' }, // set your desired background color
                    headerTintColor: '#fff', // optional: change the text color
                    headerTitleStyle: { fontFamily: 'Montserrat_700Bold' }, // optional: style the title text
                }}
            />
        </Stack>
    );
}
