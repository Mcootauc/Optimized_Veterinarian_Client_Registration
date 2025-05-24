import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../../constants/Colors';

interface DateFieldProps {
    placeholder: string;
    value: Date | null;
    onChange: (date: Date) => void;
    error?: string;
}

const DateField: React.FC<DateFieldProps> = ({
    placeholder,
    value,
    onChange,
    error,
}) => {
    const [showPicker, setShowPicker] = useState(false);

    const formatDate = useMemo(() => {
        return (date: Date | null) => {
            if (!date) return '';
            return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            });
        };
    }, []);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.dateButton, error ? styles.inputError : null]}
                onPress={() => setShowPicker(true)}
            >
                <Text style={styles.dateButtonText}>
                    {value ? formatDate(value) : placeholder}
                </Text>
                <FontAwesome
                    name="chevron-down"
                    size={24}
                    color={Colors.gray}
                    style={styles.icon}
                />
            </TouchableOpacity>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {showPicker && (
                <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    themeVariant="dark"
                    maximumDate={new Date()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    dateButton: {
        width: '100%',
        height: 70,
        borderColor: '#B8BDC6',
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 10,
        paddingLeft: 18,
        justifyContent: 'center',
        position: 'relative',
    },
    inputError: {
        borderColor: Colors.red,
        borderWidth: 1,
    },
    dateButtonText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 22,
        color: 'gray',
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

export default DateField;
