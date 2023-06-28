import { Component } from '@angular/core';
import { ClientService } from "../services/clients"
import { ProductService } from "../services/products"
import { Client } from '../models/client';
import { Product } from '../models/product';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-quoter',
  templateUrl: './quoter.component.html',
  styleUrls: ['./quoter.component.css']
})
export class QuoterComponent {
  activeNewClient: boolean = true;
  foundClients: Client[] = [];
  foundProducts: Product[] = [];
  searchClient: string = "";
  showClientResults: boolean = false;
  showProductsResults: boolean = false;
  selectedClient: Client = {} as Client;
  addedProducts: Product[] = [];
  addedService: Service
  clientSearchForm = new FormGroup({
    searchClient: new FormControl(''),
    selectedClient: new FormControl('')
  });
  productSearchForm = new FormGroup({
    searchProduct: new FormControl(''),
    
  });
  clientCreateForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    location: new FormControl(''),
    phoneNumber: new FormControl('')
  });

  constructor(
    private clientService: ClientService,
    private productService: ProductService
  ){
  }

  ngOnInit(){
    this.activeNewClient = false;
  }

  activarClientModal(){
    this.activeNewClient = !this.activeNewClient;
  }

  activateProductModal(){
    this.showProductsResults = !this.showProductsResults;
  }

  onSearchClient(){
    let clientToSearch: any =  this.clientSearchForm.value.searchClient;
    console.log("Cliente a buscar: ", clientToSearch)
    this.clientService.searchClient( clientToSearch).subscribe(
      (data)=>{
        this.foundClients = data
        this.showClientResults = true;
      },
      (error)=>{
        console.error("Could not find clients" + error);
        this.showClientResults = false;
      }
    )
  }

  onShowClientDetails(){
    let client = this.foundClients.filter(client => client._id == this.clientSearchForm.value.selectedClient) ;
    this.selectedClient = client[0];
  }


  crearCliente(){
    let clientToCreate = {
      name: this.clientCreateForm.value.name,
      email: this.clientCreateForm.value.email,
      location: this.clientCreateForm.value.location,
      phone_number: this.clientCreateForm.value.phoneNumber,
    } as Client;
    this.clientService.createClient(clientToCreate).subscribe(
      (data)=>{
        console.log("Client created");
        this.selectedClient = clientToCreate;
        this.activarClientModal();
      },
      (error)=>{
        console.error("Client could not be created", error);
        this.activarClientModal();
      }
    )
    console.log("Cliente creado");
  }

  onSearchProducts(){
    let productToSearch: any =  this.productSearchForm.value.searchProduct;
    console.log("Producto a buscar: ", productToSearch)
    this.productService.searchProduct( productToSearch).subscribe(
      (data)=>{
        this.foundProducts = data
        this.showProductsResults = true;
        console.log("Productos encontrados", this.foundProducts)
      },
      (error)=>{
        console.error("Could not find product" + error);
        this.showClientResults = false;
      }
    )
  }
  addOnQuoter(event: any, product: Product){
    this.addedProducts.push(product);
    this.activateProductModal();
  }

  onSelected(event: any, product: Product){
    let newProducts = this.addedProducts.filter(item => item._id != product._id);
    this.addedProducts = newProducts;
  }
}
