import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { Colors } from '../constants/Colors';

export const LanguageToggle: React.FC = () => {
    const { currentLanguage, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(currentLanguage === 'en' ? 'zh' : 'en');
    };

    return (
        <TouchableOpacity style={styles.container} onPress={toggleLanguage}>
            <Text
                style={[
                    styles.text,
                    currentLanguage === 'en' && styles.activeText,
                ]}
            >
                En
            </Text>
            <Text style={styles.separator}>|</Text>
            <Text
                style={[
                    styles.text,
                    currentLanguage === 'zh' && styles.activeText,
                ]}
            >
                中文
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.darkBlue,
    },
    text: {
        fontSize: 14,
        color: Colors.darkBlue,
        fontWeight: '500',
    },
    activeText: {
        color: Colors.darkBlue,
        fontWeight: '700',
    },
    separator: {
        fontSize: 14,
        color: Colors.darkBlue,
        marginHorizontal: 4,
        fontWeight: '300',
    },
});
