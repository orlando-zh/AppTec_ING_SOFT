export interface TrainerStats {
    badges: number;
    pokemon: number;
    wins: number;
}

export interface Trainer {
    id: string;
    name: string;
    avatarUrl: any;
    bio: string;
    stats: TrainerStats;
}

export interface AuthResponse {
    token: string;
    trainer: Trainer;
}

export interface LoginCredentials {
    trainerId: string;
    secretCode: string;
}