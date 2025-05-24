import React from 'react';
import {
    TextInput,
    Text,
    View,
    StyleSheet,
    TextInputProps,
    ViewStyle,
    StyleProp,
} from 'react-native';
import { Colors } from '../../constants/Colors';

interface InputFieldProps {
    style?: StyleProp<ViewStyle>;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: TextInputProps['keyboardType'];
    editable?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    style,
    placeholder,
    value,
    onChangeText,
    error,
    secureTextEntry = false,
    keyboardType = 'default',
}) => {
    return (
        <View style={[styles.container, style]}>
            <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 35,
        borderColor: '#B8BDC6',
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 4,
        paddingLeft: 10,
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
    },
    inputError: {
        borderColor: Colors.red,
        borderWidth: 1,
    },
    errorText: {
        color: Colors.red,
        fontSize: 8,
        marginTop: 0,
        marginLeft: 5,
        marginBottom: 0,
        fontFamily: 'Inter_600SemiBold',
    },
});

export default InputField;
