import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environment";
import { Quoter } from "../models/quoter"

@Injectable({
  providedIn: "root",
})
export class QuoterService {

  BASE_URL: string = environment.gatewayURL;
  headers: any = {}

  constructor(private http: HttpClient) {
    let token = localStorage.getItem('token');
    this.headers =         {
        headers: { "Authorization": "Bearer " + token}
    }

  }

  createQuoter(quoter: Quoter): Observable<any> {
    return this.http.post(
        this.BASE_URL + "/quoters",
        quoter,
        this.headers
    )
  }

  updateQuoter(quoter_id: string, quoter: Quoter): Observable<any> {
    return this.http.patch(
        this.BASE_URL + "/quoters/" + quoter_id,
        quoter,
        this.headers
    )
  }
  getQuoter(quoter_id: string): Observable<any> {
    return this.http.get(
        this.BASE_URL + "/quoters/" + quoter_id,
        this.headers
    )
  }
  searchQuoter(word: string): Observable<any> {
      return this.http.get(
        this.BASE_URL + "/quoters?content=" + word,
        this.headers
    )
  }
}