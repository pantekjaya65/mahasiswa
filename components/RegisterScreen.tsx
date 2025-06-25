import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../config/firebase';

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const db = getFirestore(app);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Peringatan', 'Semua field harus diisi!');
      return;
    }

    try {
      await addDoc(collection(db, 'users'), {
        username: username.trim(),
        email: email.trim(),
        password: password, // tidak dienkripsi
        role: 'user',
        created_at: new Date(),
      });

      Alert.alert('Sukses', 'Registrasi berhasil!');
      navigation.navigate('Login'); // arahkan ke LoginScreen
    } catch (error) {
      console.error('Error saat registrasi:', error);
      Alert.alert('Error', 'Gagal melakukan registrasi');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Akun</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Daftar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>
          Sudah punya akun?{' '}
          <Text style={{ color: '#003366', fontWeight: 'bold' }}>Masuk</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f9f9f9',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#eee',
    borderWidth: 1,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#003366',
    width: '100%',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    marginTop: 16,
    color: '#555',
    fontSize: 14,
  },
});