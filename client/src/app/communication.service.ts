import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { BirdSpecies } from "../../../common/tables/BirdSpecies";

@Injectable()
export class CommunicationService {
  private readonly BASE_URL: string = "http://localhost:3000/database";
  public constructor(private http: HttpClient) {}

  private listeners$: Subject<string> = new Subject<string>();

  public listen(): Observable<string> {
    return this.listeners$.asObservable();
  }

  public filter(filterBy: string): void {
    this.listeners$.next(filterBy);
  }

  public getBirds(): Observable<BirdSpecies[]> {
    return this.http
      .get<BirdSpecies[]>(this.BASE_URL + "/birdspecies")
      .pipe(catchError(this.handleError<BirdSpecies[]>("getBirds")));
  }

  public insertBird(bird: BirdSpecies): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + "/birdspecies", bird)
      .pipe(catchError((res) => {
        throw new Error(res.error.message);
      }));
  }

  public updateBird(bird: BirdSpecies): Observable<number> {
    return this.http
      .put<number>(this.BASE_URL + "/birdspecies/" + bird.scientificName, bird)
      .pipe(catchError(this.handleError<number>("updateBird")));
  }

  public deleteBird(scientificName: string): Observable<number> {
    return this.http
      .delete<number>(this.BASE_URL + "/birdspecies/" + scientificName, {})
      .pipe(catchError(this.handleError<number>("deleteBird")));
  }

  private handleError<T>(
    request: string,
    result?: T
  ): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
