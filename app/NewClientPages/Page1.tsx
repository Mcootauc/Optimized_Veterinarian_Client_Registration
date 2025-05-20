import { useRef } from 'react';
import Divider from '../../components/Divider';
import { Colors } from '../../constants/Colors';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import {
    GooglePlacesAutocomplete,
    GooglePlacesAutocompleteRef,
    PlaceType,
} from 'react-native-google-places-autocomplete';
import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

// const [ownerName, setOwnerName] = useState('');
// const [homeAddress, setHomeAddress] = useState('');
// const [street, setStreet] = useState('');
// const [city, setCity] = useState('');
// const [state, setState] = useState('');
// const [zipCode, setZipCode] = useState('');
// const [cellPhone, setCellPhone] = useState('');
// const [email, setEmail] = useState('');

export default function Page1({
    width,
    firstName,
    setFirstName,
    firstNameError,
    setFirstNameError,
    lastName,
    setLastName,
    lastNameError,
    setLastNameError,
    email,
    setEmail,
    emailError,
    setEmailError,
    cellPhone,
    setCellPhone,
    phoneError,
    setPhoneError,
    homeAddress,
    setHomeAddress,
    street,
    setStreet,
    city,
    setCity,
    state,
    setState,
    zipCode,
    setZipCode,
    addressError,
    setAddressError,
    isAddressFocused,
    setIsAddressFocused,
}: {
    width: number;
    firstName: string;
    setFirstName: (firstName: string) => void;
    firstNameError: string;
    setFirstNameError: (firstNameError: string) => void;
    lastName: string;
    setLastName: (lastName: string) => void;
    lastNameError: string;
    setLastNameError: (lastNameError: string) => void;
    email: string;
    setEmail: (email: string) => void;
    emailError: string;
    setEmailError: (emailError: string) => void;
    cellPhone: string;
    setCellPhone: (cellPhone: string) => void;
    phoneError: string;
    setPhoneError: (phoneError: string) => void;
    homeAddress: string;
    setHomeAddress: (homeAddress: string) => void;
    street: string;
    setStreet: (street: string) => void;
    city: string;
    setCity: (city: string) => void;
    state: string;
    setState: (state: string) => void;
    zipCode: string;
    setZipCode: (zipCode: string) => void;
    addressError: string;
    setAddressError: (addressError: string) => void;
    isAddressFocused: boolean;
    setIsAddressFocused: (isAddressFocused: boolean) => void;
}) {
    const googlePlacesRef = useRef<GooglePlacesAutocompleteRef | null>(null);

    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
    });
    if (!fontsLoaded) {
        return null;
    }

    return (
        <View
            style={[
                styles.page,
                {
                    width,
                    marginBottom: 25,
                },
            ]}
        >
            <Text
                style={{
                    fontSize: 27,
                    fontFamily: 'Montserrat_500Medium',
                    color: Colors.black,
                }}
            >
                Owner Details
            </Text>
            <Divider
                color={Colors.darkBlue}
                width={2}
                orientation="horizontal"
            />
            {!isAddressFocused && (
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 16,
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={[
                                styles.input,
                                firstNameError ? styles.inputError : null,
                            ]}
                            placeholder="First Name"
                            value={firstName}
                            onChangeText={(text) => {
                                setFirstName(text);
                                setFirstNameError('');
                            }}
                        />

                        {firstNameError ? (
                            <Text style={styles.errorText}>
                                {firstNameError}
                            </Text>
                        ) : null}
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={[
                                styles.input,
                                lastNameError ? styles.inputError : null,
                            ]}
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={(text) => {
                                setLastName(text);
                                setLastNameError('');
                            }}
                        />

                        {lastNameError ? (
                            <Text style={styles.errorText}>
                                {lastNameError}
                            </Text>
                        ) : null}
                    </View>
                </View>
            )}

            {!isAddressFocused && (
                <View>
                    <TextInput
                        style={[
                            styles.input,
                            emailError ? styles.inputError : null,
                        ]}
                        placeholder="Email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setEmailError('');
                        }}
                    />
                    {emailError ? (
                        <Text style={styles.errorText}>{emailError}</Text>
                    ) : null}
                </View>
            )}

            {!isAddressFocused && (
                <View>
                    <TextInput
                        style={[
                            styles.input,
                            phoneError ? styles.inputError : null,
                        ]}
                        placeholder="Phone Number e.g. 6265551212"
                        value={cellPhone}
                        onChangeText={(text) => {
                            setCellPhone(text);
                            setPhoneError('');
                        }}
                    />
                    {phoneError ? (
                        <Text style={styles.errorText}>{phoneError}</Text>
                    ) : null}
                </View>
            )}

            <View
                style={{
                    marginBottom: isAddressFocused
                        ? 250
                        : addressError
                        ? 55 // Additional space for error text (25px base + ~30px for error text)
                        : 25,
                    position: 'relative',
                }}
            >
                <GooglePlacesAutocomplete
                    ref={googlePlacesRef}
                    fetchDetails={true}
                    minLength={1}
                    debounce={120}
                    placeholder="Address"
                    enablePoweredByContainer={false}
                    disableScroll={true}
                    onFail={(error) =>
                        console.error('Google Places error:', error)
                    }
                    onNotFound={() =>
                        console.log('Google Places: no results found')
                    }
                    onTimeout={() =>
                        console.log('Google Places: request timed out')
                    }
                    timeout={20000}
                    textInputProps={{
                        placeholderTextColor: 'gray',
                        returnKeyType: 'search',
                        blurOnSubmit: false,
                        autoCorrect: false,
                        autoCapitalize: 'none',
                        onFocus: () => {
                            setIsAddressFocused(true);
                            setTimeout(() => {}, 200);
                        },
                        onBlur: () => {
                            setIsAddressFocused(false);
                        },
                    }}
                    listViewDisplayed={true}
                    keyboardShouldPersistTaps="handled"
                    renderRightButton={() => (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => {
                                if (googlePlacesRef.current) {
                                    googlePlacesRef.current.clear();
                                    setHomeAddress('');
                                    setStreet('');
                                    setCity('');
                                    setState('');
                                    setZipCode('');
                                    setAddressError('');
                                }
                            }}
                        >
                            <Text style={styles.clearButtonText}>Clear</Text>
                        </TouchableOpacity>
                    )}
                    styles={{
                        container: {
                            zIndex: 1,
                        },
                        textInput: {
                            height: 70,
                            fontSize: 22,
                            fontFamily: 'Montserrat_400Regular',
                            borderWidth: 1,
                            borderColor: addressError ? Colors.red : '#B8BDC6',
                            borderRadius: 6,
                            paddingLeft: 18,
                            paddingRight: 55, // Add padding for clear button
                            backgroundColor: Colors.white,
                        },
                        listView: {
                            borderWidth: 1,
                            borderColor: '#B8BDC6',
                            backgroundColor: Colors.white,
                            margin: 0,
                            fontSize: 20,
                            maxHeight: 304,
                            position: 'absolute', // Make the list view absolute
                            width: '100%',
                            top: 72, // Updated to account for the taller input height
                            zIndex: 1000, // Ensure it's above other content
                        },
                        row: {
                            padding: 10,
                            height: 40,
                            fontSize: 16,
                            fontFamily: 'Montserrat_400Regular',
                        },
                        description: {
                            fontFamily: 'Montserrat_400Regular',
                            fontSize: 16,
                        },
                    }}
                    query={{
                        key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
                        language: 'en',
                    }}
                    onPress={(data, details = null) => {
                        console.log('Started!');
                        const components = details?.address_components;
                        const getComponent = (type: string) =>
                            components?.find((c) =>
                                c.types.includes(type as PlaceType)
                            )?.long_name ?? '';
                        const streetNumber = getComponent('street_number');
                        const route = getComponent('route');

                        const fullStreet = `${streetNumber} ${route}`.trim();
                        setStreet(fullStreet); // 👈 sets your street state
                        setHomeAddress(data.description);
                        setCity(getComponent('locality'));
                        setState(getComponent('administrative_area_level_1'));
                        setZipCode(getComponent('postal_code'));
                        console.log('FULL STREET', fullStreet);
                        console.log('CITY', getComponent('locality'));
                        console.log(
                            'STATE',
                            getComponent('administrative_area_level_1')
                        );
                        console.log('ZIP CODE', getComponent('postal_code'));
                        // Add this line to hide the suggestions after selection
                        // setIsAddressSearchActive(false);
                    }}
                    nearbyPlacesAPI="GooglePlacesSearch"
                    filterReverseGeocodingByTypes={[
                        'locality',
                        'administrative_area_level_1',
                    ]}
                />
                {addressError ? (
                    <View style={styles.addressErrorContainer}>
                        <Text style={styles.addressErrorText}>
                            {addressError}
                        </Text>
                    </View>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        width: '100%',
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        height: 70,
        borderColor: '#B8BDC6',
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 20,
        paddingLeft: 18,
        fontFamily: 'Montserrat_400Regular',
        fontSize: 22,
    },
    inputError: {
        borderColor: Colors.red,
        borderWidth: 1,
    },
    errorText: {
        color: Colors.red,
        fontSize: 20,
        marginTop: -10,
        marginLeft: 10,
        marginBottom: 10,
        fontFamily: 'Montserrat_600SemiBold',
    },
    addressErrorText: {
        color: Colors.red,
        fontSize: 20,
        fontFamily: 'Montserrat_600SemiBold',
    },
    addressErrorContainer: {
        position: 'absolute',
        top: 80, // Position it below the input (70px height + 10px spacing)
        left: 0,
        right: 0,
        paddingLeft: 10,
    },
    clearButton: {
        position: 'absolute',
        right: 10,
        top: 22,
        padding: 3,
        backgroundColor: 'gray',
        borderRadius: 6,
        zIndex: 2,
    },
    clearButtonText: {
        color: Colors.black,
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
    },
});
