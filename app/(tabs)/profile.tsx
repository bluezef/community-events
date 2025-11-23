import { signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../../src/config/firebase';
import { Evento } from '../../src/types';

export default function ProfileScreen() {
  const [misEventos, setMisEventos] = useState<Evento[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    // Buscar eventos donde soy creador O asistente (simplificado aquí a Creador para el ejemplo)
    const fetchHistory = async () => {
      const q = query(collection(db, 'eventos'), where('creadorId', '==', user.uid));
      const snap = await getDocs(q);
      setMisEventos(snap.docs.map(d => ({ id: d.id, ...d.data() } as Evento)));
    };
    fetchHistory();
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.email}>{user?.email}</Text>
        <Button title="Cerrar Sesión" color="red" onPress={() => signOut(auth)} />
      </View>

      <Text style={styles.sectionTitle}>Mis Eventos Creados</Text>
      <FlatList
        data={misEventos}
        keyExtractor={item => item.id!}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.titulo}</Text>
            <Text>Asistentes: {item.asistentes?.length || 0}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No tienes eventos aún.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { marginBottom: 30, alignItems: 'center' },
  email: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  item: { padding: 15, backgroundColor: '#f0f0f0', marginBottom: 10, borderRadius: 8 },
  itemTitle: { fontWeight: 'bold' }
});