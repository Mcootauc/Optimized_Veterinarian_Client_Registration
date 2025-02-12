import React, { useState } from "react";
import {
    View,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
} from "react-native";
import { submitFormData } from "../components/GoogleSheetsService";

export default function Index() {
    const [ownerName, setOwnerName] = useState("");
    const [homeAddress, setHomeAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [cellPhone, setCellPhone] = useState("");
    const [email, setEmail] = useState("");
    const [petName, setPetName] = useState("");
    const [species, setSpecies] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("");
    const [spayedOrNeutered, setSpayedOrNeutered] = useState("");
    const [color, setColor] = useState("");
    const [microchip, setMicrochip] = useState("");
    const [initials, setInitials] = useState("");

    const handleSubmit = async () => {
        // Validation checks
        const lettersOnlyRegex = /^[A-Za-z\s]+$/;
        const numbersOnlyRegex = /^\d+$/;

        // Check if any fields are empty
        if (
            !ownerName ||
            !homeAddress ||
            !city ||
            !state ||
            !zipCode ||
            !cellPhone ||
            !email ||
            !petName ||
            !species ||
            !breed ||
            !age ||
            !color ||
            !sex ||
            !spayedOrNeutered ||
            !microchip
        ) {
            Alert.alert(
                "Error",
                "Fill out the rest of the form before submitting!"
            );
            return; // Stop form submission
        }

        if (!initials) {
            Alert.alert(
                "Error",
                "Please provide your initials to agree to the terms."
            );
            return;
        }

        // Check for letters-only fields
        if (
            !lettersOnlyRegex.test(species) ||
            !lettersOnlyRegex.test(breed) ||
            !lettersOnlyRegex.test(color)
        ) {
            Alert.alert(
                "Error",
                "Species, Breed, and Color should only contain letters."
            );
            return; // Stop form submission
        }

        // Check for numbers-only in Cell Phone Number
        if (!numbersOnlyRegex.test(cellPhone)) {
            Alert.alert(
                "Error",
                "Cell Phone Number should only contain numbers."
            );
            return; // Stop form submission
        }

        // Generate the timestamp when the form is submitted
        const timestamp = new Date().toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
        });

        // If all validations pass, proceed to submit the form
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
            Alert.alert("Success", responseMessage);

            // Reset all input fields after successful submission
            setOwnerName("");
            setHomeAddress("");
            setCity("");
            setState("");
            setZipCode("");
            setCellPhone("");
            setEmail("");
            setPetName("");
            setSpecies("");
            setBreed("");
            setAge("");
            setSex("");
            setSpayedOrNeutered("");
            setColor("");
            setMicrochip("");
            setInitials("");
        } catch (error: any) {
            Alert.alert("Error", `Failed to submit data: ${error.message}`);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
            {/* Row for City, State, Zip Code */}
            <View style={styles.row}>
                <TextInput
                    style={[styles.input, styles.inputFlex]}
                    placeholder="City"
                    value={city}
                    onChangeText={setCity}
                />
                <TextInput
                    style={[styles.input, styles.inputFlex]}
                    placeholder="State"
                    value={state}
                    onChangeText={setState}
                />
                <TextInput
                    style={[styles.input, styles.inputFlex]}
                    placeholder="Zip Code"
                    value={zipCode}
                    onChangeText={setZipCode}
                />
            </View>

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

            <Text style={styles.label}>Pet Information:</Text>
            {/* Row for Pet's Name and Species */}
            <View style={styles.row}>
                <TextInput
                    style={[styles.input, styles.inputFlex]}
                    placeholder="Pet's Name"
                    value={petName}
                    onChangeText={setPetName}
                />
                <TextInput
                    style={[styles.input, styles.inputFlex]}
                    placeholder="Species (Dog, Cat, Bird)"
                    value={species}
                    onChangeText={setSpecies}
                />
            </View>
            <View style={styles.row}>
                <TextInput
                    style={[styles.input, styles.inputFlex]}
                    placeholder="Breed"
                    value={breed}
                    onChangeText={setBreed}
                />
                <TextInput
                    style={[styles.input, styles.inputFlex]}
                    placeholder="Age/Date of Birth"
                    value={age}
                    onChangeText={setAge}
                />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Color"
                value={color}
                onChangeText={setColor}
            />

            {/* Button Selection */}
            <View style={styles.selectionContainer}>
                <Text style={styles.label}>Sex:</Text>
                <View style={styles.selectionButtons}>
                    <TouchableOpacity
                        style={[
                            styles.optionButton,
                            sex === "Male" && styles.selectedOption,
                        ]}
                        onPress={() => setSex("Male")}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                sex === "Male"
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
                            sex === "Female" && styles.selectedOption,
                        ]}
                        onPress={() => setSex("Female")}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                sex === "Female"
                                    ? styles.selectedText
                                    : styles.unselectedText,
                            ]}
                        >
                            Female
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Spayed/Castrated Selection */}
            <View style={styles.selectionContainer}>
                <Text style={styles.label}>Spayed/Castrated:</Text>
                <View style={styles.selectionButtons}>
                    <TouchableOpacity
                        style={[
                            styles.optionButton,
                            spayedOrNeutered === "Yes" && styles.selectedOption,
                        ]}
                        onPress={() => setSpayedOrNeutered("Yes")}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                spayedOrNeutered === "Yes"
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
                            spayedOrNeutered === "No" && styles.selectedOption,
                        ]}
                        onPress={() => setSpayedOrNeutered("No")}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                spayedOrNeutered === "No"
                                    ? styles.selectedText
                                    : styles.unselectedText,
                            ]}
                        >
                            No
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Microchip Selection */}
            <View style={styles.selectionContainer}>
                <Text style={styles.label}>Microchip:</Text>
                <View style={styles.selectionButtons}>
                    <TouchableOpacity
                        style={[
                            styles.optionButton,
                            microchip === "Yes" && styles.selectedOption,
                        ]}
                        onPress={() => setMicrochip("Yes")}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                microchip === "Yes"
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
                            microchip === "No" && styles.selectedOption,
                        ]}
                        onPress={() => setMicrochip("No")}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                microchip === "No"
                                    ? styles.selectedText
                                    : styles.unselectedText,
                            ]}
                        >
                            No
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.label}>Terms:</Text>
            <Text style={styles.label}>
                All fees are due and payable prior to the release of the
                patient. Upon your request, we can provide you with a written
                estimate of fees for any treatments, emergency care, surgery, or
                hospitalization services to be performed.
            </Text>
            <Text style={styles.label}>
                You understand and approve all necessary after-office-hours
                veterinary services that may be performed on your pet in the
                judgment of the veterinarian. You are also aware that the
                continuous presence of veterinary personnel may not be provided
                after office hours as this is not a 24-hour facility.
            </Text>
            {/* Initials input field */}
            <TextInput
                style={styles.input}
                placeholder="Enter your initials to agree"
                value={initials}
                onChangeText={setInitials}
            />

            <Button title="Submit" onPress={handleSubmit} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        alignItems: "stretch",
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 0,
    },
    inputFlex: {
        flex: 1,
        marginRight: 5,
        marginLeft: 5,
    },
    selectionContainer: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    selectionButtons: {
        flexDirection: "row",
    },
    optionButton: {
        flex: 1,
        alignItems: "center",
        padding: 10,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
    },
    selectedOption: {
        backgroundColor: "#007BFF",
    },
    optionText: {
        fontSize: 16,
    },
    unselectedText: {
        color: "black",
    },
    selectedText: {
        color: "white",
    },
});
