import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { searchClients, ClientSearchResult } from '@/app/Services/SupabaseService';
import { useLanguage } from '@/contexts/LanguageContext';

type ClientSearchFieldProps = {
    selectedClient: ClientSearchResult | null;
    setSelectedClient: (client: ClientSearchResult | null) => void;
    clientError?: string;
    setClientError: (error: string) => void;
    width: number;
    dividerColor?: string;
};

export default function ClientSearchField({
    selectedClient,
    setSelectedClient,
    clientError,
    setClientError,
    width,
    dividerColor = Colors.steelBlue,
}: ClientSearchFieldProps) {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ClientSearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const data = await searchClients(query);
                setResults(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(() => {
            fetchClients();
        }, 300);

        return () => clearTimeout(debounce);
    }, [query]);

    if (selectedClient) {
        return (
            <View style={[styles.container, { width: width * 0.9, borderColor: dividerColor }]}>
                <Text style={styles.title}>{t('searchClient')}</Text>
                <View style={styles.selectedContainer}>
                    <View style={styles.selectedInfo}>
                        <Text style={styles.selectedName}>{selectedClient.owner_name}</Text>
                        {selectedClient.email && <Text style={styles.selectedDetails}>{selectedClient.email}</Text>}
                        {selectedClient.cell_phone && <Text style={styles.selectedDetails}>{selectedClient.cell_phone}</Text>}
                    </View>
                    <TouchableOpacity
                        style={styles.changeButton}
                        onPress={() => {
                            setSelectedClient(null);
                            setQuery('');
                        }}
                    >
                        <Text style={styles.changeButtonText}>{t('changeClient')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.divider, { backgroundColor: dividerColor }]} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { width: width * 0.9, borderColor: dividerColor }]}>
            <Text style={styles.title}>{t('searchClient')}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, clientError ? styles.inputError : null]}
                    value={query}
                    onChangeText={(text) => {
                        setQuery(text);
                        if (clientError) setClientError('');
                    }}
                    placeholder={t('searchClientPrompt')}
                    placeholderTextColor="gray"
                />
                {clientError ? <Text style={styles.errorText}>{clientError}</Text> : null}
            </View>
            
            {loading && <ActivityIndicator size="small" color={Colors.darkBlue} style={styles.loader} />}

            {!loading && query.trim().length >= 2 && results.length === 0 && (
                <Text style={styles.noResultsText}>{t('noClientsFound')}</Text>
            )}

            {!loading && results.length > 0 && (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.resultItem}
                            onPress={() => {
                                setSelectedClient(item);
                                if (clientError) setClientError('');
                            }}
                        >
                            <Text style={styles.resultName}>{item.owner_name}</Text>
                            <Text style={styles.resultDetails}>
                                {[item.email, item.cell_phone].filter(Boolean).join(' • ')}
                            </Text>
                        </TouchableOpacity>
                    )}
                    style={styles.list}
                />
            )}
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 27,
        fontFamily: 'Inter_400Regular',
        color: Colors.black,
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 70,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft: 25,
        fontFamily: 'Inter_400Regular',
        fontSize: 22,
        backgroundColor: Colors.white,
    },
    inputError: {
        borderColor: Colors.red,
    },
    errorText: {
        color: Colors.red,
        fontSize: 20,
        marginTop: 5,
        marginLeft: 10,
        fontFamily: 'Inter_600SemiBold',
    },
    loader: {
        marginVertical: 10,
    },
    list: {
        maxHeight: 250,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 12,
        marginTop: 5,
    },
    resultItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },
    resultName: {
        fontSize: 20,
        fontFamily: 'Inter_600SemiBold',
    },
    resultDetails: {
        fontSize: 16,
        color: 'gray',
        fontFamily: 'Inter_400Regular',
        marginTop: 4,
    },
    noResultsText: {
        fontSize: 18,
        color: 'gray',
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        padding: 15,
    },
    selectedContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f0f8ff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.steelBlue,
    },
    selectedInfo: {
        flex: 1,
    },
    selectedName: {
        fontSize: 22,
        fontFamily: 'Inter_700Bold',
        marginBottom: 4,
    },
    selectedDetails: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        color: '#555',
    },
    changeButton: {
        backgroundColor: Colors.steelBlue,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },
    changeButtonText: {
        color: Colors.white,
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
    },
    divider: {
        height: 2,
        marginTop: 20,
        width: '100%',
    },
});
