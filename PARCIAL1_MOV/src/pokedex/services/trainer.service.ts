import { Trainer } from "../../auth/models/auth.model";


export const MOCK_TRAINER: Trainer = {
    id: "ASH-151",
    name: 'Ash Ketchum',
    avatarUrl: require('../../../assets/images/avatar/avatar.jpg'),
    bio: 'Pokémon Master in training. Pallet Town, Kanto Region.',
    stats: { badges: 8, pokemon: 151, wins: 342 }
};

export const trainerService = {
    getTrainerProfile: async (): Promise<Trainer> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_TRAINER);
            }, 500);
        });
    }
};