import { Component } from '@angular/core';
import { ClientService } from "../services/clients"
import { Client } from '../models/client';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-quoter',
  templateUrl: './quoter.component.html',
  styleUrls: ['./quoter.component.css']
})
export class QuoterComponent {
  activeNewClient: boolean = true;
  foundClients: Client[] = [];
  searchClient: string = "";
  showClientResults: boolean = false;
  selectedClient: Client = {} as Client;
  clientSearchForm = new FormGroup({
    searchClient: new FormControl(''),
    selectedClient: new FormControl('')
  });

  constructor(private clientService: ClientService){
  }

  ngOnInit(){
    this.activeNewClient = false;
  }

  activarClientModal(){
    this.activeNewClient != this.activeNewClient;
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
    alert("clicked me!");
    console.log("Cliente creado");
  }
}
