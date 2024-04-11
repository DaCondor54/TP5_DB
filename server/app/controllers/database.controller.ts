import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as pg from "pg";
import { BirdSpecies } from "../../../common/tables/BirdSpecies";
import { BirdSpeciesSchema } from "../../../common/tables/BirdSpeciesSchema";

import { DatabaseService } from "../services/database.service";
import Types from "../types";

@injectable()
export class DatabaseController {
  public constructor(
    @inject(Types.DatabaseService) private databaseService: DatabaseService
  ) {}

  public get router(): Router {
    const router: Router = Router();

    // ex http://localhost:3000/database/birdSpecies?nomscientifique=nom&nomcommun=nom&statut=nom&nomscientifiqueconsomme=nom
    router.get("/birdspecies", (req: Request, res: Response, _: NextFunction) => {
      const scientificName = req.params.scientificName ? req.params.scientificName : "";
      const commonName = req.params.commonName ? req.params.commonName : "";
      const speciesStatus = req.params.speciesStatus ? req.params.speciesStatus : "";
      const scientificNameConsumed = req.params.scientificNameConsumed ? req.params.scientificNameConsumed : "";

      this.databaseService
        .filterBirdSpecies(scientificName, commonName, speciesStatus, scientificNameConsumed)
        .then((result: pg.QueryResult) => {
          const birds: BirdSpecies[] = result.rows.map((bird: BirdSpeciesSchema) => ({
            scientificName: bird.nomscientifique,
            commonName: bird.nomcommun, 
            speciesStatus: bird.statutspeces,
            scientificNameConsumed: bird.nomscientifiquecomsommer,
          }));
          res.json(birds);
        })
        .catch((e: Error) => {
          console.error(e.stack);
        });
    });

    router.get(
      "/birdspecies/scientificName",
      (req: Request, res: Response, _: NextFunction) => {
        this.databaseService
          .getBirdSpeciesByScientificName()
          .then((result: pg.QueryResult) => {
            const scientificNames = result.rows.map((scientificName: string) => ({
              scientificName: scientificName
            }));
            res.json(scientificNames);
          })

          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    router.post(
      "/birdspecies",
      (req: Request, res: Response, _: NextFunction) => {
        const bird: BirdSpecies = {
          scientificName: req.body.scientificName,
          commonName: req.body.commonName,
          speciesStatus: req.body.speciesStatus,
          scientificNameConsumed: req.body.scientificNameConsumed,
        };
        this.databaseService
          .createBirdSpecies(bird)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
            res.json(-1);
          });
      }
    );

    router.delete(
      "/birdspecies/:scientificName",
      (req: Request, res: Response, _: NextFunction) => {
        const scientificName: string = req.params.scientificName;
        this.databaseService
          .deleteBirdSpeciesByScientificName(scientificName)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    router.put(
      "/birdspecies/:scientificName",
      (req: Request, res: Response, _: NextFunction) => {
        const bird: BirdSpecies = {
          scientificName: req.params.scientificName,
          commonName: req.body.commonName ? req.body.commonName : "",
          speciesStatus: req.body.speciesStatus ? req.body.speciesStatus : "",
          scientificNameConsumed: req.body.scientificNameConsumed ? req.body.scientificNameConsumed : "",
        };

        this.databaseService
          .updateBirdSpecies(bird)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );
    return router;
  }
}
