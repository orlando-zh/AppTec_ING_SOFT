import { useState, useEffect } from "react";
import { Pokemon } from "../models/pokemon.model";
import { pokemonService } from "../services/pokemon.service";
import { trainerService } from "../services/trainer.service";
import { Trainer } from "../../auth/models/auth.model";

export function usePokedex() {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [trainer, setTrainer] = useState<Trainer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [pokemonData, trainerData] = await Promise.all([
                pokemonService.getPokemons(),
                trainerService.getTrainerProfile()
            ]);

            setPokemons(pokemonData);
            setTrainer(trainerData);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        pokemons,
        trainer,
        isLoading,
    };
}