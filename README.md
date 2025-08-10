# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1.  Install dependencies

    ```bash
    npm install
    ```

2.  Start the app

        ```bash
         npx expo start
        ```

    ** non local commands **
    eas build --profile development --platform android
    eas build --platform android --profile production

    ** local commands **
    eas build --profile development --platform android --local
    eas build --platform android --profile production --local

    Clean and regenerate Android native project
    npx expo prebuild -p android --clean --non-interactive

    Install and run the dev client on an emulator/device
    npx expo run:android
