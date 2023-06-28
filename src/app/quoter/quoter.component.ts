import { Component } from '@angular/core';
import { ClientService } from "../services/clients"
import { ProductService } from "../services/products"
import { ServicesService } from "../services/services"
import { Client } from '../models/client';
import { Product } from '../models/product';
import { Service } from '../models/service';
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
  foundServices: Service[] = [];
  searchClient: string = "";
  showClientResults: boolean = false;
  showProductsResults: boolean = false;
  showServiceResults: boolean = false;
  selectedClient: Client = {} as Client;
  addedProducts: Product[] = [];
  addedServices: Service[] = [];
  total: number = 0;
  revenue: number = 0;
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

  serviceSearchForm = new FormGroup({
    searchService: new FormControl(''),
    selectedService: new FormControl('')
  });

  constructor(
    private clientService: ClientService,
    private productService: ProductService,
    private servicesService: ServicesService
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
    this.showClientResults = false;
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
    this.updateTotal();
    this.updateRevenue();
  }

  onProductSelected(event: any, product: Product){
    let newProducts = this.addedProducts.filter(item => item._id != product._id);
    this.addedProducts = newProducts;
    this.updateTotal();
    this.updateRevenue();
  }


  onSearchServices(){
    let serviceToSearch: any =  this.serviceSearchForm.value.searchService;
    console.log("Servicio a buscar: ", serviceToSearch)
    this.servicesService.searchServiceByName( serviceToSearch).subscribe(
      (data)=>{
        this.foundServices= data
        this.showServiceResults = true
        console.log("Servicios encontrados", this.foundServices)
      },
      (error)=>{
        console.error("Could not find product" + error);
      }
    )
  }

  onSelectService(){
    let service_id: any = this.serviceSearchForm.value.selectedService
    this.servicesService.getService(service_id).subscribe(
      (data)=>{
        this.showServiceResults = false;
        this.addedServices.push(data);
        this.updateTotal();
      this.updateRevenue();
      },
      (error)=>{
        console.error("Could not find the service" + error);
      }
    )

  }

  onServiceSelected(event: any, service: Service){
    let newServices = this.addedServices.filter(item => item._id != service._id);
    this.addedServices = newServices;
    this.updateTotal();
    this.updateRevenue();
  }

  updateTotal(){
    let service_total = 0
    this.addedServices.forEach(service =>{
      service_total += service.client_price;
    });
    let product_total = 0
    this.addedProducts.forEach(product =>{
      product_total += product.list_price

    });

    this.total = product_total + service_total;
  }
  updateRevenue(){
    let service_revenue = 0
    let current_revenue = 0
    this.addedServices.forEach(service =>{
      current_revenue = service.client_price -service.real_price;
      service_revenue += current_revenue;
    });

    let product_revenue = 0
    current_revenue = 0
    this.addedProducts.forEach(product =>{
      current_revenue = product.list_price -product.discount_price;
      product_revenue += current_revenue;
    });

    this.revenue = product_revenue + service_revenue;

  }
}
