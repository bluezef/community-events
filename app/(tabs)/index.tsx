import { Link } from 'expo-router';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../src/config/firebase';
import { Evento } from '../../src/types';

export default function FeedScreen() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener en tiempo real
    const q = query(collection(db, 'eventos'), orderBy('fecha', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Evento[];
      setEventos(eventosData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <ActivityIndicator style={{flex: 1}} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <Link href={`/event/${item.id}`} asChild>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={styles.info}>📍 {item.ubicacion}</Text>
              <Text style={styles.info}>📅 {new Date(item.fecha).toLocaleDateString()}</Text>
              <Text style={styles.asistentes}>👥 {item.asistentes?.length || 0} asistentes</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f0f2f5' },
  card: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  info: { color: '#666', marginBottom: 2 },
  asistentes: { marginTop: 5, fontWeight: 'bold', color: '#007AFF' }
});