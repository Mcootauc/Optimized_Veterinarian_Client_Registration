import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '@/app/Services/SupabaseService';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function AdminSetup() {
    const { session } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSignIn = async () => {
        if (!email || !password) {
            setErrorMsg('Email and password required');
            return;
        }
        setLoading(true);
        setErrorMsg('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (error) {
            setErrorMsg(error.message);
        } else {
            Alert.alert('Success', 'Device provisioned successfully', [
                { text: 'OK', onPress: () => router.replace('/') }
            ]);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kiosk Device Setup</Text>
            
            {session ? (
                <View style={styles.sessionBox}>
                    <Text style={styles.sessionText}>
                        Currently signed in as:{'\n'}
                        <Text style={{ fontWeight: 'bold' }}>{session.user.email}</Text>
                    </Text>
                    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                        <Text style={styles.signOutButtonText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Admin Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
                
                <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Provision Device</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    form: {
        width: '100%',
        maxWidth: 400,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        backgroundColor: Colors.darkBlue,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 15,
        textAlign: 'center',
    },
    sessionBox: {
        backgroundColor: '#f0f0f0',
        padding: 20,
        borderRadius: 8,
        marginBottom: 30,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    sessionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
    },
    signOutButton: {
        backgroundColor: '#d9534f',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    signOutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
