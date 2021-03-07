import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {

  user = {
    username: "",
    password: ""
  };

  constructor(private authService: UserService,
    private router: Router) {

  }

  login() {
    this.authService.login(this.user).subscribe(data=>{
      localStorage.setItem('user-name', this.user.username);
      this.router.navigate(['/pages/dashboard']);
    })
  } 

}
