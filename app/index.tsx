import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Home() {
  const [userPhone, setUserPhone] = useState<string | null>(null);

  useEffect(() => {
    // Get the current user's phone number
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUserPhone(currentUser?.username ?? null);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      console.log('Successfully signed out');
      // Force a navigation to login page
      router.replace('/login');
      // Clear any cached navigation state
      router.setParams({});
    } catch (error: any) {
      console.error('Logout error:', error);
      Alert.alert('Error', error?.message || 'An error occurred during logout');
    }
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.phoneText}>{userPhone}</Text>
        </View>

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4c669f',
    marginBottom: 10,
  },
  phoneText: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#4c669f',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 