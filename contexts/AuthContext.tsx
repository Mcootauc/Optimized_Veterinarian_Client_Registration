import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/app/Services/SupabaseService';
import { Session } from '@supabase/supabase-js';

type AuthContextType = {
    session: Session | null;
    isReady: boolean;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    isReady: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsReady(true);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ session, isReady }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
