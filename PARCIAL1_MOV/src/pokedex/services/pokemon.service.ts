import { Pokemon } from "../models/pokemon.model";

// Datos hardcodeados (Mock)
const MOCK_POKEMONS: Pokemon[] = [
    { id: '1', name: 'Pikachu', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
    { id: '2', name: 'Charizard', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' },
    { id: '3', name: 'Squirtle', imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' },
];

export const pokemonService = {
    getPokemons: async (): Promise<Pokemon[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_POKEMONS);
            }, 500);
        });
    }
};