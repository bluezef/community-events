import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { auth, db } from '../../src/config/firebase';

export default function CreateEventScreen() {
  const [titulo, setTitulo] = useState('');
  const [desc, setDesc] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    if (!titulo || !desc || !ubicacion) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      await addDoc(collection(db, "eventos"), {
        titulo,
        descripcion: desc,
        ubicacion,
        fecha: new Date().toISOString(),
        creadorId: auth.currentUser?.uid,
        asistentes: []
      });
      Alert.alert("Éxito", "Evento creado");
      setTitulo(''); setDesc(''); setUbicacion('');
      router.push('/(tabs)'); // Regresar al inicio
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo crear el evento");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Título del evento" value={titulo} onChangeText={setTitulo} style={styles.input} />
      <TextInput placeholder="Descripción" value={desc} onChangeText={setDesc} style={styles.input} />
      <TextInput placeholder="Ubicación" value={ubicacion} onChangeText={setUbicacion} style={styles.input} />
      <Button title="Crear Evento" onPress={handleCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 }
});