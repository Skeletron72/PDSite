import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            handleUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // Listen for changes on auth state (sign in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            handleUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleUser = async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
            // Check admin status
            setIsAdmin(currentUser.email === import.meta.env.VITE_ADMIN_EMAIL);

            // Fetch profile
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentUser.id)
                .single();
            setProfile(data);
        } else {
            setProfile(null);
            setIsAdmin(false);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, isAdmin, signOut, refreshProfile: () => handleUser(user) }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
