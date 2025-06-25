import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, addDoc, collection, getDocs } from 'firebase/firestore';
import { app } from '../config/firebase';

export default function AddKategoriScreen() {
  const [namaKategori, setNamaKategori] = useState('');
  const [kategoriList, setKategoriList] = useState<any[]>([]);
  const db = getFirestore(app);

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'kategori'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setKategoriList(data);
    } catch (error) {
      console.error('Gagal mengambil kategori:', error);
    }
  };

  const handleSubmit = async () => {
    if (!namaKategori.trim()) {
      Alert.alert('Peringatan', 'Nama kategori tidak boleh kosong');
      return;
    }

    try {
      await addDoc(collection(db, 'kategori'), {
        nama_kategori: namaKategori.trim(),
      });

      Alert.alert('Sukses', 'Kategori berhasil ditambahkan');
      setNamaKategori('');
      fetchKategori(); // refresh list setelah tambah
    } catch (error) {
      console.error('Gagal menambah kategori:', error);
      Alert.alert('Error', 'Gagal menambahkan kategori');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tambah Kategori Baru</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama kategori"
        value={namaKategori}
        onChangeText={setNamaKategori}
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Simpan</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Daftar Kategori</Text>
      {kategoriList.length === 0 ? (
        <Text style={styles.emptyText}>Belum ada kategori</Text>
      ) : (
        <FlatList
          data={kategoriList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.kategoriCard}>
              <Text style={styles.kategoriText}>{item.nama_kategori}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#003366',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#003366',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
  kategoriCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#003366',
  },
  kategoriText: {
    fontSize: 16,
    color: '#111',
  },
});
