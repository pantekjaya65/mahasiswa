import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../config/firebase';

export default function PendaftaranScreen() {
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [ttl, setTtl] = useState('');
  const [gender, setGender] = useState<'L' | 'P' | null>(null);
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [jurusan, setJurusan] = useState('');

  const [ktpImage, setKtpImage] = useState<string | null>(null);
  const [formalImage, setFormalImage] = useState<string | null>(null);
  const [ijazahFile, setIjazahFile] = useState<{ uri: string; name: string } | null>(null);
  const [raporFile, setRaporFile] = useState<{ uri: string; name: string } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const db = getFirestore(app);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Dibutuhkan', 'Akses galeri dibutuhkan untuk memilih gambar.');
      }
    })();
  }, []);

  const pickImage = async (setImage: (uri: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // yang lama tapi masih jalan
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const pickDocument = async (setFile: (file: { uri: string; name: string }) => void) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFile({ uri: file.uri, name: file.name });
      }
    } catch (error) {
      console.warn('Document picking error:', error);
    }
  };

  const handleSubmit = async () => {
    if (!nama || !nik || !ttl || !gender || !email || !noHp || !alamat || !jurusan) {
      Alert.alert('Error', 'Harap isi semua field yang wajib diisi');
      return;
    }

    if (!ktpImage || !formalImage || !ijazahFile || !raporFile) {
      Alert.alert('Error', 'Harap upload semua dokumen yang diperlukan');
      return;
    }

    setIsLoading(true);

    try {
      // Simpan URI lokal ke Firestore
      await addDoc(collection(db, 'pendaftaran'), {
        nama,
        nik,
        ttl,
        gender,
        email,
        noHp,
        alamat,
        jurusan,
        ktpUrl: ktpImage,
        formalUrl: formalImage,
        ijazahUrl: ijazahFile.uri,
        ijazahName: ijazahFile.name,
        raporUrl: raporFile.uri,
        raporName: raporFile.name,
        createdAt: new Date(),
      });

      Alert.alert('Sukses', 'Pendaftaran berhasil dikirim!');
      setNama('');
      setNik('');
      setTtl('');
      setGender(null);
      setEmail('');
      setNoHp('');
      setAlamat('');
      setJurusan('');
      setKtpImage(null);
      setFormalImage(null);
      setIjazahFile(null);
      setRaporFile(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mengirim pendaftaran');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}></Text>

        <Text style={styles.title}>Penerimaan Mahasiswa Baru</Text>
        <Text style={styles.subText}>
          Silakan isi formulir di bawah ini untuk mendaftar sebagai calon mahasiswa di Universitas ABC. Pastikan data yang Anda isi sudah benar.
        </Text>

        <TextInput placeholder="Nama Lengkap" style={styles.input} value={nama} onChangeText={setNama} placeholderTextColor="#bdbdbd" />
        <TextInput placeholder="NIK (No. KTP)" style={styles.input} value={nik} onChangeText={setNik} keyboardType="numeric" placeholderTextColor="#bdbdbd" />
        <TextInput placeholder="Tempat, Tanggal Lahir" style={styles.input} value={ttl} onChangeText={setTtl} placeholderTextColor="#bdbdbd" />

        <View style={styles.genderRow}>
          <TouchableOpacity style={styles.genderOption} onPress={() => setGender('L')}>
            <View style={[styles.radioCircle, gender === 'L' && styles.radioSelected]} />
            <Text style={styles.genderText}>Laki-laki</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.genderOption} onPress={() => setGender('P')}>
            <View style={[styles.radioCircle, gender === 'P' && styles.radioSelected]} />
            <Text style={styles.genderText}>Perempuan</Text>
          </TouchableOpacity>
        </View>

        <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" value={email} onChangeText={setEmail} placeholderTextColor="#bdbdbd" />
        <TextInput placeholder="No. Handphone" style={styles.input} keyboardType="phone-pad" value={noHp} onChangeText={setNoHp} placeholderTextColor="#bdbdbd" />
        <TextInput placeholder="Alamat Lengkap" style={styles.input} multiline value={alamat} onChangeText={setAlamat} placeholderTextColor="#bdbdbd" />
        <TextInput placeholder="Jurusan (contoh: Teknik Informatika)" style={styles.input} value={jurusan} onChangeText={setJurusan} placeholderTextColor="#bdbdbd" />

        <Text style={styles.uploadTitle}>Upload Dokumen</Text>

        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setKtpImage)}>
          <Text style={styles.uploadText}>{ktpImage ? '📷 Foto KTP Terpilih' : 'Upload Foto KTP'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setFormalImage)}>
          <Text style={styles.uploadText}>{formalImage ? '📷 Foto Formal Terpilih' : 'Upload Foto Formal'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument(setIjazahFile)}>
          <Text style={styles.uploadText}>{ijazahFile ? `📄 ${ijazahFile.name}` : 'Upload Ijazah'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument(setRaporFile)}>
          <Text style={styles.uploadText}>{raporFile ? `📄 ${raporFile.name}` : 'Upload Rapor'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Kirim Pendaftaran</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
      android: { elevation: 3 },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
    color: '#000',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: '#333',
  },
  genderText: {
    fontSize: 14,
  },
  uploadTitle: {
    fontWeight: 'bold',
    marginVertical: 12,
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: 'center',
  },
  uploadText: {
    color: 'white',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#003366',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
