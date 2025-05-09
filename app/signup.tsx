import { Ionicons } from '@expo/vector-icons';
import { Amplify } from 'aws-amplify';
import { confirmSignUp, signUp } from 'aws-amplify/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native';

// Replace these with your actual Cognito configuration
const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_WSq529He2',
      userPoolClientId: '5950mo7fcq7rtvr7i95g69j0mt',
      region: 'us-east-2'
    }
  }
};

// Initialize Amplify
Amplify.configure(awsConfig);

export default function Signup() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  const formatPhoneNumber = (number: string) => {
    // Remove all non-numeric characters
    const cleaned = number.replace(/\D/g, '');
    // Format as +1XXXXXXXXXX
    return `+1${cleaned}`;
  };

  const handleSignup = async () => {
    try {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      if (password.length < 8) {
        Alert.alert('Error', 'Password must be at least 8 characters long');
        return;
      }

      if (phoneNumber.replace(/\D/g, '').length !== 10) {
        Alert.alert('Error', 'Please enter a valid 10-digit phone number');
        return;
      }

      setLoading(true);
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: formattedPhone,
        password,
        options: {
          userAttributes: {
            phone_number: formattedPhone
          },
          autoSignIn: false
        }
      });

      if (!isSignUpComplete) {
        setShowVerification(true);
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    try {
      setLoading(true);
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const { isSignUpComplete } = await confirmSignUp({
        username: formattedPhone,
        confirmationCode: verificationCode
      });

      if (isSignUpComplete) {
        Alert.alert(
          'Success',
          'Account verified successfully! You can now login.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/login'),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'An error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.container}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contentContainer}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>T</Text>
                </View>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join us today!</Text>
              </View>

              <View style={styles.formContainer}>
                {!showVerification ? (
                  <>
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

                    <View style={styles.inputContainer}>
                      <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#666"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                      />
                    </View>

                    <Pressable
                      style={[styles.signupButton, loading && styles.buttonDisabled]}
                      onPress={handleSignup}
                      disabled={loading}
                    >
                      <Text style={styles.signupButtonText}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                      </Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Text style={styles.verificationText}>
                      Enter the verification code sent to {phoneNumber}
                    </Text>
                    <View style={styles.inputContainer}>
                      <Ionicons name="key-outline" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter verification code"
                        placeholderTextColor="#666"
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        keyboardType="number-pad"
                        maxLength={6}
                      />
                    </View>

                    <Pressable
                      style={[styles.signupButton, loading && styles.buttonDisabled]}
                      onPress={handleVerification}
                      disabled={loading}
                    >
                      <Text style={styles.signupButtonText}>
                        {loading ? 'Verifying...' : 'Verify Code'}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={styles.resendButton}
                      onPress={handleSignup}
                      disabled={loading}
                    >
                      <Text style={styles.resendButtonText}>Resend Code</Text>
                    </Pressable>
                  </>
                )}

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <Pressable onPress={() => router.replace('/login')}>
                    <Text style={styles.loginLink}>Login</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    backgroundColor: '#fff',
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
  signupButton: {
    backgroundColor: '#4c669f',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#4c669f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  resendButtonText: {
    color: '#4c669f',
    fontSize: 16,
    fontWeight: '600',
  },
  verificationText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
}); 