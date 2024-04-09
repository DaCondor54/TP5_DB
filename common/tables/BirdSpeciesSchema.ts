import { SpeciesStatus } from "./BirdSpecies";

export interface BirdSpeciesSchema {
    nomscientifique: string;
    nomcommun: string;
    statutspece: SpeciesStatus;
    nomscientifiquecomsommer: string;
}