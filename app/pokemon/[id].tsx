import { getPokemon, Pokemon } from "@/services/pokeapi";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PokemonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      console.log(id);
      getPokemon(id).then((response) => setPokemon(response))
      .catch((error) => {
        console.error(error);
        setError(true);
      })
      .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="red" />

        <Text style={styles.loadingText}>Identificando o pokémon...</Text>
      </SafeAreaView>
    );
  }

  if (error || !pokemon) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <FontAwesome name="exclamation-circle" size={64} color="red" />

        <Text style={styles.errorText}>Pokémon não encontrado.</Text>
      <View style={styles.actions}>
        <Link href="/camera" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <FontAwesome name="camera" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Escanear novamente</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>
              Voltar à tela inicial
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.captureBadge}>
            <FontAwesome name="check" size={16} color="green" />
            <Text style={styles.captureBadgeText}>Pokémon capturado!</Text>
          </View>

          <Text style={styles.id}>#{String(pokemon.id).padStart(4, "0")}</Text>

          <View style={styles.imageContainer}>
            <View style={styles.imageGlow} />
            <Image
              source={{ uri: pokemon.image }}
              contentFit="contain"
              transition={300}
              style={styles.image}
            />
          </View>

          <Text style={styles.name}>{pokemon.name}</Text>
        </View>

        <View style={styles.actions}>
          <Link href="/camera" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <FontAwesome name="camera" size={20} color="white" />
              <Text style={styles.primaryButtonText}>Escanear novamente</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(tabs)" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                Voltar à tela inicial
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: "#121212",
  },
  loadingText: {
    marginTop: 16,
    color: "#a3a3a3",
    fontSize: 16,
  },
  errorText: {
    marginVertical: 22,
    color: "#a3a3a3",
    fontSize: 24,
    fontWeight: "bold",
  },
  primaryButton: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "red",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    backgroundColor: "#242424",
  },
  secondaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "semibold",
  },
  safeArea: {
    height: "100%",
    backgroundColor: "#121212",
  },
  container: {
    height: "100%",
    justifyContent: "space-between",
    padding: 24,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  captureBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#16a34a",
  },
  captureBadgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  id: {
    color: "#a3a3a3",
    fontSize: 18,
    fontWeight: "semibold",
    marginTop: 24,
  },
  imageContainer: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  imageGlow: {
    width: 230,
    height: 230,
    borderRadius: 115,
    position: "absolute",
    backgroundColor: "rgba(239,68,68,0.16)",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  name: {
    marginTop: 8,
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  actions: {
    gap: 12,
  },
});