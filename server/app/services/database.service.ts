import { injectable } from "inversify";
import * as pg from "pg";
import "reflect-metadata";
import { BirdSpecies } from "../../../common/tables/BirdSpecies";

const BIRD_SPECIES_DB_PATH = 'ornithologue_bd.especeoiseau';

@injectable()
export class DatabaseService {
  public connectionConfig: pg.ConnectionConfig = {
    user: "student",
    database: "student",
    password: "polymtl150$",
    port: 5432,
    host: "127.0.0.1",
    keepAlive: true,
  };

  public pool: pg.Pool = new pg.Pool(this.connectionConfig);

  public async getAllFromTable(tableName: string): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const res = await client.query(`SELECT * FROM ${tableName} ORDER BY nomscientifique DESC;`);
    client.release();
    return res;
  }

  public async createBirdSpecies(bird: BirdSpecies): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const { scientificName, commonName, speciesStatus, scientificNameConsumed } = bird;
    if (!scientificName)
      throw new Error("Invalid create bird species values");
    const consumed = scientificNameConsumed == '' ? null : scientificNameConsumed;
    const values: (string | null)[] = [scientificName, commonName, speciesStatus, consumed];
    const queryText: string = `INSERT INTO ${BIRD_SPECIES_DB_PATH} VALUES($1, $2, $3, $4);`;

    const res = await client.query(queryText, values);
    client.release();
    return res;
  }

  public async filterBirdSpecies(
    scientificName: string,
    commonName: string,
    speciesStatus: string,
    scientificNameConsumed: string
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const searchTerms: string[] = [];
    if (scientificName.length > 0) searchTerms.push(`nomscientifique = '${scientificName}'`);
    if (commonName.length > 0) searchTerms.push(`nomcommun = '${commonName}'`);
    if (speciesStatus.length > 0) searchTerms.push(`statutspece = '${speciesStatus}'`);
    if (scientificNameConsumed.length > 0) searchTerms.push(`nomscientifiquecomsommer = '${scientificNameConsumed}'`);

    let queryText = `SELECT * FROM ${BIRD_SPECIES_DB_PATH}`;
    if (searchTerms.length > 0)
      queryText += " WHERE " + searchTerms.join(" AND ");
    queryText += ` ORDER BY ${BIRD_SPECIES_DB_PATH}.nomscientifique ASC `;
    queryText += ";";
    const res = await client.query(queryText);
    client.release();
    return res;
  }

  public async getBirdSpeciesByScientificName(): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const res = await client.query(`SELECT nomscientifique FROM ${BIRD_SPECIES_DB_PATH} ORDER BY nomscientifique DESC`);
    client.release();
    return res;
  }

  public async updateBirdSpecies(bird: BirdSpecies): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const { scientificName, commonName, speciesStatus, scientificNameConsumed } = bird;

    let toUpdateValues = [];

    if (commonName.length > 0) toUpdateValues.push(`nomcommun = '${commonName}'`);
    if (speciesStatus.length > 0) toUpdateValues.push(`statutspeces = '${speciesStatus}'`);
    if (scientificNameConsumed !== '') 
      toUpdateValues.push(`nomscientifiquecomsommer = '${scientificNameConsumed}'`);
    else
      toUpdateValues.push(`nomscientifiquecomsommer = null`);


    if (
      !scientificName ||
      toUpdateValues.length === 0
    )
      throw new Error("Invalid bird species update query");

    const query = `UPDATE ${BIRD_SPECIES_DB_PATH} SET ${toUpdateValues.join(
      ", "
    )} WHERE nomscientifique = '${scientificName}';`;
    const res = await client.query(query);
    client.release();
    return res;
  }

  public async deleteBirdSpeciesByScientificName(scientificName: string): Promise<pg.QueryResult> {
    if (scientificName.length === 0) throw new Error("Invalid delete query");

    const client = await this.pool.connect();
    let queries = `
      UPDATE ${BIRD_SPECIES_DB_PATH} SET nomscientifiquecomsommer = null WHERE nomscientifiquecomsommer = '${scientificName}';
      DELETE FROM ornithologue_bd.resider WHERE nomscientifique = '${scientificName}';
      DELETE FROM ornithologue_bd.observation WHERE nomscientifique = '${scientificName}';
      DELETE FROM ${BIRD_SPECIES_DB_PATH} CASCADE WHERE nomscientifique = '${scientificName}';
    `;
    const res = await client.query(queries);

    client.release();
    return res;
  }
}
