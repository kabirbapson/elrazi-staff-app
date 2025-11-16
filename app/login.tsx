import { loginUser } from '@/utils/api/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import * as Yup from 'yup';

export default function AuthLogin() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePassword = () => setShowPassword((prev) => !prev);

    const handleLogin = async (values, { setSubmitting, setFieldError }) => {
        setLoading(true);

        try {
            const response = await loginUser(values);
            if (response?.data) {
                await SecureStore.setItemAsync('session', JSON.stringify(response.data));
                router.replace('/'); // navigate after login
            }
        } catch (err: any) {
            // Axios error handling
            if (err?.response) {
                // console.log(err.response.data)
                const message = err.response.data?.message || 'Invalid Credentials';
                setFieldError('submit', message);
            } else {
                setFieldError('submit', 'Network Error');
            }
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Login' }} />
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={Yup.object({
                    email: Yup.string().email('Invalid email').required('Required'),
                    password: Yup.string().required('Required'),
                })}
                onSubmit={handleLogin}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                    <View>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Password"
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={togglePassword}>
                                <MaterialIcons
                                    name={showPassword ? 'visibility' : 'visibility-off'}
                                    size={24}
                                    color="gray"
                                />
                            </TouchableOpacity>
                        </View>
                        {touched.password && errors.password && (
                            <Text style={styles.error}>{errors.password}</Text>
                        )}

                        {errors?.submit && <Text style={styles.error}>{errors?.submit}</Text>}

                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={isSubmitting || loading}
                            style={styles.button}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Login</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    label: { marginBottom: 5, fontWeight: 'bold' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    passwordWrapper: {
        position: 'relative',
        marginBottom: 10,
    },
    passwordInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        paddingRight: 40, // space for eye icon
        borderRadius: 5,
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -12 }],
    },
    error: { color: 'red', marginBottom: 10 },
    button: {
        backgroundColor: '#1976d2',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontWeight: 'bold' },
});
