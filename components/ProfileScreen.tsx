import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user');
        if (jsonValue) {
          const parsed = JSON.parse(jsonValue);
          setUser(parsed);
        }
      } catch (error) {
        console.error('Gagal memuat user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Konfirmasi', 'Yakin ingin logout?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.removeItem('user');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={{
            uri: 'https://lottie.host/79017a82-0287-42ff-a051-2bacbaac099d/o8k596u5Eu.json',
          }}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text style={{ marginTop: 10, color: '#555' }}>Memuat Profil...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#555' }}>Tidak ada data pengguna</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri:
              user.avatarUrl ||
              'https://img.freepik.com/free-vector/woman-floral-traditional-costume_1308-176159.jpg?semt=ais_hybrid&w=740',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.username}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.text}>{user.email}</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.text}>{user.role}</Text>

        <Text style={styles.label}>Bergabung</Text>
        <Text style={styles.text}>
          {new Date(user.created_at?.seconds * 1000).toLocaleDateString()}
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>🔒 Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  avatar: {
    width: 90,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  text: {
    fontSize: 14,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
