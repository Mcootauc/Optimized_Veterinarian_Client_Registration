import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
    GooglePlacesAutocomplete,
    GooglePlacesAutocompleteRef,
    PlaceType,
} from 'react-native-google-places-autocomplete';
import { Colors } from '../../constants/Colors';

interface AddressResult {
    full: string;
    street: string;
    city: string;
    state: string;
    zip: string;
}

interface AddressInputProps {
    onSelect: (result: AddressResult) => void;
    error?: string;
    onClear?: () => void;
}

const AddressInput: React.FC<AddressInputProps> = ({
    onSelect,
    error,
    onClear,
}) => {
    const googlePlacesRef = useRef<GooglePlacesAutocompleteRef | null>(null);

    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                ref={googlePlacesRef}
                fetchDetails={true}
                minLength={1}
                debounce={120}
                placeholder="Address"
                enablePoweredByContainer={false}
                disableScroll={true}
                onFail={(error) => console.error('Google Places error:', error)}
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
                }}
                listViewDisplayed={true}
                keyboardShouldPersistTaps="handled"
                renderRightButton={() => (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={() => {
                            if (googlePlacesRef.current) {
                                googlePlacesRef.current.clear();
                                if (onClear) onClear();
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
                        height: 30,
                        fontSize: 22,
                        fontFamily: 'Inter_400Regular',
                        borderWidth: 1,
                        borderColor: error ? Colors.red : '#B8BDC6',
                        borderRadius: 6,
                        paddingLeft: 10,
                        paddingRight: 55,
                        backgroundColor: Colors.white,
                    },
                    listView: {
                        borderWidth: 1,
                        borderColor: '#B8BDC6',
                        backgroundColor: Colors.white,
                        margin: 0,
                        fontSize: 20,
                        maxHeight: 304,
                        position: 'absolute',
                        width: '100%',
                        top: 72,
                        zIndex: 1000,
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
                    key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
                    language: 'en',
                }}
                onPress={(data, details = null) => {
                    const components = details?.address_components;
                    const getComponent = (type: string) =>
                        components?.find((c) =>
                            c.types.includes(type as PlaceType)
                        )?.long_name ?? '';

                    const streetNumber = getComponent('street_number');
                    const route = getComponent('route');
                    const fullStreet = `${streetNumber} ${route}`.trim();

                    onSelect({
                        full: data.description,
                        street: fullStreet,
                        city: getComponent('locality'),
                        state: getComponent('administrative_area_level_1'),
                        zip: getComponent('postal_code'),
                    });
                }}
            />
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 25,
        position: 'relative',
    },
    errorContainer: {
        paddingLeft: 10,
        marginTop: 5,
    },
    errorText: {
        color: Colors.red,
        fontSize: 20,
        fontFamily: 'Inter_600SemiBold',
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
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
    },
});

export default AddressInput;
