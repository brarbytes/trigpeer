import TabView from '@/components/TabView';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

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
    <View style={styles.container}>
      <TabView onLogout={handleLogout} username={user} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
}); 