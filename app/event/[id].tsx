import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../src/config/firebase';
import { Evento } from '../../src/types';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [loading, setLoading] = useState(true);
  
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!id) return;
    const eventoRef = doc(db, 'eventos', id as string);
    
    // 1. Obtener detalles del evento una sola vez
    getDoc(eventoRef).then(snap => {
      if (snap.exists()) {
        setEvento({ id: snap.id, ...snap.data() } as Evento);
      } else {
        Alert.alert("Error", "El evento no existe");
        router.back();
      }
      setLoading(false);
    });

    // 2. Escuchar comentarios en tiempo real
    const q = query(collection(eventoRef, 'comentarios'), orderBy('fecha', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setComentarios(snap.docs.map(d => d.data()));
    });
    return unsub;
  }, [id]);

  // --- Funcionalidad RSVP ---
  const handleRSVP = async () => {
    if (!evento || !userId) return;
    const eventoRef = doc(db, 'eventos', id as string);
    const asistiendo = evento.asistentes.includes(userId);

    try {
      if (asistiendo) {
        await updateDoc(eventoRef, { asistentes: arrayRemove(userId) });
        setEvento({ ...evento, asistentes: evento.asistentes.filter(uid => uid !== userId) });
      } else {
        await updateDoc(eventoRef, { asistentes: arrayUnion(userId) });
        setEvento({ ...evento, asistentes: [...evento.asistentes, userId] });
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo actualizar asistencia");
    }
  };

  // --- Funcionalidad Comentarios ---
  const enviarComentario = async () => {
    if (!nuevoComentario.trim()) return;
    try {
      await addDoc(collection(db, 'eventos', id as string, 'comentarios'), {
        texto: nuevoComentario,
        autor: auth.currentUser?.email,
        fecha: new Date().toISOString()
      });
      setNuevoComentario('');
    } catch (e) {
      Alert.alert("Error", "No se pudo enviar comentario");
    }
  };

  // --- Funcionalidad COMPARTIR (Nuevo) ---
  const onShare = async () => {
    try {
      await Share.share({
        message: `¡Hola! Te invito al evento "${evento?.titulo}" en ${evento?.ubicacion}. 📅 Fecha: ${new Date(evento?.fecha || '').toLocaleDateString()}`,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  // --- Funcionalidad ELIMINAR (Nuevo) ---
  const handleDelete = async () => {
    Alert.alert(
      "Eliminar Evento",
      "¿Estás seguro? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'eventos', id as string));
              Alert.alert("Eliminado", "El evento ha sido eliminado.");
              router.replace('/(tabs)');
            } catch (e) {
              Alert.alert("Error", "No tienes permisos o hubo un error.");
            }
          }
        }
      ]
    );
  };

  if (loading || !evento) return <ActivityIndicator style={{flex: 1}} size="large" />;

  const asistiendo = evento.asistentes?.includes(userId || '');
  const esCreador = evento.creadorId === userId;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* Botón Compartir en la esquina superior derecha */}
        <TouchableOpacity onPress={onShare} style={styles.shareBtn}>
           <Ionicons name="share-social" size={24} color="#007AFF" />
        </TouchableOpacity>

        <Text style={styles.titulo}>{evento.titulo}</Text>
        <Text style={styles.subtitulo}>📍 {evento.ubicacion}</Text>
        <Text style={styles.subtitulo}>📅 {new Date(evento.fecha).toLocaleString()}</Text>
        <Text style={styles.descripcion}>{evento.descripcion}</Text>
        
        <View style={styles.actionButtons}>
          <Button 
            title={asistiendo ? "Cancelar Asistencia" : "Confirmar Asistencia"} 
            color={asistiendo ? "#FF3B30" : "#34C759"} 
            onPress={handleRSVP} 
          />
        </View>

        {/* Solo mostrar botón eliminar si es el creador */}
        {esCreador && (
          <View style={{ marginTop: 10 }}>
            <Button title="Eliminar Evento" color="#FF3B30" onPress={handleDelete} />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comentarios ({comentarios.length})</Text>
        <View style={styles.inputRow}>
          <TextInput 
            value={nuevoComentario} 
            onChangeText={setNuevoComentario} 
            placeholder="Escribe un comentario..." 
            style={styles.input} 
            multiline
          />
          <Button title="Enviar" onPress={enviarComentario} />
        </View>

        {comentarios.map((c, index) => (
          <View key={index} style={styles.comentario}>
            <Text style={styles.autor}>{c.autor}</Text>
            <Text style={styles.textoComentario}>{c.texto}</Text>
            <Text style={styles.fechaComentario}>{new Date(c.fecha).toLocaleDateString()}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, borderBottomWidth: 1, borderColor: '#eee' },
  shareBtn: { alignSelf: 'flex-end', marginBottom: 10 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  subtitulo: { fontSize: 16, color: '#666', marginVertical: 2 },
  descripcion: { fontSize: 16, marginVertical: 15, lineHeight: 24, color: '#444' },
  actionButtons: { marginVertical: 10 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  inputRow: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginRight: 10, backgroundColor: '#f9f9f9' },
  comentario: { padding: 15, backgroundColor: '#f0f2f5', borderRadius: 8, marginBottom: 10 },
  autor: { fontWeight: 'bold', fontSize: 13, color: '#007AFF', marginBottom: 4 },
  textoComentario: { fontSize: 15, color: '#333' },
  fechaComentario: { fontSize: 10, color: '#999', marginTop: 5, textAlign: 'right' }
});