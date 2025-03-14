import React, { useState, useRef } from 'react';
import {
    View,
    TextInput,
    Alert,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import AppLoading from 'expo-app-loading';
import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { submitFormData } from '../components/SupabaseService';

export default function Index() {
    // Add loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form fields
    const [ownerName, setOwnerName] = useState('');
    const [homeAddress, setHomeAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [cellPhone, setCellPhone] = useState('');
    const [email, setEmail] = useState('');
    const [petName, setPetName] = useState('');
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [color, setColor] = useState('');
    const [sex, setSex] = useState('');
    const [spayedOrNeutered, setSpayedOrNeutered] = useState('');
    const [microchip, setMicrochip] = useState('');
    const [initials, setInitials] = useState('');

    // Navigation state for multi-page form (pages: 0 to 3)
    const [currentPage, setCurrentPage] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const width = Dimensions.get('window').width;

    const nextPage = () => {
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

    // Submit function called on the final page
    const handleSubmit = async () => {
        // Set loading state to true
        setIsSubmitting(true);

        try {
            // Generate the timestamp in ISO format (fix the timestamp issue)
            const timestamp = new Date().toISOString();

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
                species,
                breed,
                age,
                sex,
                spayedOrNeutered,
                color,
                microchip,
                initials,
            };

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
            setSpecies('');
            setBreed('');
            setAge('');
            setSex('');
            setSpayedOrNeutered('');
            setColor('');
            setMicrochip('');
            setInitials('');
            setCurrentPage(0); // Reset to the first page if desired
            scrollViewRef.current?.scrollTo({ x: 0, animated: true });
        } catch (error: any) {
            Alert.alert('Error', `Failed to submit data: ${error.message}`);
        } finally {
            // Set loading state back to false when done
            setIsSubmitting(false);
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
        switch (page) {
            case 0:
                return (
                    <View style={styles.page}>
                        <Text style={styles.label}>Name:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Owner's First and Last Name"
                            value={ownerName}
                            onChangeText={setOwnerName}
                        />
                        <Text style={styles.label}>Address:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Home Address"
                            value={homeAddress}
                            onChangeText={setHomeAddress}
                        />
                        <Text style={styles.label}>City:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="City"
                            value={city}
                            onChangeText={setCity}
                        />
                        <Text style={styles.label}>State:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="State"
                            value={state}
                            onChangeText={setState}
                        />
                    </View>
                );
            case 1:
                return (
                    <View style={styles.page}>
                        <Text style={styles.label}>Zip Code:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Zip Code"
                            value={zipCode}
                            onChangeText={setZipCode}
                        />
                        <Text style={styles.label}>Number:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Cell Phone #"
                            value={cellPhone}
                            onChangeText={setCellPhone}
                        />
                        <Text style={styles.label}>Email:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="E-mail Address"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Text style={styles.label}>Pet Name:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Pet's Name"
                            value={petName}
                            onChangeText={setPetName}
                        />
                    </View>
                );
            case 2:
                return (
                    <View style={styles.page}>
                        <Text style={styles.label}>Species:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Species (Dog, Cat, etc.)"
                            value={species}
                            onChangeText={setSpecies}
                        />
                        <Text style={styles.label}>Breed:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Breed"
                            value={breed}
                            onChangeText={setBreed}
                        />
                        <Text style={styles.label}>Age:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Age/Date of Birth"
                            value={age}
                            onChangeText={setAge}
                        />
                        <Text style={styles.label}>Color:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Color"
                            value={color}
                            onChangeText={setColor}
                        />
                    </View>
                );
            case 3:
                return (
                    <View style={styles.page}>
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
                            style={styles.input}
                            placeholder="Enter your initials"
                            value={initials}
                            onChangeText={setInitials}
                        />
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            <ScrollView horizontal pagingEnabled ref={scrollViewRef}>
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
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
                        >
                            <Text style={styles.navButtonText}>Next</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.navButton, styles.submitButton]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <View style={styles.loaderContainer}>
                                    <ActivityIndicator
                                        size="small"
                                        color="#fff"
                                    />
                                    <Text
                                        style={[
                                            styles.navButtonText,
                                            styles.loaderText,
                                        ]}
                                    ></Text>
                                </View>
                            ) : (
                                <Text style={styles.navButtonText}>Submit</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        width: Dimensions.get('window').width,
        padding: 20,
        justifyContent: 'center',
    },
    container: {
        flexGrow: 1,
        padding: 20,
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA', // or #FBF2ED
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
    loaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loaderText: {
        marginLeft: 5,
    },
});
