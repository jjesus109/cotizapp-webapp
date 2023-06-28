// src/app/users/users.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environment";
import { Service } from "../models/service"

@Injectable({
  providedIn: "root",
})
export class ServicesService {

  BASE_URL: string = environment.gatewayURL;
  headers: any = {}

  constructor(private http: HttpClient) {
    let token = localStorage.getItem('token');
    this.headers =         {
        headers: { "Authorization": "Bearer " + token}
    }

  }

  searchServiceByName(word: string): Observable<any> {
    return this.http.get(
        this.BASE_URL + "/services?service_name=" + word,
        this.headers
    )
  }

  getService(id: string): Observable<any> {
    return this.http.get(
        this.BASE_URL + "/services/" + id,
        this.headers
    )
  }

  searchServiceByDescription(word: string): Observable<any> {
    return this.http.get(
        this.BASE_URL + "/services?service_description=" + word,
        this.headers
    )
  }

  createProduct(service: Service): Observable<any> {
    return this.http.post(
        this.BASE_URL + "/services",
        service,
        this.headers
    )
  }


}

