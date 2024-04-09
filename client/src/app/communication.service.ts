import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// tslint:disable-next-line:ordered-imports
import { of, Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { BirdSpecies } from "../../../common/tables/BirdSpecies";

@Injectable()
export class CommunicationService {
  private readonly BASE_URL: string = "http://localhost:3000/database";
  public constructor(private http: HttpClient) {}

  private _listners: any = new Subject<any>();

  public listen(): Observable<any> {
    return this._listners.asObservable();
  }

  public filter(filterBy: string): void {
    this._listners.next(filterBy);
  }

  public getHotels(): Observable<BirdSpecies[]> {
    return this.http
      .get<BirdSpecies[]>(this.BASE_URL + "/hotels")
      .pipe(catchError(this.handleError<BirdSpecies[]>("getHotels")));
  }

  public insertHotel(hotel: BirdSpecies): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + "/hotels/insert", hotel)
      .pipe(catchError(this.handleError<number>("insertHotel")));
  }

  public updateHotel(hotel: BirdSpecies): Observable<number> {
    return this.http
      .put<number>(this.BASE_URL + "/hotels/update", hotel)
      .pipe(catchError(this.handleError<number>("updateHotel")));
  }

  public deleteHotel(hotelNb: string): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + "/hotels/delete/" + hotelNb, {})
      .pipe(catchError(this.handleError<number>("deleteHotel")));
  }

  // public getHotelPKs(): Observable<HotelPK[]> {
  //   return this.http
  //     .get<HotelPK[]>(this.BASE_URL + "/hotels/hotelNb")
  //     .pipe(catchError(this.handleError<HotelPK[]>("getHotelPKs")));
  // }


  private handleError<T>(
    request: string,
    result?: T
  ): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
