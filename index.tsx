import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, Text, Card, Button, ActivityIndicator, Appbar, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- TELA 1: LISTA DE PERSONAGENS ---
function HomeScreen({ navigation }) {
  const [personagens, setPersonagens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('https://rickandmortyapi.com/api/character')
      .then((resposta) => resposta.json())
      .then((dados) => {
        setPersonagens(dados.results);
        setCarregando(false);
      })
      .catch((erro) => {
        console.error(erro);
        setCarregando(false);
      });
  }, []);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator animating={true} color="#00ff00" size="large" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Buscando na dimensão C-137...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ padding: 10, backgroundColor: '#1a1a2e' }}>
  <Text variant="headlineMedium" style={{ color: '#00ff00', textAlign: 'center', marginTop: 40 }}>
    Personagens
  </Text>
  <Button mode="contained" onPress={() => navigation.navigate('Favoritos')} style={{ marginTop: 10 }} buttonColor="#00ff00" textColor="#000">
    Ir para Favoritos
  </Button>
</View>
      <FlatList
        data={personagens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Image source={{ uri: item.image }} style={styles.imagem} />
              <View style={styles.info}>
                <Text variant="titleMedium" style={{ color: '#fff' }}>{item.name}</Text>
                <Text variant="bodyMedium" style={{ color: '#aaa' }}>{item.species} - {item.status}</Text>
              </View>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

// --- TELA 2: FAVORITOS (AsyncStorage) ---
function FavoritosScreen({ navigation }) {
  const [favorito, setFavorito] = useState('');
  const [salvo, setSalvo] = useState('');

  // Carrega o que está salvo ao abrir a tela
  useEffect(() => {
    AsyncStorage.getItem('@favorito').then((valor) => {
      if (valor) setSalvo(valor);
    });
  }, []);

  const salvar = async () => {
    if (favorito.trim() === '') return;
    await AsyncStorage.setItem('@favorito', favorito);
    setSalvo(favorito);
    setFavorito('');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#1a1a2e' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#00ff00" />
        <Appbar.Content title="Favoritos" color="#00ff00" />
      </Appbar.Header>
      <View style={{ padding: 20 }}>
        <Text variant="titleLarge" style={{ color: '#fff', marginBottom: 10 }}>
          Personagem Favorito Salvo:
        </Text>
        <Text variant="bodyLarge" style={{ color: '#00ff00', marginBottom: 20 }}>
          {salvo || 'Nenhum salvo ainda.'}
        </Text>

        <Text variant="bodyMedium" style={{ color: '#aaa', marginBottom: 5 }}>
          Digite um nome para salvar:
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            mode="outlined"
            value={favorito}
            onChangeText={setFavorito}
            style={{ flex: 1, marginRight: 10, backgroundColor: '#fff' }}
          />
          <Button mode="contained" onPress={salvar} buttonColor="#00ff00" textColor="#000">
            Salvar
          </Button>
        </View>
      </View>
    </View>
  );
}

// --- CONFIGURAÇÃO DA NAVEGAÇÃO ---
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Favoritos" component={FavoritosScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  centro: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  card: { marginHorizontal: 10, marginBottom: 10, backgroundColor: '#16213e' },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  imagem: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  info: { flex: 1 },
});

import { registerRootComponent } from 'expo';
registerRootComponent(App);