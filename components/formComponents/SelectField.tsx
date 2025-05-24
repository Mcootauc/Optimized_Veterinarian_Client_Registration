import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect, { Item as PickerItem } from 'react-native-picker-select';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../../constants/Colors';

interface SelectFieldProps {
    placeholder: string;
    value: string;
    items: PickerItem[];
    onValueChange: (value: string) => void;
    error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
    placeholder,
    value,
    items,
    onValueChange,
    error,
}) => {
    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.pickerContainer,
                    error ? styles.inputError : null,
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
                    }}
                    useNativeAndroidPickerStyle={false}
                    placeholder={{ label: placeholder, value: null }}
                    value={value}
                    onValueChange={onValueChange}
                    items={items}
                />
                <FontAwesome
                    name="chevron-down"
                    size={24}
                    color={Colors.gray}
                    style={styles.icon}
                />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#B8BDC6',
        borderRadius: 6,
        marginBottom: 10,
        height: 70,
        justifyContent: 'center',
        position: 'relative',
    },
    inputError: {
        borderColor: Colors.red,
        borderWidth: 1,
    },
    errorText: {
        color: Colors.red,
        fontSize: 20,
        marginTop: 0,
        marginLeft: 10,
        marginBottom: 10,
        fontFamily: 'Inter_600SemiBold',
    },
    icon: {
        position: 'absolute',
        right: 20,
        top: 20,
    },
});

export default SelectField;
