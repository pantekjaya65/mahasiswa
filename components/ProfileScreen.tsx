import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 detik

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={{ uri: 'https://lottie.host/79017a82-0287-42ff-a051-2bacbaac099d/o8k596u5Eu.json' }} // ganti dengan link Lottie animasi kamu
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text style={{ marginTop: 10, color: '#555' }}>Memuat Profil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://img.freepik.com/free-vector/woman-floral-traditional-costume_1308-176159.jpg?semt=ais_hybrid&w=740',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Atika</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.text}>atika@gmail.com</Text>

        <Text style={styles.label}>No. Handphone</Text>
        <Text style={styles.text}>+6281234567890</Text>

        <Text style={styles.label}>Alamat</Text>
        <Text style={styles.text}>Jl. Merdeka No. 10, Bandung</Text>

        <Text style={styles.label}>Bio</Text>
        <Text style={styles.bio}>
          Mahasiswa Teknik Informatika di Universitas ABC. Suka ngoding dan belajar hal baru.
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>✏️ Edit Profil</Text>
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
  bio: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
