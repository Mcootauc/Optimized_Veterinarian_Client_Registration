import { View, Text, TextInput } from 'react-native';
import Divider from '@/components/Divider';
import CardContainer from '@/components/cardContainer';
import InputField from '@/components/formComponents/InputField';
import { useLanguage } from '../../contexts/LanguageContext';
import { styles } from './styles/SecondaryContact.styles';

export default function SecondaryContact({
    contactFirstName,
    setContactFirstName,
    contactFirstNameError,
    setContactFirstNameError,
    contactLastName,
    setContactLastName,
    contactLastNameError,
    setContactLastNameError,
    contactCellPhone,
    setContactCellPhone,
    contactCellPhoneError,
    setContactCellPhoneError,
    width,
    hasError,
    dividerColor,
}: {
    contactFirstName: string;
    setContactFirstName: (text: string) => void;
    contactFirstNameError: string;
    setContactFirstNameError: (text: string) => void;
    contactLastName: string;
    setContactLastName: (text: string) => void;
    contactLastNameError: string;
    setContactLastNameError: (text: string) => void;
    contactCellPhone: string;
    setContactCellPhone: (text: string) => void;
    contactCellPhoneError: string;
    setContactCellPhoneError: (text: string) => void;
    width: number;
    hasError: boolean;
    dividerColor: string;
}) {
    const { t } = useLanguage();
    return (
        <CardContainer hasError={hasError} paddingBottom={0}>
            <View style={[styles.container, { width: width - 80 }]}>
                <Text style={styles.pageTitle}>{t('secondaryContact')}</Text>
                <Divider
                    color={dividerColor}
                    width={2}
                    orientation="horizontal"
                />
                <View style={styles.nameRow}>
                    <View style={styles.nameCol}>
                        <InputField
                            placeholder={t('firstName')}
                            value={contactFirstName}
                            onChangeText={(t) => {
                                setContactFirstName(t);
                                setContactFirstNameError('');
                            }}
                            error={contactFirstNameError}
                        />
                    </View>
                    <View style={styles.nameCol}>
                        <InputField
                            placeholder={t('lastName')}
                            value={contactLastName}
                            onChangeText={(t) => {
                                setContactLastName(t);
                                setContactLastNameError('');
                            }}
                            error={contactLastNameError}
                        />
                    </View>
                </View>
                <View>
                    <InputField
                        placeholder={t('phoneNumber')}
                        value={contactCellPhone}
                        onChangeText={(t) => {
                            setContactCellPhone(t);
                            setContactCellPhoneError('');
                        }}
                        error={contactCellPhoneError}
                    />
                </View>
            </View>
        </CardContainer>
    );
}
