import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import CardContainer from '@/components/cardContainer';
import Divider from '@/components/Divider';
import InputField from '@/components/formComponents/InputField';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';

interface PetDetailsCardProps {
    petName: string;
    setPetName: (val: string) => void;
    petNameError: string;
    setPetNameError: (val: string) => void;
    color: string;
    setColor: (val: string) => void;
    colorError: string;
    setColorError: (val: string) => void;
    selectSpecies: string;
    setSelectSpecies: (val: string) => void;
    speciesError: string;
    setSpeciesError: (val: string) => void;
    breed: string;
    setBreed: (val: string) => void;
    breedError: string;
    setBreedError: (val: string) => void;
    birthDate: Date | null;
    setBirthDate: (val: Date | null) => void;
    birthDateError: string;
    setBirthDateError: (val: string) => void;
    showDatePicker: boolean;
    setShowDatePicker: (val: boolean) => void;
    sex: string;
    setSex: (val: string) => void;
    sexError: string;
    setSexError: (val: string) => void;
    formatDate: (date: Date | null) => string;
    onDateChange: (event: any, selectedDate?: Date) => void;
    hasError: boolean;
    width: number;
}

const PetDetailsCard = ({
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
    formatDate,
    onDateChange,
    hasError,
    width,
}: PetDetailsCardProps) => {
    return (
        <CardContainer hasError={hasError} paddingBottom={5}>
            <View style={[styles.container, { width: width - 70 }]}>
                <Text style={styles.pageTitle}>Pet Details</Text>
                <Divider
                    color={Colors.darkBlue}
                    width={2}
                    orientation="horizontal"
                />
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 8,
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <InputField
                            placeholder="Pet Name"
                            value={petName}
                            onChangeText={(t) => {
                                setPetName(t);
                                setPetNameError('');
                            }}
                            error={petNameError}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <InputField
                            placeholder="Color"
                            value={color}
                            onChangeText={(t) => {
                                setColor(t);
                                setColorError('');
                            }}
                            error={colorError}
                        />
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 8,
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
                                        fontSize: 12,
                                        fontFamily: 'Inter_400Regular',
                                        paddingVertical: 0,
                                        paddingHorizontal: 0,
                                        paddingLeft: 10,
                                        color: Colors.black,
                                    },
                                    placeholder: {
                                        color: Colors.gray,
                                        paddingLeft: 10,
                                        fontSize: 12,
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
                                    {
                                        label: 'Dog',
                                        value: 'Dog',
                                    },
                                    {
                                        label: 'Cat',
                                        value: 'Cat',
                                    },
                                    {
                                        label: 'Other',
                                        value: 'Other',
                                    },
                                ]}
                            />
                            <FontAwesome
                                name="chevron-down"
                                size={12}
                                color={Colors.gray}
                                style={{
                                    position: 'absolute',
                                    right: 10,
                                    top: 10,
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
                        <InputField
                            error={breedError}
                            placeholder="Breed"
                            value={breed}
                            onChangeText={(text) => {
                                setBreed(text);
                                setBreedError('');
                            }}
                            editable={
                                selectSpecies === 'Dog' ||
                                selectSpecies === 'Cat'
                            }
                        />
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 8,
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
                            <Text
                                style={[
                                    styles.dateButtonText,
                                    !birthDate && styles.dateButtonPlaceholder,
                                ]}
                            >
                                {birthDate
                                    ? formatDate(birthDate)
                                    : 'Select Birth Date'}
                            </Text>
                        </TouchableOpacity>
                        <FontAwesome
                            name="chevron-down"
                            size={12}
                            color={Colors.gray}
                            style={{
                                position: 'absolute',
                                right: 10,
                                top: 10,
                            }}
                        />
                        {birthDateError ? (
                            <Text style={styles.birthDateErrorText}>
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
                                        fontSize: 12,
                                        fontFamily: 'Inter_400Regular',
                                        paddingVertical: 0,
                                        paddingHorizontal: 0,
                                        paddingLeft: 10,
                                        color: Colors.black,
                                    },
                                    placeholder: {
                                        color: Colors.gray,
                                        paddingLeft: 10,
                                        fontSize: 12,
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
                                    {
                                        label: 'Male',
                                        value: 'Male',
                                    },
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
                                size={12}
                                color={Colors.gray}
                                style={{
                                    position: 'absolute',
                                    right: 10,
                                    top: 10,
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
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
        paddingVertical: 15,
        marginBottom: 0,
    },
    pageTitle: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: Colors.black,
    },
    input: {
        width: '100%',
        height: 35,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 6,
        paddingLeft: 10,
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
    },
    inputError: {
        borderColor: Colors.red,
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
        fontSize: 12,
        paddingLeft: 0,
    },
    dateButtonPlaceholder: {
        color: Colors.gray,
    },
    selectErrorText: {
        color: Colors.red,
        fontSize: 8,
        marginTop: 4,
        marginLeft: 5,
        marginBottom: 0,
        fontFamily: 'Inter_600SemiBold',
    },
    birthDateErrorText: {
        color: Colors.red,
        fontSize: 8,
        marginTop: 4,
        marginLeft: 5,
        marginBottom: 0,
        fontFamily: 'Inter_600SemiBold',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 6,
        marginBottom: 0,
        height: 35,
        justifyContent: 'center',
    },
});

export default PetDetailsCard;
