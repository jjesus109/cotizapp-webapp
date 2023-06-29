import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environment";
import { QuoterId } from "../models/quoter"

@Injectable({
  providedIn: "root",
})
export class SalesService {

  BASE_URL: string = environment.gatewayURL;
  headers: any = {}

  constructor(private http: HttpClient) {
    let token = localStorage.getItem('token');
    this.headers =         {
        headers: { "Authorization": "Bearer " + token}
    }

  }

  createSale(quoter: QuoterId): Observable<any> {
    return this.http.post(
        this.BASE_URL + "/sales",
        quoter,
        this.headers
    )
  }

}