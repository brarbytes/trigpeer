import { useWebSocket } from '@/contexts/WebSocketContext';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function OnlineStatus() {
  const { ws, reconnect } = useWebSocket();
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastMessageTime, setLastMessageTime] = useState<number>(Date.now());

  useEffect(() => {
    if (!ws) {
      setIsConnected(false);
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log('OnlineStatus received message:', data);
        
        if (data.type === 'onlineCount') {
          console.log('Updating online count to:', data.count);
          setOnlineCount(data.count);
          setLastMessageTime(Date.now());
        }
      } catch (error) {
        console.error('Error parsing WebSocket message in OnlineStatus:', error);
      }
    };

    const handleOpen = () => {
      console.log('WebSocket connected in OnlineStatus');
      setIsConnected(true);
      setLastMessageTime(Date.now());
    };

    const handleClose = () => {
      console.log('WebSocket disconnected in OnlineStatus');
      setIsConnected(false);
    };

    ws.addEventListener('message', handleMessage);
    ws.addEventListener('open', handleOpen);
    ws.addEventListener('close', handleClose);

    // Set initial connection state
    setIsConnected(ws.readyState === WebSocket.OPEN);

    return () => {
      ws.removeEventListener('message', handleMessage);
      ws.removeEventListener('open', handleOpen);
      ws.removeEventListener('close', handleClose);
    };
  }, [ws]);

  // Check for stale connection (no messages for 30 seconds)
  useEffect(() => {
    const checkStaleConnection = () => {
      const now = Date.now();
      const timeSinceLastMessage = now - lastMessageTime;
      
      if (isConnected && timeSinceLastMessage > 30000) {
        console.log('Connection appears stale, attempting to reconnect...');
        reconnect();
      }
    };

    const interval = setInterval(checkStaleConnection, 5000);
    return () => clearInterval(interval);
  }, [isConnected, lastMessageTime, reconnect]);

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: isConnected ? '#4CAF50' : '#f44336' }]} />
        <Text style={styles.statusText}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
      </View>
      <Text style={styles.countText}>
        {onlineCount} {onlineCount === 1 ? 'user' : 'users'} online
      </Text>
      {!isConnected && (
        <Pressable
          style={styles.reconnectButton}
          onPress={reconnect}
        >
          <Text style={styles.reconnectButtonText}>Reconnect</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
  },
  countText: {
    fontSize: 18,
    color: '#4c669f',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reconnectButton: {
    backgroundColor: '#4c669f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  reconnectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 