import React, { useEffect, useState } from 'react';
import { registerRootComponent } from 'expo';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, SafeAreaView } from 'react-native';

export default function App() {
  const [personagens, setPersonagens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Busca os primeiros 20 personagens da API pública
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={styles.textoCarregando}>Buscando na dimensão C-137...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Personagens</Text>
      <FlatList
        data={personagens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.imagem} />
            <View style={styles.info}>
              <Text style={styles.nome}>{item.name}</Text>
              <Text style={styles.especie}>{item.species} - {item.status}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

registerRootComponent(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e', // Fundo escuro espacial
    padding: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff00', // Verde portal
    textAlign: 'center',
    marginVertical: 15,
    marginTop: 30,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    alignItems: 'center',
  },
  imagem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  nome: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  especie: {
    color: '#aaa',
    fontSize: 14,
  },
  textoCarregando: {
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
});