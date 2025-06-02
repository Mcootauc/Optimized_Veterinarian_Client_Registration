import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import CardContainer from '@/components/cardContainer';
import Divider from '@/components/Divider';
import InputField from '@/components/formComponents/InputField';
import {
    GooglePlacesAutocomplete,
    GooglePlacesAutocompleteRef,
    PlaceType,
} from 'react-native-google-places-autocomplete';

interface OwnerDetailsCardProps {
    firstName: string;
    setFirstName: (val: string) => void;
    firstNameError: string;
    setFirstNameError: (val: string) => void;
    lastName: string;
    setLastName: (val: string) => void;
    lastNameError: string;
    setLastNameError: (val: string) => void;
    email: string;
    setEmail: (val: string) => void;
    emailError: string;
    setEmailError: (val: string) => void;
    cellPhone: string;
    setCellPhone: (val: string) => void;
    phoneError: string;
    setPhoneError: (val: string) => void;
    homeAddress: string;
    setHomeAddress: (val: string) => void;
    setStreet: (val: string) => void;
    setCity: (val: string) => void;
    setState: (val: string) => void;
    setZipCode: (val: string) => void;
    addressError: string;
    setAddressError: (val: string) => void;
    isAddressFocused: boolean;
    setIsAddressFocused: (val: boolean) => void;
    googlePlacesRef: React.RefObject<GooglePlacesAutocompleteRef>;
    hasError: boolean;
    width: number;
}

const OwnerDetailsCard = ({
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
    setStreet,
    setCity,
    setState,
    setZipCode,
    addressError,
    setAddressError,
    isAddressFocused,
    setIsAddressFocused,
    googlePlacesRef,
    hasError,
    width,
}: OwnerDetailsCardProps) => {
    return (
        <CardContainer hasError={hasError} paddingBottom={0}>
            <View style={[styles.container, { width: width - 70 }]}>
                <Text style={styles.pageTitle}>Owner Details</Text>
                <Divider
                    color={Colors.darkBlue}
                    width={2}
                    orientation="horizontal"
                />
                {!isAddressFocused && (
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 8,
                            width: '100%',
                        }}
                    >
                        <View style={{ flex: 1, minWidth: 0 }}>
                            <InputField
                                placeholder="First Name"
                                value={firstName}
                                onChangeText={(t) => {
                                    setFirstName(t);
                                    setFirstNameError('');
                                }}
                                error={firstNameError}
                            />
                        </View>
                        <View style={{ flex: 1, minWidth: 0 }}>
                            <InputField
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={(t) => {
                                    setLastName(t);
                                    setLastNameError('');
                                }}
                                error={lastNameError}
                            />
                        </View>
                    </View>
                )}
                {!isAddressFocused && (
                    <View>
                        <InputField
                            placeholder="Email"
                            value={email}
                            onChangeText={(t) => {
                                setEmail(t);
                                setEmailError('');
                            }}
                            error={emailError}
                        />
                    </View>
                )}
                {!isAddressFocused && (
                    <View>
                        <InputField
                            placeholder="Phone Number e.g. 6265551212"
                            value={cellPhone}
                            onChangeText={(t) => {
                                setCellPhone(t);
                                setPhoneError('');
                            }}
                            error={phoneError}
                        />
                    </View>
                )}
                <View
                    style={{
                        marginBottom: isAddressFocused
                            ? 190
                            : addressError
                            ? 25 // Additional space for error text (25px base + ~30px for error text)
                            : 15,
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
                                style={[
                                    styles.clearButton,
                                    !homeAddress && styles.clearButtonDisabled,
                                ]}
                                disabled={!homeAddress}
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
                                <Text
                                    style={[
                                        styles.clearButtonText,
                                        !homeAddress &&
                                            styles.clearButtonTextDisabled,
                                    ]}
                                >
                                    Clear
                                </Text>
                            </TouchableOpacity>
                        )}
                        styles={{
                            container: {
                                zIndex: 1,
                            },
                            textInput: {
                                height: 35,
                                fontSize: 12,
                                fontFamily: 'Inter_400Regular',
                                borderWidth: 1,
                                borderColor: addressError
                                    ? Colors.red
                                    : Colors.borderColor,
                                borderRadius: 6,
                                paddingLeft: 10,
                                paddingRight: 48, // Add padding for clear button
                                backgroundColor: Colors.white,
                            },
                            listView: {
                                borderWidth: 1,
                                borderColor: Colors.borderColor,
                                backgroundColor: Colors.white,
                                margin: 0,
                                fontSize: 12,
                                maxHeight: 304,
                                position: 'absolute', // Make the list view absolute
                                width: '100%',
                                top: 34, // Updated to account for the taller input height
                                zIndex: 1000, // Ensure it's above other content
                            },
                            row: {
                                padding: 10,
                                height: 35,
                                fontSize: 12,
                                fontFamily: 'Inter_400Regular',
                            },
                            description: {
                                fontFamily: 'Inter_400Regular',
                                fontSize: 12,
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

                            const fullStreet =
                                `${streetNumber} ${route}`.trim();
                            setStreet(fullStreet);
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
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
        paddingVertical: 0,
        marginTop: 15,
    },
    pageTitle: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: Colors.black,
    },
    addressErrorText: {
        color: Colors.red,
        fontSize: 8,
        fontFamily: 'Inter_600SemiBold',
    },
    addressErrorContainer: {
        position: 'absolute',
        top: 40, // Position it below the input (70px height + 10px spacing)
        left: 0,
        right: 0,
        paddingLeft: 5,
    },
    clearButton: {
        position: 'absolute',
        right: 5,
        top: 8,
        paddingVertical: 3,
        paddingHorizontal: 7,
        backgroundColor: Colors.blue,
        borderRadius: 6,
        zIndex: 2,
    },
    clearButtonText: {
        color: Colors.white,
        fontSize: 8,
        fontFamily: 'Inter_700Bold',
    },
    clearButtonDisabled: {
        backgroundColor: Colors.gray,
    },
    clearButtonTextDisabled: {
        color: Colors.borderColor,
    },
});

export default OwnerDetailsCard;
