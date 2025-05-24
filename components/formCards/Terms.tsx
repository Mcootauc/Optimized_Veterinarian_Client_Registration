import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import Divider from '@/components/Divider';
import CardContainer from '@/components/cardContainer';

export default function Terms({
    initials,
    setInitials,
    initialsError,
    setInitialsError,
    width,
    hasError,
}: {
    initials: string;
    setInitials: (text: string) => void;
    initialsError: string;
    setInitialsError: (text: string) => void;
    width: number;
    hasError: boolean;
}) {
    return (
        <CardContainer hasError={hasError} paddingBottom={0}>
            <View style={[styles.container, { width: width - 80 }]}>
                <Text style={styles.pageTitle}>Terms</Text>
                <Divider
                    color={Colors.darkBlue}
                    width={2}
                    orientation="horizontal"
                />
                <Text style={styles.terms}>
                    All fees are due and payable prior to the release of the
                    patient. Upon your request, we can provide you with a
                    written estimate of fees for any treatments, emergency care,
                    surgery, or hospitalization services to be performed.
                </Text>
                <Text style={styles.terms}>
                    You understand and approve all necessary after-office-hours
                    veterinary services that may be performed on your pet in the
                    judgment of the veterinarian. You are also aware that the
                    continuous presence of veterinary personnel may not be
                    provided after office hours as this is not a 24-hour
                    facility.
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        initialsError ? styles.inputError : null,
                    ]}
                    placeholder="Enter your initials"
                    value={initials}
                    onChangeText={(text) => {
                        setInitials(text);
                        setInitialsError('');
                    }}
                />
                {initialsError ? (
                    <Text style={styles.errorText}>{initialsError}</Text>
                ) : null}
            </View>
        </CardContainer>
    );
}

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
    },
    input: {
        width: '100%',
        height: 35,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 0,
        paddingLeft: 10,
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
    },
    terms: {
        fontSize: 10,
        fontFamily: 'Inter_400Regular',
        paddingBottom: 10,
    },
    inputError: {
        borderColor: Colors.red,
        borderWidth: 1,
    },
    errorText: {
        color: Colors.red,
        fontSize: 8,
        marginTop: 5,
        marginLeft: 5,
        fontFamily: 'Inter_600SemiBold',
    },
});
