import { Client } from "./client"
import { Service } from "./service"
import { Product } from "./product"


export interface Quoter{
    _id?: string;
    name: string;
    date: string;
    subtotal: number
    iva: number;
    total: number;
    percentage_in_advance_pay: number;
    revenue_percentage: number;
    first_pay: number;
    second_pay: number;
    description: string;
    client: Client;
    services?: Service[];
    products?: Product[];
}