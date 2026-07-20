import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../../constants/Colors';

interface CheckboxFieldProps {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
    label,
    value,
    onValueChange,
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onValueChange(!value)}
            activeOpacity={0.7}
        >
            <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                {value && <FontAwesome name="check" size={16} color="white" />}
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        height: 35,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: '#B8BDC6',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkboxChecked: {
        backgroundColor: Colors.steelBlue,
        borderColor: Colors.steelBlue,
    },
    label: {
        fontSize: 16, // Matching similar labels, though InputField uses 12. Let's stick with 16 for readability
        fontFamily: 'Inter_400Regular',
        color: 'black',
    },
});

export default CheckboxField;
