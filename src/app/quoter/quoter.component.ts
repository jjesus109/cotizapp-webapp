import { Component } from '@angular/core';
import { ClientService } from "../services/clients"
import { ProductService } from "../services/products"
import { ServicesService } from "../services/services"
import { SalesService } from "../services/sales"
import { QuoterService } from "../services/quoters"
import { Client } from '../models/client';
import { Product } from '../models/product';
import { Service } from '../models/service';
import { Quoter } from '../models/quoter';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-quoter',
  templateUrl: './quoter.component.html',
  styleUrls: ['./quoter.component.css']
})
export class QuoterComponent {
  IVA = 0.16;
  percentage_in_advance_pay = 0.7;
  revenue_percentage = 0.8;
  activeNewClient: boolean = true;
  foundClients: Client[] = [];
  foundProducts: Product[] = [];
  foundServices: Service[] = [];
  foundQuoters: Quoter[] = [];  
  searchClient: string = "";
  showClientResults: boolean = false;
  showProductsResults: boolean = false;
  showServiceResults: boolean = false;
  showQuoterResults: boolean = false;
  selectedClient: Client = {} as Client;
  addedProducts: Product[] = [];
  addedServices: Service[] = [];
  currentQuoter: Quoter = {} as Quoter;
  currentQuoterId: string = "";
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

  quoterSearchForm = new FormGroup({
    searchQuoter: new FormControl(''),
    
  });

  constructor(
    private clientService: ClientService,
    private productService: ProductService,
    private servicesService: ServicesService,
    private quoterService: QuoterService,
    private salesService: SalesService
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
    this.currentQuoter.client = this.selectedClient;
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
        this.currentQuoter.client = this.selectedClient;
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
        console.error("Could not find product", error);
        this.showClientResults = false;
      }
    )
  }
  addOnQuoter(event: any, product: Product){
    this.addedProducts.push(product);
    this.currentQuoter.products = this.addedProducts;
    this.activateProductModal();
    this.updateTotal();
    this.updateRevenue();
  }

  onProductSelected(event: any, product: Product){
    let newProducts = this.addedProducts.filter(item => item._id != product._id);
    this.addedProducts = newProducts;
    this.currentQuoter.products = this.addedProducts;
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
        console.error("Could not find service", error);
      }
    )
  }

  onSelectService(){
    let service_id: any = this.serviceSearchForm.value.selectedService
    this.servicesService.getService(service_id).subscribe(
      (data)=>{
        this.showServiceResults = false;
        this.addedServices.push(data);
        this.currentQuoter.services = this.addedServices;
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
    this.currentQuoter.services = this.addedServices;
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
      product_total += product.list_price;

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

  obtenerFechaActual(): string {
    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();
    const hora = fecha.getHours();
    const minuto = fecha.getMinutes();
    const segundo = fecha.getSeconds();
  
    const diaFormateado = dia < 10 ? `0${dia}` : `${dia}`;
    const mesFormateado = mes < 10 ? `0${mes}` : `${mes}`;
    const horaFormateada = hora < 10 ? `0${hora}` : `${hora}`;
    const minutoFormateado = minuto < 10 ? `0${minuto}` : `${minuto}`;
    const segundoFormateado = segundo < 10 ? `0${segundo}` : `${segundo}`;
  
    return `${año}-${mesFormateado}-${diaFormateado} ${horaFormateada}:${minutoFormateado}:${segundoFormateado}`;
  };
  



  updateQuoter(){
    let iva = this.total * this.IVA;
    let total_plus_iva = this.total + iva;
    let first_pay = total_plus_iva * this.percentage_in_advance_pay;
    let second_pay =  total_plus_iva * (1-this.percentage_in_advance_pay);
    this.currentQuoter.date = this.obtenerFechaActual();
    this.currentQuoter.subtotal = this.total;
    this.currentQuoter.iva = iva;
    this.currentQuoter.total = total_plus_iva;
    this.currentQuoter.percentage_in_advance_pay = this.percentage_in_advance_pay;
    this.currentQuoter.revenue_percentage = this.revenue_percentage;
    this.currentQuoter.first_pay = first_pay;
    this.currentQuoter.second_pay = second_pay;
  }

  postQuoter(quoter: Quoter){
    this.quoterService.createQuoter(quoter).subscribe(
      (data)=>{
        console.log("created quoter")
        this.currentQuoter = data
      },
      (error)=>{
        console.error("Could not create quoter", error)
      }
    );
  }

  createQuoter(){
    this.updateQuoter();
    let quoter_id: string = ""; 
    if(!this.currentQuoter._id){
      this.postQuoter(this.currentQuoter);
      return
    }
    quoter_id = this.currentQuoter._id;
    this.quoterService.updateQuoter(quoter_id, this.currentQuoter).subscribe(
      (data)=>{
        console.log("updated quoter")
      },
      (error)=>{
        console.error("Could not update quoter", error)
        if (error.status == 409){
          alert("No se puede modificar una cotizacion que ya se vendio")
        }
        
      }
    ); 
  }

  onSearchQuoter(){
    let quoterToSearch: any =  this.quoterSearchForm.value.searchQuoter;
    console.log("Cotizacion a buscar: ", quoterToSearch)
    this.quoterService.searchQuoter(quoterToSearch).subscribe(
      (data)=>{
        this.foundQuoters = data;
        this.showQuoterResults = true;
        console.log("Cotizaciones encontradas", this.foundQuoters)
      },
      (error)=>{
        console.error("Could not find product", error);
        this.showQuoterResults = false;
      }
    )
  }

  activateQuoterModal(){
    this.showQuoterResults = !this.showQuoterResults;
  }

  selectQuoter(event: any, quoter: Quoter){
    this.currentQuoter = quoter;
    let current_products: Product[] = [];
    let current_services: Service[] = [];
    if (this.currentQuoter.products){
      current_products = this.currentQuoter.products
    }
    if (this.currentQuoter.services){
      current_services = this.currentQuoter.services
    }
    this.addedProducts = current_products;
    this.addedServices =  current_services;
    this.selectedClient = this.currentQuoter.client;
    this.updateTotal();
    this.updateRevenue();
    this.showQuoterResults = false;
  }
  newQuoter(){
    this.currentQuoter = {} as Quoter;
    this.selectedClient= {} as Client;
    this.addedProducts = [];
    this.addedServices = [];
    this.total = 0;
  }
  
  createSale(){
    if (!this.currentQuoter._id){
      alert("No se puede crear una venta sin cotizacion guardada");
      return;
    }
    let quoter_id = {
      id: this.currentQuoter._id
    };
    this.salesService.createSale(quoter_id).subscribe(
      (data)=>{
        console.log("Venta hecha");
      },
      (error)=>{
        console.log("Problemas para crear venta", error);
      },
    );
  }
}
