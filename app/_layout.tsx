import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, Session } from '@supabase/supabase-js';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

const EXPO_PUBLIC_SUPABASE_URL = 'https://ikgbpowjpuepywtloase.supabase.co';
const EXPO_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZ2Jwb3dqcHVlcHl3dGxvYXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Mzg0MzAsImV4cCI6MjA2MjMxNDQzMH0.wWGyZ8N6Z_zH6YXadfsXWfCce2hNGHeCcKCZeJTdePU';

const supabaseClient = createClient(EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state
    const initialize = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsReady(true);
      }
    };

    initialize();

    // Listen for auth state changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      // Handle navigation based on auth state
      const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup' || segments[0] === 'reset-password';
      
      if (!session && !inAuthGroup) {
        // Redirect to login if not authenticated
        router.replace('/login');
      } else if (session && inAuthGroup) {
        // Redirect to home if authenticated
        router.replace('/');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading state while initializing
  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#4c669f' }}>
        <StatusBar style="light" />
      </View>
    );
  }

  // Always render the Slot to ensure the current route is displayed
  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <StatusBar style="auto" />
    </View>
  );
}
