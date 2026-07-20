import React, { useState } from 'react';
import { Colors } from '@/constants/Colors';
import {
    View,
    Alert,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import {
    Inter_400Regular,
    Inter_700Bold,
    useFonts,
} from '@expo-google-fonts/inter';
import { containsOnlyNumbers, containsEmoji } from '../ErrorCheck';
import { submitWaitlistFormData } from '../Services/SupabaseService';
import CardContainer from '@/components/cardContainer';
import Divider from '@/components/Divider';
import InputField from '@/components/formComponents/InputField';
import CheckboxField from '@/components/formComponents/CheckboxField';
import { useLanguage } from '../../contexts/LanguageContext';

export default function WaitlistForm() {
    const { t } = useLanguage();
    const { width } = useWindowDimensions();

    const [ownerName, setOwnerName] = useState('');
    const [petName, setPetName] = useState('');
    const [phone, setPhone] = useState('');
    const [reasonForVisit, setReasonForVisit] = useState('');
    const [petInfoUpdate, setPetInfoUpdate] = useState(false);

    const [ownerNameError, setOwnerNameError] = useState('');
    const [petNameError, setPetNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [reasonError, setReasonError] = useState('');

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const validate = () => {
        let isValid = true;

        setOwnerNameError('');
        setPetNameError('');
        setPhoneError('');
        setReasonError('');

        if (!ownerName.trim()) {
            setOwnerNameError(t('ownerNameRequired') || 'Owner Name is required');
            isValid = false;
        } else if (containsEmoji(ownerName)) {
            setOwnerNameError(t('firstNameNoEmojis') || 'Name cannot contain emojis');
            isValid = false;
        }

        if (!petName.trim()) {
            setPetNameError(t('petNameRequired') || 'Pet Name is required');
            isValid = false;
        } else if (containsEmoji(petName)) {
            setPetNameError(t('petNameNoEmojis') || 'Pet Name cannot contain emojis');
            isValid = false;
        }

        if (!phone.trim()) {
            setPhoneError(t('phoneRequired') || 'Phone number is required');
            isValid = false;
        } else if (!containsOnlyNumbers(phone) || phone.length !== 10) {
            setPhoneError(t('phoneInvalid') || 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        if (!reasonForVisit.trim()) {
            setReasonError(t('reasonRequired') || 'Reason for visit is required');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }

        const formData = {
            ownerName,
            petName,
            phone,
            reasonForVisit,
            petInfoUpdate,
        };

        try {
            const responseMessage = await submitWaitlistFormData(formData);
            Alert.alert('Success', responseMessage);

            // Reset form fields
            setOwnerName('');
            setPetName('');
            setPhone('');
            setReasonForVisit('');
            setPetInfoUpdate(false);
        } catch (error: any) {
            Alert.alert(
                t('submitError') || 'Error',
                `${t('submitErrorMessage') || 'Failed to submit data'}: ${error.message}`
            );
        }
    };

    const hasError = !!(ownerNameError || petNameError || phoneError || reasonError);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 20,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={{ marginTop: 40, alignItems: 'center' }}>
                    <CardContainer hasError={hasError} paddingBottom={0}>
                        <View style={[styles.container, { width: width - 70 }]}>
                            <Text style={styles.pageTitle}>{t('waitList') || 'Wait List'}</Text>
                            <Divider
                                color={Colors.steelBlue}
                                width={2}
                                orientation="horizontal"
                            />

                            <View style={styles.inputGroup}>
                                <InputField
                                    placeholder={t('ownerName') || 'Owner Name'}
                                    value={ownerName}
                                    onChangeText={(t) => {
                                        setOwnerName(t);
                                        setOwnerNameError('');
                                    }}
                                    error={ownerNameError}
                                />
                                
                                <InputField
                                    placeholder={t('petName') || 'Pet Name'}
                                    value={petName}
                                    onChangeText={(t) => {
                                        setPetName(t);
                                        setPetNameError('');
                                    }}
                                    error={petNameError}
                                />

                                <InputField
                                    placeholder={t('phoneNumber') || 'Phone Number'}
                                    value={phone}
                                    onChangeText={(t) => {
                                        setPhone(t);
                                        setPhoneError('');
                                    }}
                                    error={phoneError}
                                    keyboardType="phone-pad"
                                />

                                <InputField
                                    placeholder={t('reasonForVisit') || 'Reason for Visit'}
                                    value={reasonForVisit}
                                    onChangeText={(t) => {
                                        setReasonForVisit(t);
                                        setReasonError('');
                                    }}
                                    error={reasonError}
                                    multiline={true}
                                    numberOfLines={3}
                                />

                                <CheckboxField
                                    label={t('petInfoUpdate') || 'Pet Info Update'}
                                    value={petInfoUpdate}
                                    onValueChange={setPetInfoUpdate}
                                />
                            </View>
                        </View>
                    </CardContainer>
                </View>
            </ScrollView>

            <View style={[styles.navContainer, { margin: 'auto' }]}>
                <View style={styles.navLeft}>
                    <View style={styles.navButtonPlaceholder} />
                </View>
                <View style={styles.navCenter}>
                    {/* Intentionally empty for 1-page form */}
                </View>
                <View style={styles.navRight}>
                    <TouchableOpacity
                        style={[styles.navButton, styles.submitButton]}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.navButtonText}>
                            {t('submit')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: Colors.white,
    },
    pageTitle: {
        fontSize: 27,
        fontFamily: 'Inter_400Regular',
        color: Colors.black,
        marginBottom: 10,
    },
    inputGroup: {
        marginTop: 10,
        gap: 5,
    },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
        paddingTop: 10,
    },
    navLeft: {
        flex: 1,
        alignItems: 'flex-start',
        marginLeft: 30,
    },
    navRight: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 30,
    },
    navCenter: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 20,
    },
    navButton: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        backgroundColor: Colors.steelBlue,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: 'green',
    },
    navButtonText: {
        color: Colors.white,
        fontSize: 14,
        fontFamily: 'Inter_700Bold',
    },
    navButtonPlaceholder: {
        width: 100,
    },
});