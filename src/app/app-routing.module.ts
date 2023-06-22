import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { QuoterComponent } from './quoter/quoter.component';



const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'cotizador', component: QuoterComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
