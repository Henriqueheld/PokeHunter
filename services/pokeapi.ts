const API_URL = "https://pokeapi.co/api/v2/";

interface PokemonAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonAPIItem[];
}

interface PokemonAPIDetialsResponse {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string | null;
      };
    };
  };
}

interface PokemonAPIItem {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
}

export interface PokemonPage {
  pokemonList: Pokemon[];
  hasNextPage: boolean;
}

export async function getPokemonList(limit = 20, offset = 0) {
  const response = await fetch(
    `${API_URL}pokemon?limit=${limit}&offset=${offset}`,
  );

  if (!response.ok) {
    throw new Error("Não foi possivel carregar a lista de pokemons");
  }

  const data = (await response.json()) as PokemonAPIResponse;

  const pokemonList = data.results.map((pokemon) => {
    const id = parseInt(pokemon.url.split("/").filter(Boolean).pop() || "0");

    return {
      id,
      name: pokemon.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    };
  });

  return {
    pokemonList,
    hasNextPage: Boolean(data.next),
  } as PokemonPage;
}

export async function getPokemon(id: string) {
  const response = await fetch(`${API_URL}pokemon/${id}`);

  if (!response.ok) {
    throw new Error("Não foi possivel carregar o pokemon");
  }

  const data = (await response.json()) as PokemonAPIDetialsResponse;

  return {
    id: data.id,
    name: data.name,
    image: data.sprites.other["official-artwork"].front_default,
  } as Pokemon;
}
