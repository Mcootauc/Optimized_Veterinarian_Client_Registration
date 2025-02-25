import React, { useState } from 'react';
import {
    View,
    TextInput,
    Alert,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
} from 'react-native';
import AppLoading from 'expo-app-loading';
import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { submitFormData } from '../components/GoogleSheetsService';

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

    const nextPage = () => {
        if (currentPage < 3) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    // Submit function called on the final page
    const handleSubmit = async () => {
        // Validation can be added here

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
            species,
            breed,
            age,
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
            setSpecies('');
            setBreed('');
            setAge('');
            setSex('');
            setSpayedOrNeutered('');
            setColor('');
            setMicrochip('');
            setInitials('');
            setCurrentPage(0); // Reset to the first page if desired
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

    // Render form content based on the current page
    const renderPageContent = () => {
        switch (currentPage) {
            case 0:
                return (
                    <>
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
                    </>
                );
            case 1:
                return (
                    <>
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
                    </>
                );
            case 2:
                return (
                    <>
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
                    </>
                );
            case 3:
                return (
                    <>
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
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your initials"
                            value={initials}
                            onChangeText={setInitials}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    // Render navigation buttons:
    // "Back" always on the left (if not on first page)
    // On pages 0-2, "Next" is on the right.
    // On page 3, "Submit" is on the right (green button).
    const renderNavigation = () => {
        return (
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
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {renderPageContent()}
            {renderNavigation()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
        marginTop: 20,
    },
    navLeft: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    navRight: {
        flex: 1,
        alignItems: 'flex-end',
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
});
