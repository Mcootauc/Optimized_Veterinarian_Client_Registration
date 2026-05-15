import React, { useState, useRef } from 'react';
import { Colors } from '@/constants/Colors';
import {
    View,
    Alert,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import {
    Inter_400Regular,
    Inter_700Bold,
    useFonts,
} from '@expo-google-fonts/inter';
import {
    containsEmoji,
    containsOnlyNumbers,
} from '../ErrorCheck';
import { submitPetFormData, ClientSearchResult } from '../Services/SupabaseService';
import 'react-native-get-random-values';
import ClientSearchField from '@/components/formComponents/ClientSearchField';
import PetDetailsCard from '@/components/formCards/PetDetailsCard';
import StatusCard from '@/components/formCards/StatusCard';
import Terms from '@/components/formCards/Terms';
import AssistanceText from '@/components/formComponents/AssistanceText';
import { useLanguage } from '../../contexts/LanguageContext';

export default function NewPetForm() {
    const { t } = useLanguage();
    // Form fields
    const [selectedClient, setSelectedClient] = useState<ClientSearchResult | null>(null);
    const [clientError, setClientError] = useState('');
    
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
    const { width } = useWindowDimensions(); // Get the width of the screen for the transition animation

    // Add error states for page 1
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

    // Add new state variable
    const [microchipStatus, setMicrochipStatus] = useState('');

    // Update the validation for page 1
    const validatePage1 = () => {
        let isValid = true;

        // Reset all error states
        setClientError('');
        // Reset pet details error states too
        setPetNameError('');
        setColorError('');
        setSpeciesError('');
        setBreedError('');
        setBirthDateError('');
        setSexError('');

        // Client validation
        if (!selectedClient) {
            setClientError(t('clientNotSelected') || 'Please select a client');
            isValid = false;
        }

        // Pet Details Validation

        // Pet name validation
        if (!petName.trim()) {
            setPetNameError(t('petNameRequired'));
            isValid = false;
        } else if (containsEmoji(petName)) {
            setPetNameError(t('petNameNoEmojis'));
            isValid = false;
        }

        // Color validation
        if (!color.trim()) {
            setColorError(t('colorRequired'));
            isValid = false;
        }

        // Species validation
        if (!selectSpecies) {
            setSpeciesError(t('speciesRequired'));
            isValid = false;
        }

        // Breed validation
        if (!breed.trim()) {
            setBreedError(t('breedRequired'));
            isValid = false;
        }

        // Birth date validation
        if (!birthDate) {
            setBirthDateError(t('birthDateRequired'));
            isValid = false;
        }

        // Sex validation
        if (!sex) {
            setSexError(t('sexRequired'));
            isValid = false;
        }

        return isValid;
    };

    const validatePage2 = () => {
        let isValid = true;

        // Reset errors
        setSpayedNeuteredError('');
        setMicrochipError('');
        setInitialsError('');

        // Spayed or neutered validation
        if (!spayedOrNeutered) {
            setSpayedNeuteredError('Please select yes, no, or unknown');
            isValid = false;
        }

        // Microchip status validation
        if (!microchipStatus) {
            setMicrochipError('Please select yes, no, or unknown');
            isValid = false;
        } else if (microchipStatus === 'Yes') {
            // If user selected "Yes", they must provide a valid microchip number
            if (microchip.length === 0) {
                setMicrochipError(
                    'Typical microchip numbers are 9, 10, or 15 characters long.'
                );
                isValid = false;
            } else if (!containsOnlyNumbers(microchip)) {
                setMicrochipError('Microchip number can only contain numbers');
                isValid = false;
            } else if (
                microchip.length !== 9 &&
                microchip.length !== 10 &&
                microchip.length !== 15
            ) {
                setMicrochipError(
                    'Typical microchip numbers are 9, 10, or 15 characters long.'
                );
                isValid = false;
            }
        }

        // Initials validation
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
        }

        if (!isValid) return;

        if (currentPage < 1) {
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
        if (!validatePage2()) {
            return;
        }

        // Generate the timestamp when the form is submitted
        const timestamp = new Date().toLocaleString('en-US', {
            timeZone: 'America/Los_Angeles',
        });

        const formData = {
            timestamp,
            clientId: selectedClient?.id,
            petName,
            selectSpecies,
            breed,
            birthDate: birthDate ? birthDate.toISOString().slice(0, 10) : null,
            sex,
            spayedOrNeutered,
            color,
            microchip: microchipStatus === 'Yes' ? microchip : microchipStatus,
            initials,
        };

        try {
            const responseMessage = await submitPetFormData(formData);
            Alert.alert('Success', responseMessage);

            // Reset form fields
            setSelectedClient(null);
            setPetName('');
            setSelectSpecies('');
            setBreed('');
            setBirthDate(null);
            setSex('');
            setSpayedOrNeutered('');
            setColor('');
            setMicrochip('');
            setMicrochipStatus('');
            setInitials('');

            setCurrentPage(0); // Reset to the first page
            scrollViewRef.current?.scrollTo({ x: 0, animated: true });
        } catch (error: any) {
            Alert.alert(
                t('submitError'),
                `${t('submitErrorMessage')}: ${error.message}`
            );
        }
    };

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const petDetailsCardHasError = !!(
        petNameError ||
        colorError ||
        speciesError ||
        breedError ||
        birthDateError ||
        sexError
    );

    const statusCardHasError = !!(spayedNeuteredError || microchipError);

    const termsCardHasError = !!initialsError;

    // Render navigation buttons:
    // "Back" always on the left (if not on first page)
    // On pages 0-2, "Next" is on the right.
    // On page 3, "Submit" is on the right (green button).
    // Render content for a given page number
    const renderPageContent = (page: number) => {
        switch (page) {
            case 0:
                return (
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: 20,
                        }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ marginTop: 40, gap: 30 }}>
                            <ClientSearchField
                                selectedClient={selectedClient}
                                setSelectedClient={setSelectedClient}
                                clientError={clientError}
                                setClientError={setClientError}
                                width={width}
                                dividerColor={Colors.steelBlue}
                            />
                            <PetDetailsCard
                                petName={petName}
                                setPetName={setPetName}
                                petNameError={petNameError}
                                setPetNameError={setPetNameError}
                                color={color}
                                setColor={setColor}
                                colorError={colorError}
                                setColorError={setColorError}
                                selectSpecies={selectSpecies}
                                setSelectSpecies={setSelectSpecies}
                                speciesError={speciesError}
                                setSpeciesError={setSpeciesError}
                                breed={breed}
                                setBreed={setBreed}
                                breedError={breedError}
                                setBreedError={setBreedError}
                                birthDate={birthDate}
                                setBirthDate={setBirthDate}
                                birthDateError={birthDateError}
                                setBirthDateError={setBirthDateError}
                                showDatePicker={showDatePicker}
                                setShowDatePicker={setShowDatePicker}
                                sex={sex}
                                setSex={setSex}
                                sexError={sexError}
                                setSexError={setSexError}
                                formatDate={formatDate}
                                onDateChange={onDateChange}
                                hasError={petDetailsCardHasError}
                                width={width}
                                dividerColor={Colors.steelBlue}
                            />
                            <AssistanceText
                                width={width}
                                color={Colors.steelBlue}
                            />
                        </View>
                    </ScrollView>
                );
            case 1:
                return (
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: 20,
                        }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ marginTop: 40, gap: 30 }}>
                            <StatusCard
                                spayedOrNeutered={spayedOrNeutered}
                                setSpayedOrNeutered={setSpayedOrNeutered}
                                microchipStatus={microchipStatus}
                                setMicrochipStatus={setMicrochipStatus}
                                microchip={microchip}
                                setMicrochip={setMicrochip}
                                spayedNeuteredError={spayedNeuteredError}
                                microchipError={microchipError}
                                hasError={statusCardHasError}
                                width={width}
                                dividerColor={Colors.steelBlue}
                            />
                            <Terms
                                initials={initials}
                                setInitials={setInitials}
                                initialsError={initialsError}
                                setInitialsError={setInitialsError}
                                width={width}
                                hasError={termsCardHasError}
                                dividerColor={Colors.steelBlue}
                            />
                        </View>
                    </ScrollView>
                );
            default:
                return null;
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <ScrollView
                horizontal
                scrollEnabled={false}
                pagingEnabled={true}
                ref={scrollViewRef}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={{ flex: 1 }}
            >
                {renderPageContent(0)}
                {renderPageContent(1)}
            </ScrollView>
            <View style={[styles.navContainer, { margin: 'auto' }]}>
                <View style={styles.navLeft}>
                    {currentPage > 0 ? (
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={prevPage}
                        >
                            <Text style={styles.navButtonText}>
                                {t('back')}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.navButtonPlaceholder} />
                    )}
                </View>
                <View style={styles.navCenter}>
                    <Text style={styles.pageCount}>{`${
                        currentPage + 1
                    } / 2`}</Text>
                </View>
                <View style={styles.navRight}>
                    {currentPage < 1 ? (
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={nextPage}
                        >
                            <Text style={styles.navButtonText}>
                                {t('next')}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.navButton, styles.submitButton]}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.navButtonText}>
                                {t('submit')}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 25,
        justifyContent: 'center',
    },
    pageTitle: {
        fontSize: 27,
        fontFamily: 'Inter_400Regular',
        color: Colors.black,
    },
    container: {
        flexGrow: 1,
        padding: 20,
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: Colors.white, // orhsl(20, 44.80%, 82.90%)46.30%, 70.80%)
    },
    input: {
        width: '100%',
        height: 70,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 20,
        paddingLeft: 18,
        fontFamily: 'Inter_400Regular',
        fontSize: 22,
    },
    terms: {
        fontSize: 20,
        fontFamily: 'Inter_400Regular',
        paddingBottom: 10,
    },
    label: {
        fontSize: 22,
        marginLeft: 2,
        marginBottom: 5,
        fontFamily: 'Inter_700Bold',
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
        borderRadius: 6,
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
        fontFamily: 'Inter_400Regular',
    },
    selectedText: {
        color: 'white',
        fontFamily: 'Inter_400Regular',
    },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
    },
    navLeft: {
        flex: 1,
        alignItems: 'flex-start',
        marginLeft: 30,
    },
    navRight: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 30,
    },
    navCenter: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 20,
    },
    navButton: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        backgroundColor: Colors.steelBlue,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: 'green',
    },
    navButtonText: {
        color: Colors.white,
        fontSize: 14,
        fontFamily: 'Inter_700Bold',
    },
    navButtonPlaceholder: {
        width: 100,
    },
    pageCount: {
        fontSize: 14,
        fontFamily: 'Inter_700Bold',
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    dateButton: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 0,
    },
    dateButtonText: {
        color: Colors.black,
        fontFamily: 'Inter_400Regular',
        fontSize: 22,
        paddingLeft: 0,
    },
    textInput: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        height: 70,
        borderRadius: 20,
        paddingLeft: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    inputContainer: {
        width: '90%', //
    },
    required: {
        color: 'red',
        fontSize: 25,
    },
    inputGroup: {
        marginBottom: 0, // Spacing between form elements
        width: '100%',
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
    birthDateErrorText: {
        color: Colors.red,
        fontSize: 20,
        marginTop: -10,
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
    },
    linkText: {
        color: Colors.darkBlue,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        marginBottom: 10,
    },
    checkIcon: {
        marginLeft: 10,
    },
});