import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CardContainer from '@/components/cardContainer';
import Divider from '@/components/Divider';
import { useLanguage } from '../../contexts/LanguageContext';
import { styles } from './styles/StatusCard.styles';

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

export default StatusCard;
