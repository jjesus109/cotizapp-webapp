// src/app/users/users.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environment";


@Injectable({
  providedIn: "root",
})
export class UsersService {

  BASE_URL: string = environment.gatewayURL;
  
  constructor(private http: HttpClient) {}

  login(user: any): Observable<any> {
    let formData = new FormData();
    formData.append('username', user.username);
    formData.append('password', user.password);
    formData.append('grant_type', 'password')
    return this.http.post(this.BASE_URL + "/token", formData)
  }


}

