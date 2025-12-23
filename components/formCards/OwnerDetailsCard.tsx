import React, { useMemo } from 'react';
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
import { styles } from './styles/OwnerDetailsCard.styles';
import { useLanguage } from '../../contexts/LanguageContext';

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
    // Address section is optional
    showAddress?: boolean;
    homeAddress?: string;
    setHomeAddress?: (val: string) => void;
    setStreet?: (val: string) => void;
    setCity?: (val: string) => void;
    setState?: (val: string) => void;
    setZipCode?: (val: string) => void;
    addressError?: string;
    setAddressError?: (val: string) => void;
    isAddressFocused?: boolean;
    setIsAddressFocused?: (val: boolean) => void;
    googlePlacesRef?: React.RefObject<GooglePlacesAutocompleteRef>;
    hasError: boolean;
    width: number;
    dividerColor: string;
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
    showAddress,
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
    dividerColor,
}: OwnerDetailsCardProps) => {
    const { t } = useLanguage();
    const hasAddress = showAddress !== false;

    const googlePlacesStyles = useMemo(() => {
        const borderColor = addressError ? Colors.red : Colors.borderColor;

        return {
            container: { zIndex: 1 },
            textInput: StyleSheet.flatten([
                styles.gpTextInput,
                { borderColor },
            ]),
            listView: styles.gpListView,
            row: styles.gpRow,
            description: styles.gpDescription,
        };
    }, [addressError]);

    const addressWrapStyle = useMemo(() => {
        const marginBottom = isAddressFocused
            ? 190
            : addressError
            ? 25 // Additional space for error text (25px base + ~30px for error text)
            : 15;

        return StyleSheet.flatten([styles.addressWrapBase, { marginBottom }]);
    }, [isAddressFocused, addressError]);

    const getComponent = (components: any, type: string) =>
        components?.find((c: any) => c.types.includes(type as PlaceType))
            ?.long_name ?? '';

    return (
        <CardContainer hasError={hasError} paddingBottom={0}>
            <View style={[styles.container, { width: width - 70 }]}>
                <Text style={styles.pageTitle}>{t('ownerDetails')}</Text>
                <Divider
                    color={dividerColor}
                    width={2}
                    orientation="horizontal"
                />
                {(!hasAddress || !isAddressFocused) && (
                    <View style={styles.nameRow}>
                        <View style={styles.nameCol}>
                            <InputField
                                placeholder={t('firstName')}
                                value={firstName}
                                onChangeText={(t) => {
                                    setFirstName(t);
                                    setFirstNameError('');
                                }}
                                error={firstNameError}
                            />
                        </View>
                        <View style={styles.nameCol}>
                            <InputField
                                placeholder={t('lastName')}
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
                {(!hasAddress || !isAddressFocused) && (
                    <View>
                        <InputField
                            placeholder={t('email')}
                            value={email}
                            onChangeText={(t) => {
                                setEmail(t);
                                setEmailError('');
                            }}
                            error={emailError}
                        />
                    </View>
                )}
                {(!hasAddress || !isAddressFocused) && (
                    <View>
                        <InputField
                            placeholder={t('phoneNumber')}
                            value={cellPhone}
                            onChangeText={(t) => {
                                setCellPhone(t);
                                setPhoneError('');
                            }}
                            error={phoneError}
                        />
                    </View>
                )}
                {hasAddress && (
                    <View style={addressWrapStyle}>
                        <GooglePlacesAutocomplete
                            ref={googlePlacesRef}
                            styles={googlePlacesStyles}
                            fetchDetails={true}
                            minLength={1}
                            debounce={120}
                            placeholder={t('address')}
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
                                    setIsAddressFocused &&
                                        setIsAddressFocused(true);
                                    setTimeout(() => {}, 200);
                                },
                                onBlur: () => {
                                    setIsAddressFocused &&
                                        setIsAddressFocused(false);
                                },
                            }}
                            listViewDisplayed={true}
                            keyboardShouldPersistTaps="handled"
                            renderRightButton={() => (
                                <TouchableOpacity
                                    style={[
                                        styles.clearButton,
                                        !homeAddress &&
                                            styles.clearButtonDisabled,
                                    ]}
                                    disabled={!homeAddress}
                                    onPress={() => {
                                        if (
                                            googlePlacesRef &&
                                            googlePlacesRef.current
                                        ) {
                                            googlePlacesRef.current.clear();
                                            setHomeAddress &&
                                                setHomeAddress('');
                                            setStreet && setStreet('');
                                            setCity && setCity('');
                                            setState && setState('');
                                            setZipCode && setZipCode('');
                                            setAddressError &&
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
                                        {t('clear')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            query={{
                                key: process.env
                                    .EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
                                language: 'en',
                            }}
                            onPress={(data, details = null) => {
                                const components = details?.address_components;
                                const streetNumber = getComponent(
                                    components,
                                    'street_number'
                                );
                                const route = getComponent(components, 'route');

                                const fullStreet =
                                    `${streetNumber} ${route}`.trim();
                                setStreet && setStreet(fullStreet);
                                setHomeAddress &&
                                    setHomeAddress(data.description);
                                setCity &&
                                    setCity(
                                        getComponent(components, 'locality')
                                    );
                                setState &&
                                    setState(
                                        getComponent(
                                            components,
                                            'administrative_area_level_1'
                                        )
                                    );
                                setZipCode &&
                                    setZipCode(
                                        getComponent(components, 'postal_code')
                                    );
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
                )}
            </View>
        </CardContainer>
    );
};

export default OwnerDetailsCard;
