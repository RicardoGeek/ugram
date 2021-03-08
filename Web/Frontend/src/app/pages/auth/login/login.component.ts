import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DialogComponent } from '../../../@theme/components/dialogs/dialog/dialog.component';
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
    private router: Router,
    private dialogService: NbDialogService) {

  }

  login() {
    if (this.user.username && this.user.password) {
      this.authService.login(this.user).subscribe(data=>{
        localStorage.setItem('user-name', this.user.username);
        this.router.navigate(['/pages/dashboard']);
      }, error =>{
        this.dialogService
      .open(DialogComponent, { context: { data: 'Usuario y/o Contraseña incorrecta' } })
      }
      );

    } else {
      this.dialogService
      .open(DialogComponent, { context: { data: 'Faltan datos del usuario' } })
    }
  } 

}
