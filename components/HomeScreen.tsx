import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { collection, getDocs, getFirestore, deleteDoc, doc } from 'firebase/firestore';
import { app } from '../config/firebase';
import LottieView from 'lottie-react-native';

export default function HomeScreen() {
  const [pendaftar, setPendaftar] = useState<any[]>([]);
  const db = getFirestore(app);

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 1000); // Refresh setiap 5 detik

    return () => clearInterval(interval); // Bersihkan interval saat unmount
  }, []);

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'pendaftaran'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPendaftar(data);
    } catch (error) {
      console.error('Gagal ambil data:', error);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Konfirmasi', 'Yakin ingin menghapus data ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'pendaftaran', id));
            fetchData();
          } catch (error) {
            console.error('Gagal hapus:', error);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}></Text>

      <Text style={styles.title}>Data Pendaftar</Text>

      {pendaftar.length === 0 ? (
        <View style={styles.lottieContainer}>
          <LottieView
            source={{
              uri: 'https://lottie.host/c77c777e-4818-46f9-be3c-d58ffec8f5d1/SLxpQvGULD.json',
            }}
            autoPlay
            loop
            style={{ width: 250, height: 250 }}
          />
          <Text style={styles.emptyText}>Belum ada pendaftar</Text>
        </View>
      ) : (
        pendaftar.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.name}>{item.nama}</Text>
            <Text style={styles.text}>NIK: {item.nik}</Text>
            <Text style={styles.text}>Email: {item.email}</Text>
            <Text style={styles.text}>HP: {item.noHp}</Text>
            <Text style={styles.text}>Alamat: {item.alamat}</Text>
            <Text style={styles.text}>TTL: {item.ttl}</Text>
            <Text style={styles.text}>Gender: {item.gender}</Text>
            <Text style={styles.text}>Jurusan: {item.jurusan}</Text>

            <View style={styles.imageRow}>
              <Image source={{ uri: item.ktpUrl }} style={styles.image} resizeMode="cover" />
              <Image source={{ uri: item.formalUrl }} style={styles.image} resizeMode="cover" />
            </View>

            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteText}>🗑 Hapus</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#003366',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#111',
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  image: {
    width: '48%',
    height: 120,
    borderRadius: 8,
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: 'black',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 150,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
