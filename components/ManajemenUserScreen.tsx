// components/ManajemenUserScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { app } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function ManajemenUserScreen() {
  const db = getFirestore(app);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, 'users'));
    const userData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(userData);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Konfirmasi', 'Yakin ingin menghapus pengguna ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'users', id));
          fetchUsers();
        },
      },
    ]);
  };

  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setNewPassword(user.password || '');
    setModalVisible(true);
  };

  const handleSavePassword = async () => {
    await updateDoc(doc(db, 'users', selectedUser.id), { password: newPassword });
    Alert.alert('Sukses', 'Kata sandi berhasil diperbarui');
    setModalVisible(false);
    fetchUsers();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manajemen Pengguna</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.username}>👤 {item.username}</Text>
            <Text style={styles.info}>📧 {item.email}</Text>
            <Text style={styles.info}>🛡️ {item.role}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleOpenEdit(item)} style={styles.editBtn}>
                <Ionicons name="create" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Password baru"
              placeholderTextColor="#999"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={{ color: '#666' }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSavePassword} style={styles.saveBtn}>
                <Text style={{ color: '#fff' }}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F4F6',
    marginTop: 50
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#003366',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: '#d90429',
    padding: 8,
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  saveBtn: {
    padding: 10,
    backgroundColor: '#003366',
    borderRadius: 6,
  },
});
