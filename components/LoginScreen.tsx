import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  role: string;
  created_at: any;
}

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const db = getFirestore(app);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Peringatan', 'Username dan password harus diisi.');
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const users: User[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as User),
      }));

      const matchedUser = users.find(
        (user) => user.username === username && user.password === password
      );

      if (matchedUser) {
        Alert.alert('Login Berhasil', `Halo, ${matchedUser.username}!`);
        await AsyncStorage.setItem('user', JSON.stringify(matchedUser));
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Login Gagal', 'Username atau password salah.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat login.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://img.icons8.com/color/96/islam.png' }}
        style={styles.logo}
      />
      <Text style={styles.title}>Selamat Datang</Text>
      <Text style={styles.subtitle}>Masuk untuk melanjutkan</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Kata Sandi"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Masuk</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>
          Belum punya akun?{' '}
          <Text style={{ color: '#003366', fontWeight: 'bold' }}>Daftar</Text>
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
    marginBottom: 50,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#003366',
    width: '100%',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    marginTop: 12,
    color: '#555',
    fontSize: 14,
  },
});
