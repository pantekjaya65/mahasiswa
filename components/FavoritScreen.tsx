import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function FavoritScreen() {
  const [favoritList, setFavoritList] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;

  const fetchFavorites = async () => {
    try {
      setRefreshing(true);
      const jsonValue = await AsyncStorage.getItem('FAVORIT_KISAH');
      if (jsonValue !== null) {
        setFavoritList(JSON.parse(jsonValue));
      } else {
        setFavoritList([]);
      }
    } catch (e) {
      console.error('Gagal load data favorit:', e);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const handleRemove = async (id: string) => {
    Alert.alert('Konfirmasi', 'Hapus dari favorit?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedList = favoritList.filter((item) => item.id !== id);
            setFavoritList(updatedList);
            await AsyncStorage.setItem('FAVORIT_KISAH', JSON.stringify(updatedList));
            fetchFavorites();
          } catch (e) {
            console.error('Gagal menghapus favorit:', e);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchFavorites}
          colors={['#003366']}
        />
      }
    >
      <Text style={styles.title}>Kisah Favorit</Text>

      {favoritList.length === 0 ? (
        <View style={styles.lottieContainer}>
          <LottieView
            source={{
              uri: 'https://lottie.host/c77c777e-4818-46f9-be3c-d58ffec8f5d1/SLxpQvGULD.json',
            }}
            autoPlay
            loop
            style={{ width: 250, height: 250 }}
          />
          <Text style={styles.emptyText}>Belum ada kisah favorit</Text>
        </View>
      ) : (
        <View style={styles.gridContainer}>
          {favoritList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate('DetailScreen', { kisah: item })}
            >
              {item.url_gambar && (
                <Image source={{ uri: item.url_gambar }} style={styles.image} />
              )}
              <Text style={styles.name} numberOfLines={1}>
                {item.judul_kisah}
              </Text>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleRemove(item.id);
                }}
              >
                <Text style={styles.deleteIcon}>×</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    marginTop: 50,
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#003366',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    elevation: 2,
    width: '48%',
    position: 'relative',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    color: '#111',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#d90429',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  deleteIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});