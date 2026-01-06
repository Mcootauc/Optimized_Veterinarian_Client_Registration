import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import {
    searchBreedsTop5,
    BreedSuggestion,
} from '../../app/Services/SupabaseService';

type Props = {
    placeholder: string;
    uiSpecies: string; // 'Dog' | 'Cat' | 'Other' | ''
    value: string; // your existing `breed`
    onChangeText: (text: string) => void; // your existing `setBreed`
    error?: string;
    onClearError?: () => void;
    editable?: boolean; // you already gate based on species; keep that logic
};

export default function BreedAutocompleteField({
    placeholder,
    uiSpecies,
    value,
    onChangeText,
    error,
    onClearError,
    editable = true,
}: Props) {
    const inputRef = useRef<TextInput>(null);
    const [focused, setFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<BreedSuggestion[]>([]);
    const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const requestIdRef = useRef(0);

    const canSuggest = useMemo(() => {
        return editable && (uiSpecies === 'Dog' || uiSpecies === 'Cat');
    }, [editable, uiSpecies]);

    // Clear suggestions if species changes or searching becomes invalid
    useEffect(() => {
        setSuggestions([]);
        setLoading(false);
    }, [uiSpecies, canSuggest]);

    // Debounced search driven by the current input value (free-text allowed)
    useEffect(() => {
        if (!canSuggest) return;

        const q = value.trim();
        if (q.length < 2) {
            setSuggestions([]);
            setLoading(false);
            return;
        }

        const myRequestId = ++requestIdRef.current;
        setLoading(true);

        const t = setTimeout(async () => {
            try {
                const res = await searchBreedsTop5({ uiSpecies, query: q });
                // ignore stale responses
                if (requestIdRef.current !== myRequestId) return;
                setSuggestions(res);
            } catch {
                // fail closed: no suggestions (don’t block typing)
                if (requestIdRef.current !== myRequestId) return;
                setSuggestions([]);
            } finally {
                if (requestIdRef.current === myRequestId) setLoading(false);
            }
        }, 250);

        return () => clearTimeout(t);
    }, [value, uiSpecies, canSuggest]);

    const showList = canSuggest && focused && suggestions.length > 0;

    return (
        <View style={styles.wrap}>
            <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                placeholder={placeholder}
                value={value}
                onChangeText={(text) => {
                    onChangeText(text);
                    onClearError?.();
                }}
                onFocus={() => {
                    if (blurTimerRef.current)
                        clearTimeout(blurTimerRef.current);
                    setFocused(true);
                }}
                onBlur={() => {
                    // Delay closing so taps on suggestions can register
                    blurTimerRef.current = setTimeout(
                        () => setFocused(false),
                        120
                    );
                }}
            />

            {loading && focused && canSuggest ? (
                <View style={styles.loadingDot}>
                    <ActivityIndicator size="small" color={Colors.gray} />
                </View>
            ) : null}

            {showList ? (
                <View style={styles.list}>
                    {suggestions.map((s) => (
                        <Pressable
                            key={s.value}
                            style={styles.row}
                            onPressIn={() => {
                                if (blurTimerRef.current)
                                    clearTimeout(blurTimerRef.current);
                            }}
                            onPress={() => {
                                onChangeText(s.value); // fill input
                                onClearError?.();
                                setSuggestions([]); // close list
                                inputRef.current?.focus();
                            }}
                        >
                            <Text style={styles.rowText}>{s.label}</Text>
                        </Pressable>
                    ))}
                </View>
            ) : null}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { position: 'relative' },

    input: {
        width: '100%',
        height: 35,
        borderColor: '#B8BDC6',
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 15,
        paddingLeft: 10,
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
    },
    inputError: { borderColor: Colors.red, borderWidth: 1 },

    loadingDot: { position: 'absolute', right: 10, top: 7 },

    list: {
        position: 'absolute',
        top: 36,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 6,
        zIndex: 1000,
        elevation: 10,
    },
    row: { paddingHorizontal: 10, paddingVertical: 6 },
    rowText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
        color: Colors.black,
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
