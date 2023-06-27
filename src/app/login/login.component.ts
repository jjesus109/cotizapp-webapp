import { Component } from '@angular/core';
import { UsersService  } from '../services/users';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router'
import { Token } from "../models/token"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  token: Token | undefined;

  profileForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    public userService: UsersService,
    public router: Router
  ) {}

  login() {
    let user = {
      "username": this.profileForm.value.username,
      "password": this.profileForm.value.password
    }
    this.userService.login(user).subscribe(
      (token) => {
        localStorage.setItem('token', token.access_token);
        this.router.navigate(['/cotizador']).then(()=> window.location.reload());
        
      },
      (error) =>{
        console.error(error);
      }
    );
  }
}