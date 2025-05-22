import React, { useRef } from 'react';
import Divider from '../../components/Divider';
import { Colors } from '../../constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter, Link } from 'expo-router';

import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Button,
} from 'react-native';
import {
    GooglePlacesAutocomplete,
    GooglePlacesAutocompleteRef,
    PlaceType,
} from 'react-native-google-places-autocomplete';
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from '@expo-google-fonts/inter';
import CardContainer from '@/components/cardContainer';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Page1({
    width,
    page1HasError,
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
    petName,
    setPetName,
    petNameError,
    setPetNameError,
    color,
    setColor,
    colorError,
    setColorError,
    selectSpecies,
    setSelectSpecies,
    speciesError,
    setSpeciesError,
    breed,
    setBreed,
    breedError,
    setBreedError,
    birthDate,
    setBirthDate,
    birthDateError,
    setBirthDateError,
    showDatePicker,
    setShowDatePicker,
    sex,
    setSex,
    sexError,
    setSexError,
}: {
    width: number;
    page1HasError: boolean;
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
    petName: string;
    setPetName: (petName: string) => void;
    petNameError: string;
    setPetNameError: (petNameError: string) => void;
    color: string;
    setColor: (color: string) => void;
    colorError: string;
    setColorError: (colorError: string) => void;
    selectSpecies: string;
    setSelectSpecies: (selectSpecies: string) => void;
    speciesError: string;
    setSpeciesError: (speciesError: string) => void;
    breed: string;
    setBreed: (breed: string) => void;
    breedError: string;
    setBreedError: (breedError: string) => void;
    birthDate: Date | null;
    setBirthDate: (birthDate: Date | null) => void;
    birthDateError: string;
    setBirthDateError: (birthDateError: string) => void;
    showDatePicker: boolean;
    setShowDatePicker: (showDatePicker: boolean) => void;
    sex: string;
    setSex: (sex: string) => void;
    sexError: string;
    setSexError: (sexError: string) => void;
}) {
    const googlePlacesRef = useRef<GooglePlacesAutocompleteRef | null>(null);
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    // Memoize these functions to maintain consistent hook order
    const formatDate = React.useMemo(() => {
        return (date: Date | null) => {
            if (!date) return '';
            return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            });
        };
    }, []);

    // Memoize the date change handler
    const onDateChange = React.useMemo(() => {
        return (event: any, selectedDate?: Date) => {
            setShowDatePicker(false);
            if (selectedDate) {
                setBirthDate(selectedDate);
                setBirthDateError('');
            }
        };
    }, [setBirthDate, setShowDatePicker, setBirthDateError]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={{ marginTop: 30 }}>
            <CardContainer hasError={page1HasError} paddingBottom={25}>
                <View
                    style={[
                        styles.page,
                        {
                            width,
                            marginBottom: 35,
                        },
                    ]}
                >
                    <Text
                        style={{
                            fontSize: 27,
                            fontFamily: 'Inter_400Regular',
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
                    <Link href="/homepage" style={styles.linkText}>
                        Go to Home
                    </Link>
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
                                        firstNameError
                                            ? styles.inputError
                                            : null,
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
                                        lastNameError
                                            ? styles.inputError
                                            : null,
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
                                <Text style={styles.errorText}>
                                    {emailError}
                                </Text>
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
                                <Text style={styles.errorText}>
                                    {phoneError}
                                </Text>
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
                                    <Text style={styles.clearButtonText}>
                                        Clear
                                    </Text>
                                </TouchableOpacity>
                            )}
                            styles={{
                                container: {
                                    zIndex: 1,
                                },
                                textInput: {
                                    height: 70,
                                    fontSize: 22,
                                    fontFamily: 'Inter_400Regular',
                                    borderWidth: 1,
                                    borderColor: addressError
                                        ? Colors.red
                                        : '#B8BDC6',
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
                                    fontFamily: 'Inter_400Regular',
                                },
                                description: {
                                    fontFamily: 'Inter_400Regular',
                                    fontSize: 16,
                                },
                            }}
                            query={{
                                key: process.env
                                    .EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
                                language: 'en',
                            }}
                            onPress={(data, details = null) => {
                                console.log('Started!');
                                const components = details?.address_components;
                                const getComponent = (type: string) =>
                                    components?.find((c) =>
                                        c.types.includes(type as PlaceType)
                                    )?.long_name ?? '';
                                const streetNumber =
                                    getComponent('street_number');
                                const route = getComponent('route');

                                const fullStreet =
                                    `${streetNumber} ${route}`.trim();
                                setStreet(fullStreet); // 👈 sets your street state
                                setHomeAddress(data.description);
                                setCity(getComponent('locality'));
                                setState(
                                    getComponent('administrative_area_level_1')
                                );
                                setZipCode(getComponent('postal_code'));
                                console.log('FULL STREET', fullStreet);
                                console.log('CITY', getComponent('locality'));
                                console.log(
                                    'STATE',
                                    getComponent('administrative_area_level_1')
                                );
                                console.log(
                                    'ZIP CODE',
                                    getComponent('postal_code')
                                );
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
            </CardContainer>

            <View style={{ height: 30 }} />

            {/* Pet Details */}
            <CardContainer hasError={page1HasError} paddingBottom={0}>
                <View
                    style={[
                        styles.page,
                        {
                            width,
                            marginBottom: 0,
                        },
                    ]}
                >
                    <Text
                        style={{
                            fontSize: 27,
                            fontFamily: 'Inter_400Regular',
                            color: Colors.black,
                        }}
                    >
                        Pet Details
                    </Text>
                    <Divider
                        color={Colors.darkBlue}
                        width={2}
                        orientation="horizontal"
                    />
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
                                    petNameError ? styles.inputError : null,
                                ]}
                                placeholder="Pet Name"
                                value={petName}
                                onChangeText={(text) => {
                                    setPetName(text);
                                    setPetNameError('');
                                }}
                            />

                            {petNameError ? (
                                <Text style={styles.errorText}>
                                    {petNameError}
                                </Text>
                            ) : null}
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                style={[
                                    styles.input,
                                    colorError ? styles.inputError : null,
                                ]}
                                placeholder="Color"
                                value={color}
                                onChangeText={(text) => {
                                    setColor(text);
                                    setColorError('');
                                }}
                            />

                            {colorError ? (
                                <Text style={styles.errorText}>
                                    {colorError}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 16,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <View
                                style={[
                                    styles.pickerContainer,
                                    speciesError ? styles.inputError : null,
                                ]}
                            >
                                <RNPickerSelect
                                    style={{
                                        inputAndroid: {
                                            fontSize: 22,
                                            fontFamily: 'Inter_400Regular',
                                            paddingVertical: 0,
                                            paddingHorizontal: 0,
                                            paddingLeft: 18,
                                            color: 'black',
                                        },
                                        placeholder: {
                                            color: 'gray',
                                            paddingLeft: 18,
                                            fontSize: 22,
                                            fontFamily: 'Inter_400Regular',
                                        },
                                        // No need for viewContainer styling when we're wrapping it
                                    }}
                                    useNativeAndroidPickerStyle={false} // let us style Android too
                                    placeholder={{
                                        label: 'Species',
                                    }}
                                    value={selectSpecies}
                                    onValueChange={(value) => {
                                        setSelectSpecies(value);
                                        setSpeciesError('');
                                    }}
                                    items={[
                                        { label: 'Dog', value: 'Dog' },
                                        { label: 'Cat', value: 'Cat' },
                                        { label: 'Other', value: 'Other' },
                                    ]}
                                />
                                <FontAwesome
                                    name="chevron-down"
                                    size={24}
                                    color={Colors.gray}
                                    style={{
                                        position: 'absolute',
                                        right: 20,
                                        top: 20,
                                    }}
                                />
                            </View>

                            {speciesError ? (
                                <Text style={styles.selectErrorText}>
                                    {speciesError}
                                </Text>
                            ) : null}
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                style={[
                                    styles.input,
                                    breedError ? styles.inputError : null,
                                ]}
                                placeholder="Breed"
                                value={breed}
                                onChangeText={(text) => {
                                    setBreed(text);
                                    setBreedError('');
                                }}
                            />
                            {breedError ? (
                                <Text style={styles.errorText}>
                                    {breedError}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 16,
                            marginBottom: 0,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity
                                style={[
                                    styles.input,
                                    styles.dateButton,
                                    birthDateError ? styles.inputError : null,
                                ]}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateButtonText}>
                                    {birthDate
                                        ? formatDate(birthDate)
                                        : 'Select Birth Date'}
                                </Text>
                            </TouchableOpacity>
                            <FontAwesome
                                name="chevron-down"
                                size={24}
                                color={Colors.gray}
                                style={{
                                    position: 'absolute',
                                    right: 20,
                                    top: 20,
                                }}
                            />
                            {birthDateError ? (
                                <Text style={styles.errorText}>
                                    {birthDateError}
                                </Text>
                            ) : null}

                            {showDatePicker && (
                                <DateTimePicker
                                    value={birthDate || new Date()}
                                    mode="date"
                                    display="spinner"
                                    onChange={onDateChange}
                                    themeVariant="dark"
                                    maximumDate={new Date()} // Prevents future dates
                                />
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <View
                                style={[
                                    styles.pickerContainer,
                                    sexError ? styles.inputError : null,
                                ]}
                            >
                                <RNPickerSelect
                                    style={{
                                        inputAndroid: {
                                            fontSize: 22,
                                            fontFamily: 'Inter_400Regular',
                                            paddingVertical: 0,
                                            paddingHorizontal: 0,
                                            paddingLeft: 18,
                                            color: 'black',
                                        },
                                        placeholder: {
                                            color: 'gray',
                                            paddingLeft: 18,
                                            fontSize: 22,
                                            fontFamily: 'Inter_400Regular',
                                        },
                                        // No need for viewContainer styling when we're wrapping it
                                    }}
                                    useNativeAndroidPickerStyle={false} // let us style Android too
                                    placeholder={{
                                        label: 'Sex',
                                    }}
                                    value={sex}
                                    onValueChange={(value) => {
                                        setSex(value);
                                        setSexError('');
                                    }}
                                    items={[
                                        { label: 'Male', value: 'Male' },
                                        {
                                            label: 'Female',
                                            value: 'Female',
                                        },
                                        {
                                            label: 'Unknown',
                                            value: 'Unknown',
                                        },
                                    ]}
                                />
                                <FontAwesome
                                    name="chevron-down"
                                    size={24}
                                    color={Colors.gray}
                                    style={{
                                        position: 'absolute',
                                        right: 20,
                                        top: 20,
                                    }}
                                />
                            </View>

                            {sexError ? (
                                <Text style={styles.selectErrorText}>
                                    {sexError}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                </View>
            </CardContainer>
            <View
                style={[styles.assistanceText, { width: width, marginTop: 40 }]}
            >
                <Text style={styles.assistanceTextBase}>
                    If you have any questions, please ask the{' '}
                </Text>
                <Text style={styles.assistanceTextHighlight}>front desk</Text>
                <Text style={styles.assistanceTextBase}>
                    {' '}
                    or any available{' '}
                </Text>
                <Text style={styles.assistanceTextHighlight}>
                    vet technician
                </Text>
                <Text style={styles.assistanceTextBase}>!</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        width: '100%',
        padding: 20,
        justifyContent: 'center',
        marginBottom: 0,
    },
    input: {
        width: '100%',
        height: 70,
        borderColor: '#B8BDC6',
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 20,
        paddingLeft: 18,
        fontFamily: 'Inter_400Regular',
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
        fontFamily: 'Inter_600SemiBold',
    },
    selectErrorText: {
        color: Colors.red,
        fontSize: 20,
        marginTop: 10,
        marginLeft: 10,
        marginBottom: 10,
        fontFamily: 'Inter_600SemiBold',
    },
    addressErrorText: {
        color: Colors.red,
        fontSize: 20,
        fontFamily: 'Inter_600SemiBold',
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
        fontFamily: 'Inter_400Regular',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 6,
        marginBottom: 0,
        height: 70,
        justifyContent: 'center',
        position: 'relative',
    },
    dateButton: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 0,
    },
    dateButtonText: {
        color: Colors.gray,
        fontFamily: 'Inter_400Regular',
        fontSize: 22,
        paddingLeft: 0,
    },
    assistanceText: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 0,
        marginTop: 0,
        paddingHorizontal: 20,
    },
    assistanceTextBase: {
        fontSize: 32,
        fontFamily: 'Inter_400Regular',
        color: Colors.black,
        textAlign: 'center',
    },
    assistanceTextHighlight: {
        fontSize: 32,
        fontFamily: 'Inter_700Bold',
        color: Colors.darkBlue,
        textAlign: 'center',
    },
    linkText: {
        color: Colors.darkBlue,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        marginBottom: 10,
    },
});
