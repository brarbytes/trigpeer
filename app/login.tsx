import { Ionicons } from '@expo/vector-icons';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession, getCurrentUser, signIn, signInWithRedirect, signOut } from 'aws-amplify/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

// AWS Cognito configuration
const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_WSq529He2',
      userPoolClientId: '5950mo7fcq7rtvr7i95g69j0mt',
      region: 'us-east-2',
      loginWith: {
        phone: true,
        email: false
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        phone_number: {
          required: true
        }
      }
    }
  }
};

// Initialize Amplify with error handling
try {
  Amplify.configure(awsConfig);
  console.log('Amplify configured successfully');
} catch (error) {
  console.error('Error configuring Amplify:', error);
}

const { width } = Dimensions.get('window');

// WebSocket connection function
const connectWebSocket = async () => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    
    if (!idToken) {
      throw new Error('No ID token available');
    }

    console.log('Attempting WebSocket connection...');
    const wsUrl = `ws://ec2-3-144-90-91.us-east-2.compute.amazonaws.com:3000/ws?token=${idToken}`;
    console.log('WebSocket URL:', wsUrl);
    
    const ws = new WebSocket(wsUrl);

    // Add connection timeout
    const connectionTimeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        console.log('WebSocket connection timeout. Current state:', ws.readyState);
        ws.close();
      }
    }, 10000);

    ws.onopen = () => {
      console.log('WebSocket Connected Successfully');
      clearTimeout(connectionTimeout);
    };

    ws.onclose = (event) => {
      console.log('WebSocket Disconnected:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        readyState: ws.readyState,
        timestamp: new Date().toISOString()
      });
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      console.log('WebSocket Details:', {
        state: ws.readyState,
        url: ws.url,
        protocol: ws.protocol,
        extensions: ws.extensions,
        timestamp: new Date().toISOString()
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket Message Received:', {
          type: data.type,
          count: data.count,
          rawData: event.data,
          timestamp: new Date().toISOString()
        });
        
        // Handle different message types
        switch (data.type) {
          case 'onlineCount':
            console.log('Processing online count update:', {
              count: data.count,
              timestamp: new Date().toISOString()
            });
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.log('Error parsing WebSocket message:', {
          error: error,
          rawData: event.data,
          timestamp: new Date().toISOString()
        });
      }
    };

    return ws;
  } catch (error) {
    console.error('Error connecting to WebSocket:', error);
    throw error;
  }
};

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Verify Amplify configuration
    try {
      const config = Amplify.getConfig();
      console.log('Current Amplify config:', config);
      setIsConfigured(true);
    } catch (error) {
      console.error('Error verifying Amplify config:', error);
      setIsConfigured(false);
    }
  }, []);

  // Check for existing authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          console.log('User already authenticated, redirecting to home...');
          // Connect to WebSocket before redirecting
          try {
            const websocket = await connectWebSocket();
            setWs(websocket);
          } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
          }
          router.replace('/');
        }
      } catch (error) {
        // No user is signed in, stay on login page
        console.log('No authenticated user found');
      }
    };

    checkAuth();
  }, []);

  const handlePhoneLogin = async () => {
    try {
      if (!isConfigured) {
        Alert.alert('Error', 'Authentication service is not properly configured. Please try again later.');
        return;
      }

      if (!password) {
        Alert.alert('Error', 'Please enter your password');
        return;
      }

      setLoading(true);
      const formattedPhoneWithPrefix = `+1${phoneNumber}`;
      console.log('Login attempt details:', { 
        username: formattedPhoneWithPrefix,
        password
      });
   
      try {
        // Check if there's an existing session and sign out if there is
        try {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            await signOut();
            console.log('Signed out existing user');
          }
        } catch (error) {
          // Ignore error if no user is signed in
          console.log('No existing user session');
        }

        const { isSignedIn, nextStep } = await signIn({
          username: formattedPhoneWithPrefix,
          password,
          options: {
            authFlowType: 'USER_PASSWORD_AUTH'
          }
        });
   
        console.log('Sign in response:', { isSignedIn, nextStep });
   
        if (isSignedIn) {
          console.log('Login successful. Connecting to WebSocket...');
          try {
            const websocket = await connectWebSocket();
            setWs(websocket);
            console.log('WebSocket connected successfully');
            router.replace({
              pathname: '/',
              params: { ws: websocket }
            });
          } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
            Alert.alert('Warning', 'Login successful but failed to connect to real-time service');
            router.replace('/');
          }
        } else if (nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
          Alert.alert(
            'Verification Required',
            'Please enter the verification code sent to your phone.',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/signup'),
              },
            ]
          );
        } else if (nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
          Alert.alert(
            'Account Not Verified',
            'Please verify your account first. Check your phone for the verification code.',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/signup'),
              },
            ]
          );
        } else if (nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          Alert.alert(
            'Password Change Required',
            'You need to set a new password.',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/reset-password'),
              },
            ]
          );
        }
      } catch (error: any) {
        console.error('Login error details:', {
          name: error.name,
          message: error.message,
          code: error.code,
          stack: error.stack,
          error: error
        });
        Alert.alert('Error', 'Invalid phone number or password');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'Google' | 'Apple') => {
    try {
      setLoading(true);
      await signInWithRedirect({
        provider,
        customState: JSON.stringify({ redirectUrl: 'trigpeer://' })
      });
    } catch (error: any) {
      console.error('Social login error:', error);
      Alert.alert('Error', error?.message || 'An error occurred during social login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>T</Text>
          </View>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number (10 digits)"
              placeholderTextColor="#666"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Pressable
            style={styles.forgotPasswordContainer}
            onPress={() => router.replace('/reset-password')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>

          <Pressable
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handlePhoneLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </Pressable>

          {/* Temporarily hiding social login buttons */}
          {/* <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <Pressable
              style={[styles.socialButton, styles.googleButton]}
              onPress={() => handleSocialLogin('Google')}
            >
              <Ionicons name="logo-google" size={24} color="#fff" />
              <Text style={styles.socialButtonText}>Google</Text>
            </Pressable>

            <Pressable
              style={[styles.socialButton, styles.appleButton]}
              onPress={() => handleSocialLogin('Apple')}
            >
              <Ionicons name="logo-apple" size={24} color="#fff" />
              <Text style={styles.socialButtonText}>Apple</Text>
            </Pressable>
          </View> */}

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Pressable onPress={() => router.replace('/signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
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
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4c669f',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#4c669f',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#666',
    fontSize: 16,
  },
  signupLink: {
    color: '#4c669f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#4c669f',
    fontSize: 14,
    fontWeight: '600',
  },
}); 