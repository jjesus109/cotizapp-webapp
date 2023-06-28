import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environment";
import { Client} from "../models/client"

@Injectable({
  providedIn: "root",
})
export class ClientService {

  BASE_URL: string = environment.gatewayURL;
  headers: any = {}

  constructor(private http: HttpClient) {
    let token = localStorage.getItem('token');
    this.headers =         {
        headers: { "Authorization": "Bearer " + token}
    }
  }

  createClient(client: Client): Observable<any> {
    return this.http.post(
        this.BASE_URL + "/clients",
        client,
        this.headers 
    )
  }

  searchClient(client_to_search: string): Observable<any> {
    return this.http.get(
        this.BASE_URL + "/clients?word_to_search=" +client_to_search,
        this.headers
    )
  }

  getClient(client_id: string): Observable<any> {
    return this.http.get(
        this.BASE_URL + "/clients/" + client_id,
        this.headers
    )
  }

}

