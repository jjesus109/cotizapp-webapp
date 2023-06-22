import { Component } from '@angular/core';
import { UsersService, UserRequest  } from '../services/users';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  profileForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(public userService: UsersService) {}

  login() {
    console.warn(this.profileForm.value);
    console.warn(this.profileForm.value.email);
    console.warn(this.profileForm.value.password);
    let user = {
      "email": this.profileForm.value.email,
      "password": this.profileForm.value.password
    }
    this.userService.login(user).subscribe((data) => {
      console.log(data);
    });
  }
  
}