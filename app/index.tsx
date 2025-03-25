import React, { useState, useRef } from 'react';
import {
    View,
    TextInput,
    Alert,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import AppLoading from 'expo-app-loading';
import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { submitFormData } from '../components/SupabaseService';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';

const containsEmoji = (text: string) => {
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]/u;
    return emojiRegex.test(text);
};

const containsOnlyLettersAndSpaces = (text: string) => {
    return /^[A-Za-z\s]+$/.test(text);
};

const isValidAddress = (text: string) => {
    return /^[A-Za-z0-9\s\-\.,#]+$/.test(text);
};

// This code is from https://stackoverflow.com/questions/2577236/regex-for-zip-code
const isValidZipCode = (text: string) => {
    return /^\d{5}(?:[-\s]\d{4})?$/.test(text);
};

const isValidPhone = (text: string) => {
    return /^\d{10}$/.test(text.replace(/\D/g, ''));
};

const isValidEmail = (text: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
};

export default function Index() {
    // Form fields
    const [ownerName, setOwnerName] = useState('');
    const [homeAddress, setHomeAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [cellPhone, setCellPhone] = useState('');
    const [email, setEmail] = useState('');
    const [petName, setPetName] = useState('');
    const [breed, setBreed] = useState('');
    const [color, setColor] = useState('');
    const [sex, setSex] = useState('');
    const [spayedOrNeutered, setSpayedOrNeutered] = useState('');
    const [microchip, setMicrochip] = useState('');
    const [initials, setInitials] = useState('');

    // Navigation state for multi-page form (pages: 0 to 3)
    const [currentPage, setCurrentPage] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const { width } = useWindowDimensions();

    // Add error states for page 1
    const [ownerNameError, setOwnerNameError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [cityError, setCityError] = useState('');
    const [stateError, setStateError] = useState('');

    // Page 2 errors
    const [zipCodeError, setZipCodeError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [petNameError, setPetNameError] = useState('');
    // Page 3 errors
    const [speciesError, setSpeciesError] = useState('');
    const [breedError, setBreedError] = useState('');
    const [birthDateError, setBirthDateError] = useState('');
    const [colorError, setColorError] = useState('');
    // Page 4 errors
    const [sexError, setSexError] = useState('');
    const [spayedNeuteredError, setSpayedNeuteredError] = useState('');
    const [microchipError, setMicrochipError] = useState('');
    const [initialsError, setInitialsError] = useState('');

    // Replace the age state with birthDate states
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectSpecies, setSelectSpecies] = useState('');
    const [address, setAddress] = useState('');

    // Add this function to format the date for display
    const formatDate = (date: Date | null) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Update the validation for page 1
    const validatePage1 = () => {
        let isValid = true;

        // Reset all error states
        setOwnerNameError('');
        setAddressError('');
        setCityError('');
        setStateError('');

        // Owner Name validation
        if (!ownerName.trim()) {
            setOwnerNameError('Name is required');
            isValid = false;
        } else if (containsEmoji(ownerName)) {
            setOwnerNameError('Name cannot contain emojis');
            isValid = false;
        } else if (!containsOnlyLettersAndSpaces(ownerName)) {
            setOwnerNameError('Name can only contain letters');
            isValid = false;
        }

        // Address validation
        if (!homeAddress.trim()) {
            setAddressError('Address is required');
            isValid = false;
        } else if (containsEmoji(homeAddress)) {
            setAddressError('Address cannot contain emojis');
            isValid = false;
        } else if (!isValidAddress(homeAddress)) {
            setAddressError('Please enter a valid address');
            isValid = false;
        }

        // City validation
        if (!city.trim()) {
            setCityError('City is required');
            isValid = false;
        } else if (containsEmoji(city)) {
            setCityError('City cannot contain emojis');
            isValid = false;
        } else if (!containsOnlyLettersAndSpaces(city)) {
            setCityError('City can only contain letters');
            isValid = false;
        }

        // State validation
        if (!state.trim()) {
            setStateError('State is required');
            isValid = false;
        } else if (containsEmoji(state)) {
            setStateError('State cannot contain emojis');
            isValid = false;
        } else if (!containsOnlyLettersAndSpaces(state)) {
            setStateError('State can only contain letters');
            isValid = false;
        }

        return isValid;
    };

    // Add validation functions for each page
    const validatePage2 = () => {
        let isValid = true;

        // Reset errors
        setZipCodeError('');
        setPhoneError('');
        setEmailError('');
        setPetNameError('');

        // Zip Code validation
        if (!zipCode.trim()) {
            setZipCodeError('Zip code is required');
            isValid = false;
        } else if (!isValidZipCode(zipCode)) {
            setZipCodeError(
                'Please enter a valid zip code (e.g., 12345 or 12345-6789)'
            );
            isValid = false;
        }

        // Phone validation
        if (!cellPhone.trim()) {
            setPhoneError('Phone number is required');
            isValid = false;
        } else if (!isValidPhone(cellPhone)) {
            setPhoneError('Please enter a valid 10-digit phone number');
            isValid = false;
        }

        // Email validation
        if (!email.trim()) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            setEmailError('Please enter a valid email address');
            isValid = false;
        }

        // Pet name validation
        if (!petName.trim()) {
            setPetNameError('Pet name is required');
            isValid = false;
        } else if (containsEmoji(petName)) {
            setPetNameError('Pet name cannot contain emojis');
            isValid = false;
        }

        return isValid;
    };

    // Update validatePage3 to check birthDate instead of age
    const validatePage3 = () => {
        let isValid = true;

        // Reset errors
        setSpeciesError('');
        setBreedError('');
        setBirthDateError('');
        setColorError('');

        if (!selectSpecies.trim()) {
            setSpeciesError('Species is required');
            isValid = false;
        }

        if (!breed.trim()) {
            setBreedError('Breed is required');
            isValid = false;
        }

        if (!birthDate) {
            setBirthDateError('Birth date is required');
            isValid = false;
        }

        if (!color.trim()) {
            setColorError('Color is required');
            isValid = false;
        }

        return isValid;
    };

    const validatePage4 = () => {
        let isValid = true;

        // Reset errors
        setSexError('');
        setSpayedNeuteredError('');
        setMicrochipError('');
        setInitialsError('');

        if (!sex) {
            setSexError('Please select a sex');
            isValid = false;
        }

        if (!spayedOrNeutered) {
            setSpayedNeuteredError('Please select yes or no');
            isValid = false;
        }

        if (!microchip) {
            setMicrochipError('Please select yes or no');
            isValid = false;
        }

        if (!initials.trim()) {
            setInitialsError(
                'Please enter your initials to agree to the terms'
            );
            isValid = false;
        }

        return isValid;
    };

    // Update the nextPage function to validate current page
    const nextPage = () => {
        let isValid = true;

        switch (currentPage) {
            case 0:
                isValid = validatePage1();
                break;
            case 1:
                isValid = validatePage2();
                break;
            case 2:
                isValid = validatePage3();
                break;
        }

        if (!isValid) return;

        if (currentPage < 3) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            scrollViewRef.current?.scrollTo({
                x: newPage * width,
                animated: true,
            });
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            scrollViewRef.current?.scrollTo({
                x: newPage * width,
                animated: true,
            });
        }
    };

    // Add date change handler
    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setBirthDate(selectedDate);
            setBirthDateError('');
        }
    };

    // Update handleSubmit to validate before submitting
    const handleSubmit = async () => {
        if (!validatePage4()) {
            return;
        }

        // Generate the timestamp when the form is submitted
        const timestamp = new Date().toLocaleString('en-US', {
            timeZone: 'America/Los_Angeles',
        });

        const formData = {
            timestamp,
            ownerName,
            homeAddress,
            city,
            state,
            zipCode,
            cellPhone,
            email,
            petName,
            selectSpecies,
            breed,
            birthDate: birthDate?.toISOString(), // Send ISO string to Supabase
            sex,
            spayedOrNeutered,
            color,
            microchip,
            initials,
        };

        try {
            const responseMessage = await submitFormData(formData);
            Alert.alert('Success', responseMessage);

            // Reset form fields
            setOwnerName('');
            setHomeAddress('');
            setCity('');
            setState('');
            setZipCode('');
            setCellPhone('');
            setEmail('');
            setPetName('');
            setSelectSpecies('');
            setBreed('');
            setBirthDate(null);
            setSex('');
            setSpayedOrNeutered('');
            setColor('');
            setMicrochip('');
            setInitials('');
            setCurrentPage(0); // Reset to the first page if desired
            scrollViewRef.current?.scrollTo({ x: 0, animated: true });
        } catch (error: any) {
            Alert.alert('Error', `Failed to submit data: ${error.message}`);
        }
    };

    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    // Render navigation buttons:
    // "Back" always on the left (if not on first page)
    // On pages 0-2, "Next" is on the right.
    // On page 3, "Submit" is on the right (green button).
    // Render content for a given page number
    const renderPageContent = (page: number) => {
        console.log(process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY);
        switch (page) {
            case 0:
                return (
                    <View style={[styles.page, { width }]}>
                        <Text style={styles.label}>Name:</Text>
                        <TextInput
                            style={[
                                styles.input,
                                ownerNameError ? styles.inputError : null,
                            ]}
                            placeholder="Owner's First and Last Name"
                            value={ownerName}
                            onChangeText={(text) => {
                                setOwnerName(text);
                                setOwnerNameError('');
                            }}
                        />
                        {ownerNameError ? (
                            <Text style={styles.errorText}>
                                {ownerNameError}
                            </Text>
                        ) : null}

                        <Text style={styles.label}>Address:</Text>
                        <GooglePlacesAutocomplete
                            fetchDetails={true}
                            placeholder="Search"
                            onPress={(data, details = null) => {
                                setHomeAddress(data.description);
                                console.log(details);
                            }}
                            query={{
                                key: process.env
                                    .EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
                                language: 'en',
                            }}
                        />
                        {/* <TextInput
                            style={[
                                styles.input,
                                addressError ? styles.inputError : null,
                            ]}
                            placeholder="Home Address"
                            value={homeAddress}
                            onChangeText={(text) => {
                                setHomeAddress(text);
                                setAddressError('');
                            }}
                        /> */}
                        {addressError ? (
                            <Text style={styles.errorText}>{addressError}</Text>
                        ) : null}

                        <Text style={styles.label}>City:</Text>
                        <TextInput
                            style={[
                                styles.input,
                                cityError ? styles.inputError : null,
                            ]}
                            placeholder="City"
                            value={city}
                            onChangeText={(text) => {
                                setCity(text);
                                setCityError('');
                            }}
                        />
                        {cityError ? (
                            <Text style={styles.errorText}>{cityError}</Text>
                        ) : null}

                        <Text style={styles.label}>State:</Text>
                        <TextInput
                            style={[
                                styles.input,
                                stateError ? styles.inputError : null,
                            ]}
                            placeholder="State"
                            value={state}
                            onChangeText={(text) => {
                                setState(text);
                                setStateError('');
                            }}
                        />
                        {stateError ? (
                            <Text style={styles.errorText}>{stateError}</Text>
                        ) : null}
                    </View>
                );
            case 1:
                return (
                    <View style={[styles.page, { width }]}>
                        <Text style={styles.label}>Zip Code:</Text>
                        <TextInput
                            style={[
                                styles.input,
                                zipCodeError ? styles.inputError : null,
                            ]}
                            placeholder="Zip Code"
                            value={zipCode}
                            onChangeText={(text) => {
                                setZipCode(text);
                                setZipCodeError('');
                            }}
                        />
                        {zipCodeError ? (
                            <Text style={styles.errorText}>{zipCodeError}</Text>
                        ) : null}

                        <Text style={styles.label}>Number:</Text>
                        <TextInput
                            style={[
                                styles.input,
                                phoneError ? styles.inputError : null,
                            ]}
                            placeholder="Cell Phone #"
                            value={cellPhone}
                            onChangeText={(text) => {
                                setCellPhone(text);
                                setPhoneError('');
                            }}
                        />
                        {phoneError ? (
                            <Text style={styles.errorText}>{phoneError}</Text>
                        ) : null}

                        <Text style={styles.label}>Email:</Text>
                        <TextInput
                            style={[
                                styles.input,
                                emailError ? styles.inputError : null,
                            ]}
                            placeholder="E-mail Address"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setEmailError('');
                            }}
                        />
                        {emailError ? (
                            <Text style={styles.errorText}>{emailError}</Text>
                        ) : null}

                        <Text style={styles.label}>Pet Name:</Text>
                        <TextInput
                            style={[
                                styles.input,
                                petNameError ? styles.inputError : null,
                            ]}
                            placeholder="Pet's Name"
                            value={petName}
                            onChangeText={(text) => {
                                setPetName(text);
                                setPetNameError('');
                            }}
                        />
                        {petNameError ? (
                            <Text style={styles.errorText}>{petNameError}</Text>
                        ) : null}
                    </View>
                );
            case 2:
                return (
                    <View style={[styles.page, { width }]}>
                        <Text style={styles.label}>Species:</Text>
                        <RNPickerSelect
                            style={{
                                inputAndroid: {
                                    fontSize: 16,
                                    fontFamily: 'Montserrat_400Regular',
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                    borderWidth: 1,
                                    borderColor: 'gray',
                                    borderRadius: 5,
                                    color: 'gray',
                                },
                                // iOS just in case
                                inputIOS: {
                                    fontSize: 16,
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                    borderWidth: 1,
                                    borderColor: 'gray',
                                    borderRadius: 5,
                                    color: 'gray',
                                },
                                viewContainer: {
                                    borderWidth: 1,
                                    borderColor: 'gray',
                                    borderRadius: 5,
                                    marginBottom: 15,
                                },
                            }}
                            placeholder={{
                                label: 'Species (Dog, Cat, etc.)',
                                value: null,
                                color: 'gray',
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
                        {speciesError ? (
                            <Text style={styles.errorText}>{speciesError}</Text>
                        ) : null}

                        <Text style={styles.label}>Breed:</Text>
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
                            <Text style={styles.errorText}>{breedError}</Text>
                        ) : null}

                        <Text style={styles.label}>Birth Date:</Text>
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
                        {birthDateError ? (
                            <Text style={styles.errorText}>
                                {birthDateError}
                            </Text>
                        ) : null}

                        {showDatePicker && (
                            <DateTimePicker
                                value={birthDate || new Date()}
                                mode="date"
                                display="calendar"
                                onChange={onDateChange}
                                maximumDate={new Date()} // Prevents future dates
                            />
                        )}

                        <Text style={styles.label}>Color:</Text>
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
                            <Text style={styles.errorText}>{colorError}</Text>
                        ) : null}
                    </View>
                );
            case 3:
                return (
                    <View style={[styles.page, { width }]}>
                        <Text style={styles.label}>Sex:</Text>
                        <View style={styles.selectionButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    sex === 'Male' && styles.selectedOption,
                                ]}
                                onPress={() => setSex('Male')}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        sex === 'Male'
                                            ? styles.selectedText
                                            : styles.unselectedText,
                                    ]}
                                >
                                    Male
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    sex === 'Female' && styles.selectedOption,
                                ]}
                                onPress={() => setSex('Female')}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        sex === 'Female'
                                            ? styles.selectedText
                                            : styles.unselectedText,
                                    ]}
                                >
                                    Female
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {sexError ? (
                            <Text style={styles.errorText}>{sexError}</Text>
                        ) : null}

                        <Text style={styles.label}>Spayed/Castrated:</Text>
                        <View style={styles.selectionButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    spayedOrNeutered === 'Yes' &&
                                        styles.selectedOption,
                                ]}
                                onPress={() => setSpayedOrNeutered('Yes')}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        spayedOrNeutered === 'Yes'
                                            ? styles.selectedText
                                            : styles.unselectedText,
                                    ]}
                                >
                                    Yes
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    spayedOrNeutered === 'No' &&
                                        styles.selectedOption,
                                ]}
                                onPress={() => setSpayedOrNeutered('No')}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        spayedOrNeutered === 'No'
                                            ? styles.selectedText
                                            : styles.unselectedText,
                                    ]}
                                >
                                    No
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {spayedNeuteredError ? (
                            <Text style={styles.errorText}>
                                {spayedNeuteredError}
                            </Text>
                        ) : null}

                        <Text style={styles.label}>Microchip:</Text>
                        <View style={styles.selectionButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    microchip === 'Yes' &&
                                        styles.selectedOption,
                                ]}
                                onPress={() => setMicrochip('Yes')}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        microchip === 'Yes'
                                            ? styles.selectedText
                                            : styles.unselectedText,
                                    ]}
                                >
                                    Yes
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    microchip === 'No' && styles.selectedOption,
                                ]}
                                onPress={() => setMicrochip('No')}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        microchip === 'No'
                                            ? styles.selectedText
                                            : styles.unselectedText,
                                    ]}
                                >
                                    No
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {microchipError ? (
                            <Text style={styles.errorText}>
                                {microchipError}
                            </Text>
                        ) : null}

                        <Text style={styles.label}>
                            Initials (Agree to Terms):
                        </Text>
                        <Text style={styles.terms}>
                            All fees are due and payable prior to the release of
                            the patient. Upon your request, we can provide you
                            with a written estimate of fees for any treatments,
                            emergency care, surgery, or hospitalization services
                            to be performed.
                        </Text>
                        <Text style={styles.terms}>
                            You understand and approve all necessary
                            after-office-hours veterinary services that may be
                            performed on your pet in the judgment of the
                            veterinarian. You are also aware that the continuous
                            presence of veterinary personnel may not be provided
                            after office hours as this is not a 24-hour
                            facility.
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                initialsError ? styles.inputError : null,
                            ]}
                            placeholder="Enter your initials"
                            value={initials}
                            onChangeText={(text) => {
                                setInitials(text);
                                setInitialsError('');
                            }}
                        />
                        {initialsError ? (
                            <Text style={styles.errorText}>
                                {initialsError}
                            </Text>
                        ) : null}
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            <ScrollView
                horizontal
                pagingEnabled
                ref={scrollViewRef}
                showsHorizontalScrollIndicator={false}
            >
                {renderPageContent(0)}
                {renderPageContent(1)}
                {renderPageContent(2)}
                {renderPageContent(3)}
            </ScrollView>
            <View style={styles.navContainer}>
                <View style={styles.navLeft}>
                    {currentPage > 0 ? (
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={prevPage}
                        >
                            <Text style={styles.navButtonText}>Back</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.navButtonPlaceholder} />
                    )}
                </View>
                <View style={styles.navCenter}>
                    <Text style={styles.pageCount}>{`${
                        currentPage + 1
                    }/4 pages`}</Text>
                </View>
                <View style={styles.navRight}>
                    {currentPage < 3 ? (
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={nextPage}
                        >
                            <Text style={styles.navButtonText}>Next</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.navButton, styles.submitButton]}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.navButtonText}>Submit</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        padding: 20,
        justifyContent: 'center',
    },
    container: {
        flexGrow: 1,
        padding: 20,
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA', // orhsl(20, 44.80%, 82.90%)46.30%, 70.80%)
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingLeft: 10,
        fontFamily: 'Montserrat_400Regular',
    },
    terms: {
        fontSize: 12,
        fontFamily: 'Montserrat_400Regular',
        paddingBottom: 10,
    },
    label: {
        fontSize: 16,
        marginLeft: 2,
        marginBottom: 5,
        fontFamily: 'Montserrat_700Bold',
    },
    selectionButtons: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    optionButton: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    selectedOption: {
        backgroundColor: '#007BFF',
    },
    optionText: {
        fontSize: 16,
    },
    unselectedText: {
        color: 'black',
        fontFamily: 'Montserrat_400Regular',
    },
    selectedText: {
        color: 'white',
        fontFamily: 'Montserrat_400Regular',
    },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    navLeft: {
        flex: 1,
        justifyContent: 'flex-start',
        marginLeft: 15,
    },
    navRight: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 15,
    },
    navCenter: {
        flex: 1,
        alignItems: 'center',
    },
    navButton: {
        padding: 10,
        backgroundColor: '#007BFF', // or any other background color
        borderRadius: 5,
        width: 100,
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: 'green',
    },
    navButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat_700Bold',
    },
    navButtonPlaceholder: {
        width: 100,
    },
    pageCount: {
        fontSize: 16,
        fontFamily: 'Montserrat_700Bold',
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
        fontFamily: 'Montserrat_400Regular',
    },
    dateButton: {
        justifyContent: 'center',
    },
    dateButtonText: {
        color: '#000',
        fontFamily: 'Montserrat_400Regular',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        height: 50,
        borderRadius: 25,
        paddingLeft: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    inputContainer: {
        width: '95%',
    },
});
