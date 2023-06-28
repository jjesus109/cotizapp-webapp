import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environment";
import { Product } from "../models/product"

@Injectable({
  providedIn: "root",
})
export class ProductService {

  BASE_URL: string = environment.gatewayURL;
  headers: any = {}

  constructor(private http: HttpClient) {
    let token = localStorage.getItem('token');
    this.headers =         {
        headers: { "Authorization": "Bearer " + token}
    }

  }

  searchProduct(product_to_search: string): Observable<any> {
    return this.http.get(
        this.BASE_URL + "/products?product_name=" + product_to_search,
        this.headers
    )
  }

  createProduct(product: Product): Observable<any> {
    return this.http.post(
        this.BASE_URL + "/products",
        product,
        this.headers
    )
  }


}

