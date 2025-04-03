export default {
    expo: {
        name: 'OVCR',
        slug: 'ValleyVetKiosk',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/images/icon.png',
        scheme: 'myapp',
        userInterfaceStyle: 'automatic',
        splash: {
            image: './assets/images/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/images/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
            package: 'com.mitchxcool.ValleyVetKiosk',
            permissions: ['ACCESS_FINE_LOCATION'],
        },
        web: {
            bundler: 'metro',
            output: 'static',
            favicon: './assets/images/favicon.png',
        },
        plugins: ['expo-router', 'expo-font'],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            router: {
                origin: false,
            },
            extra: {
                googlePlacesApiKey:
                    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
            },
            eas: {
                projectId: '58810248-3b21-4e46-b000-cd0ef968c56e',
            },
        },
    },
};
