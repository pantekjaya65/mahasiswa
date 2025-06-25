import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  collection,
  getDocs,
  getFirestore,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import { app } from '../config/firebase';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [kisahList, setKisahList] = useState<any[]>([]);
  const [filteredKisah, setFilteredKisah] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [kategoriMap, setKategoriMap] = useState<{ [key: string]: string }>({});
  const [judulKisah, setJudulKisah] = useState('');
  const [isiKisah, setIsiKisah] = useState('');
  const [urlGambar, setUrlGambar] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const db = getFirestore(app);
  const navigation = useNavigation();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadUser();
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadUser = async () => {
    const jsonValue = await AsyncStorage.getItem('user');
    if (jsonValue) {
      setUser(JSON.parse(jsonValue));
    }
  };

  const fetchData = async () => {
    try {
      const kisahSnapshot = await getDocs(collection(db, 'kisahdb112'));
      const kategoriSnapshot = await getDocs(collection(db, 'kategori'));

      const kisahData = kisahSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const kategoriData: { [key: string]: string } = {};
      kategoriSnapshot.forEach((doc) => {
        kategoriData[doc.id] = doc.data().nama_kategori;
      });

      setKategoriMap(kategoriData);
      setKisahList(kisahData);
      filterData(searchQuery, kisahData);
    } catch (error) {
      console.error('Gagal ambil data:', error);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Konfirmasi', 'Yakin ingin menghapus kisah ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'kisahdb112', id));
            fetchData();
          } catch (error) {
            console.error('Gagal hapus:', error);
          }
        },
      },
    ]);
  };

  const filterData = (query: string, dataList = kisahList) => {
    const filtered = dataList.filter((item) =>
      item.judul_kisah?.toLowerCase().includes(query.toLowerCase()) ||
      item.kategori?.toLowerCase?.()?.includes(query.toLowerCase()) ||
      item.isi_kisah?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredKisah(filtered);
  };

  const handleSearch = () => {
    filterData(searchQuery);
  };

  const openEditModal = (kisah: any) => {
    setEditMode(true);
    setEditId(kisah.id);
    setJudulKisah(kisah.judul_kisah);
    setIsiKisah(kisah.isi_kisah);
    setUrlGambar(kisah.url_gambar || '');
    setSelectedKategori(kisah.kategori);
    setModalVisible(true);
  };

  const handleSaveKisah = async () => {
    if (!judulKisah || !isiKisah || !selectedKategori) {
      Alert.alert('Peringatan', 'Mohon isi semua field.');
      return;
    }

    try {
      if (editMode && editId) {
        await updateDoc(doc(db, 'kisahdb112', editId), {
          judul_kisah: judulKisah,
          isi_kisah: isiKisah,
          kategori: selectedKategori,
          url_gambar: urlGambar || null,
        });
        Alert.alert('Berhasil', 'Kisah berhasil diperbarui');
      } else {
        await addDoc(collection(db, 'kisahdb112'), {
          judul_kisah: judulKisah,
          isi_kisah: isiKisah,
          kategori: selectedKategori,
          url_gambar: urlGambar || null,
        });
        Alert.alert('Sukses', 'Kisah berhasil ditambahkan');
      }

      fetchData();
      closeModal();
    } catch (error) {
      console.error('Gagal simpan:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setJudulKisah('');
    setIsiKisah('');
    setUrlGambar('');
    setSelectedKategori('');
    setEditMode(false);
    setEditId(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Daftar Kisah</Text>

        {/* Search */}
        <View style={styles.searchCard}>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari kisah..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholderTextColor="#000"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Tambah Kisah */}
        {isAdmin && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Tambah Kisah Baru</Text>
          </TouchableOpacity>
        )}

        {/* Daftar Kisah */}
        {filteredKisah.length === 0 ? (
          <View style={styles.lottieContainer}>
            <LottieView
              source={{
                uri: 'https://lottie.host/c77c777e-4818-46f9-be3c-d58ffec8f5d1/SLxpQvGULD.json',
              }}
              autoPlay
              loop
              style={{ width: 250, height: 250 }}
            />
            <Text style={styles.emptyText}>Tidak ditemukan kisah yang sesuai</Text>
          </View>
        ) : (
          filteredKisah.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.name}>Judul: {item.judul_kisah}</Text>
              <Text style={styles.text}>
                Kategori: {kategoriMap[item.kategori?.toString()] || 'Tidak diketahui'}
              </Text>
              <Text style={styles.text}>
                Isi:{' '}
                {item.isi_kisah?.length > 100
                  ? item.isi_kisah.substring(0, 100) + '...'
                  : item.isi_kisah}
              </Text>

              {item.url_gambar && (
                <Image source={{ uri: item.url_gambar }} style={styles.image} />
              )}

              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => navigation.navigate('DetailScreen', { kisah: item })}
              >
                <Text style={styles.detailText}>📖 Baca Kisah</Text>
              </TouchableOpacity>

              {isAdmin && (
                <>
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() => openEditModal(item)}
                  >
                    <Text style={styles.detailText}>✏️ Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.deleteText}>🗑 Hapus</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal Tambah/Edit Kisah */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMode ? 'Edit Kisah' : 'Tambah Kisah Baru'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Judul Kisah"
                value={judulKisah}
                onChangeText={setJudulKisah}
                placeholderTextColor="#666"
              />
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Isi Kisah"
                value={isiKisah}
                onChangeText={setIsiKisah}
                multiline
                textAlignVertical="top"
                placeholderTextColor="#666"
              />
              <TextInput
                style={styles.input}
                placeholder="URL Gambar (opsional)"
                value={urlGambar}
                onChangeText={setUrlGambar}
                placeholderTextColor="#666"
              />

              <View style={styles.dropdown}>
                <Text style={styles.label}>Pilih Kategori:</Text>
                {Object.entries(kategoriMap).map(([id, name]) => (
                  <TouchableOpacity
                    key={id}
                    onPress={() => setSelectedKategori(id)}
                    style={[
                      styles.kategoriOption,
                      selectedKategori === id && styles.selectedOption,
                    ]}
                  >
                    <Text
                      style={{
                        color: selectedKategori === id ? '#fff' : '#000',
                      }}
                    >
                      {name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveKisah}>
                <Text style={styles.saveButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 20,
    textAlign: 'center',
    color: '#003366',
  },
  searchCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
    color: '#000',
  },
  searchButton: {
    backgroundColor: '#003366',
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#003366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
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
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#d90429',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailButton: {
    marginTop: 10,
    backgroundColor: '#003366',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  detailText: {
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 20,
    maxHeight: 400,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdown: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  kategoriOption: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#003366',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});