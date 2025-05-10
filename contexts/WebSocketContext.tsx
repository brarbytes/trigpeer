import { fetchAuthSession } from 'aws-amplify/auth';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface WebSocketContextType {
  ws: WebSocket | null;
  reconnect: () => Promise<void>;
}

const WebSocketContext = createContext<WebSocketContextType>({ 
  ws: null,
  reconnect: async () => {}
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWebSocket = useCallback(async () => {
    if (isConnecting) {
      console.log('Already attempting to connect...');
      return;
    }

    setIsConnecting(true);
    let websocket: WebSocket | null = null;

    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      
      if (!idToken) {
        console.error('No ID token available for WebSocket connection');
        return;
      }

      const wsUrl = `ws://ec2-3-144-90-91.us-east-2.compute.amazonaws.com:3000/ws?token=${idToken}`;
      console.log('Connecting to WebSocket:', wsUrl);
      
      websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        console.log('WebSocket connected in context');
        setWs(websocket);
        setIsConnecting(false);
      };

      websocket.onclose = (event) => {
        console.log('WebSocket disconnected in context:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        setWs(null);
        setIsConnecting(false);

        // Attempt to reconnect if the connection was lost
        if (!event.wasClean) {
          console.log('Connection was not clean, attempting to reconnect...');
          setTimeout(() => {
            connectWebSocket();
          }, 3000); // Wait 3 seconds before reconnecting
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error in context:', error);
        setIsConnecting(false);
      };

    } catch (error) {
      console.error('Error setting up WebSocket in context:', error);
      setIsConnecting(false);
    }
  }, [isConnecting]);

  // Initial connection
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws) {
        console.log('Cleaning up WebSocket connection in context');
        ws.close();
      }
    };
  }, []);

  // Manual reconnection function
  const reconnect = useCallback(async () => {
    console.log('Manual reconnection requested');
    if (ws) {
      ws.close();
    }
    await connectWebSocket();
  }, [ws, connectWebSocket]);

  return (
    <WebSocketContext.Provider value={{ ws, reconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
} 