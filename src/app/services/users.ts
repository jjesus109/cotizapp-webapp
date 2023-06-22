// src/app/users/users.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(private http: HttpClient) {}

  login(user: any): Observable<any> {
    return this.http.post("https://0.0.0.0:5050/api/gateway/quoters", user);
  }
}

export interface UserRequest {
    email: string;
    password: string;
  }