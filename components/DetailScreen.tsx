import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailScreen({ route }: any) {
  const { kisah } = route.params;

  const handleAddToFavorites = async () => {
    try {
      const existing = await AsyncStorage.getItem('FAVORIT_KISAH'); // disamakan
      const parsed = existing ? JSON.parse(existing) : [];

      const alreadyExists = parsed.find((item: any) => item.id === kisah.id);
      if (alreadyExists) {
        Alert.alert('Sudah ada di favorit');
        return;
      }

      parsed.push(kisah);
      await AsyncStorage.setItem('FAVORIT_KISAH', JSON.stringify(parsed)); // disamakan
      Alert.alert('Ditambahkan ke favorit!');
    } catch (error) {
      console.error('Gagal simpan favorit', error);
      Alert.alert('Gagal menambahkan ke favorit');
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{kisah.judul_kisah}</Text>
      {/* <Text style={styles.kategori}>Kategori: {kisah.kategori}</Text> */}
      {kisah.url_gambar && (
        <Image source={{ uri: kisah.url_gambar }} style={styles.image} />
      )}
      <Text style={styles.content}>{kisah.isi_kisah}</Text>

      <TouchableOpacity style={styles.button} onPress={handleAddToFavorites}>
        <Text style={styles.buttonText}>❤️ Tambah Favorit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 80,
  },
  kategori: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
