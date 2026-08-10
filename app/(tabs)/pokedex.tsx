import CameraButton from '@/components/CameraButton';
import PokemonItem from '@/components/PokemonItem';
import { getPokemonList, Pokemon } from '@/services/pokeapi';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function PokedexScreen() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [offset, setOffset] = useState(0);

  const LIMIT = 20;

  async function loadPokemonList() {
    if (loading || !hasNextPage) {
      return;
    }

    setLoading(true);


    getPokemonList(LIMIT, offset)
    .then((response) => {
      setPokemonList((oldState) => [...oldState, ...response.pokemonList]);
      setHasNextPage(response.hasNextPage);
      setOffset((oldState) => oldState + response.pokemonList.length);
    })
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
  }



  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      <View style={styles.main}>

      <View style={styles.header}>
        <Text style={styles.title}>Pokedex</Text>
      </View>

      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <PokemonItem
            id={item.id}
            name={item.name}
            image={item.image}
            captured={false}
          />
        )}
        contentContainerStyle={styles.List}
        columnWrapperStyle={styles.row}
        ListFooterComponent={
          loading ? (<ActivityIndicator 
            size="small"
            color="red"
            style={styles.loading}
          />) : null
        }
        onEndReached={loadPokemonList}
        onEndReachedTheshold={0.5}
      />

        <CameraButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#1e1e1e',
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#941313',
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,

  },


  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ee7e7e',
    //neon text effect
    textShadowColor: '#fc2323',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },

  main: {
    height: "100%",
    backgroundColor: '#121212'
  },

  List: {
    padding: 16,
    paddingBottom: 90,
  },

  row: {
    gap: 16,
    marginBottom: 16,
  },

  loading: {

  }
  
});
