import { OnlineStatus } from '@/components/OnlineStatus';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [user, setUser] = useState<string>('');
  const { ws } = useWebSocket();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser.username);
      } catch (error) {
        console.error('Error getting current user:', error);
        router.replace('/login');
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      if (ws) {
        console.log('Closing WebSocket connection during logout...');
        console.log('WebSocket state before close:', {
          readyState: ws.readyState,
          url: ws.url,
          timestamp: new Date().toISOString()
        });
        
        ws.close();
        
        console.log('WebSocket closed during logout');
      }
      
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out');
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
          <Text style={styles.phoneText}>{user}</Text>
        </View>

        <OnlineStatus />

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
    marginTop: 20,
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