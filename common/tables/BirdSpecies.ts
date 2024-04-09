export enum SpeciesStatus {
    Vulnerable = 'Vulnérable',
    Unthreatened = 'Non menacée',
    MinorConcern = 'Préoccupation mineure',
}

export interface BirdSpecies {
    scientificName: string;
    commonName: string;
    speciesStatus: SpeciesStatus;
    scientificNameConsumed: string;
}