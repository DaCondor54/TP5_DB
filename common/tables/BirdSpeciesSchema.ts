import { SpeciesStatus } from "./BirdSpecies";

export interface BirdSpeciesSchema {
    nomscientifique: string;
    nomcommun: string;
    statutspeces: SpeciesStatus;
    nomscientifiquecomsommer: string;
}