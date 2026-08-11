import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@pokehunter:capturedPokemon";

export interface CapturedPokemon {
    id: number;
    latitude: number;
    longitude: number;
    capturedAt: string;
}

export async function getCapturedPokemon() {
    const storedPokemon = await AsyncStorage.getItem(STORAGE_KEY);

    if (!storedPokemon) {
        return [];
    }

    return JSON.parse(storedPokemon) as CapturedPokemon[];
}

export async function saveCapturedPokemon(id: number, latitude: number, longitude: number) {
    const storedPokemon = await getCapturedPokemon();

    const pokemonAlreadyCaptured = storedPokemon.some((pokemon) => pokemon.id === id);

    if (pokemonAlreadyCaptured) {
        return;
    }

    storedPokemon.push({
        id,
        latitude,
        longitude,
        capturedAt: new Date().toDateString(),
    });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storedPokemon));
}

export async function clearCapturedPokemon() {
    await AsyncStorage.removeItem(STORAGE_KEY);
}