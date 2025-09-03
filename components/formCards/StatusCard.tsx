import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import CardContainer from '@/components/cardContainer';
import Divider from '@/components/Divider';
import { useLanguage } from '../../contexts/LanguageContext';

interface StatusCardProps {
    spayedOrNeutered: string;
    setSpayedOrNeutered: (val: string) => void;
    microchipStatus: string;
    setMicrochipStatus: (val: string) => void;
    microchip: string;
    setMicrochip: (val: string) => void;
    spayedNeuteredError?: string;
    microchipError?: string;
    hasError: boolean;
    width: number;
    dividerColor: string;
}

const StatusCard = ({
    spayedOrNeutered,
    setSpayedOrNeutered,
    microchipStatus,
    setMicrochipStatus,
    microchip,
    setMicrochip,
    spayedNeuteredError,
    microchipError,
    hasError,
    width,
    dividerColor,
}: StatusCardProps) => {
    const { t } = useLanguage();
    return (
        <CardContainer hasError={hasError} paddingBottom={0}>
            <View style={[styles.container, { width: width - 80 }]}>
                <Text style={styles.pageTitle}>{t('status')}</Text>
                <Divider
                    color={dividerColor}
                    width={2}
                    orientation="horizontal"
                />

                <View style={styles.section}>
                    <View style={styles.gridRow}>
                        <View style={styles.labelColumn}>
                            <Text style={styles.label}>
                                {t('spayedNeutered')}
                            </Text>
                        </View>
                        <View style={styles.buttonsColumn}>
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    spayedOrNeutered === 'Yes' &&
                                        styles.selectedButton,
                                ]}
                                onPress={() => setSpayedOrNeutered('Yes')}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        spayedOrNeutered === 'Yes'
                                            ? styles.selectedText
                                            : styles.unselectedText,
                                    ]}
                                >
                                    {t('yes')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    spayedOrNeutered === 'No' &&
                                        styles.selectedButton,
                                ]}
                                onPress={() => setSpayedOrNeutered('No')}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        spayedOrNeutered === 'No'
                                            ? styles.selectedText
                                            : styles.unselectedText,
                                    ]}
                                >
                                    {t('no')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    spayedOrNeutered === 'Unknown' &&
                                        styles.selectedButton,
                                ]}
                                onPress={() => setSpayedOrNeutered('Unknown')}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        spayedOrNeutered === 'Unknown'
                                            ? styles.selectedText
                                            : styles.unselectedText,
                                    ]}
                                >
                                    {t('unknown')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {spayedNeuteredError ? (
                        <Text style={styles.errorText}>
                            {spayedNeuteredError}
                        </Text>
                    ) : null}
                </View>

                <View style={styles.section}>
                    <View style={styles.gridRow}>
                        <View style={styles.labelColumn}>
                            <Text style={styles.label}>{t('microchip')}</Text>
                        </View>
                        <View style={styles.buttonsColumn}>
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    microchipStatus === 'Yes' &&
                                        styles.selectedButton,
                                ]}
                                onPress={() => setMicrochipStatus('Yes')}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        microchipStatus === 'Yes'
                                            ? styles.selectedText
                                            : styles.unselectedText,
                                    ]}
                                >
                                    {t('yes')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    microchipStatus === 'No' &&
                                        styles.selectedButton,
                                ]}
                                onPress={() => setMicrochipStatus('No')}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        microchipStatus === 'No'
                                            ? styles.selectedText
                                            : styles.unselectedText,
                                    ]}
                                >
                                    {t('no')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    microchipStatus === 'Unknown' &&
                                        styles.selectedButton,
                                ]}
                                onPress={() => setMicrochipStatus('Unknown')}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        microchipStatus === 'Unknown'
                                            ? styles.selectedText
                                            : styles.unselectedText,
                                    ]}
                                >
                                    {t('unknown')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {microchipError ? (
                        <Text style={styles.microchipErrorText}>
                            {microchipError}
                        </Text>
                    ) : null}
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
        marginBottom: 8,
    },
    section: {
        marginBottom: 5,
    },
    label: {
        fontSize: 12,
        marginLeft: 2,
        fontFamily: 'Inter_400Regular',
    },
    gridRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        width: '100%',
    },
    labelColumn: {
        width: 130,
        justifyContent: 'center',
    },
    buttonsColumn: {
        flexDirection: 'row',
        gap: 8,
        flex: 1,
    },
    button: {
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: Colors.white,
        flex: 1,
    },
    selectedButton: {
        backgroundColor: Colors.blue,
    },
    buttonText: {
        fontSize: 10,
        fontFamily: 'Inter_400Regular',
    },
    unselectedText: {
        color: Colors.black,
    },
    selectedText: {
        color: Colors.white,
    },
    input: {
        width: '100%',
        height: 35,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 6,
        marginTop: 5,
        paddingLeft: 10,
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
        backgroundColor: Colors.white,
    },
    inputError: {
        borderColor: Colors.red,
    },
    disabledInput: {
        backgroundColor: Colors.gray,
    },
    errorText: {
        color: Colors.red,
        fontSize: 8,
        marginLeft: 5,
        marginBottom: 5,
        fontFamily: 'Inter_600SemiBold',
    },
    microchipErrorText: {
        color: Colors.red,
        fontSize: 8,
        marginLeft: 5,
        marginTop: 5,
        fontFamily: 'Inter_600SemiBold',
    },
});

export default StatusCard;
