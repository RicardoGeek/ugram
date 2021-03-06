import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxAuthRoutingModule } from './auth-routing.module';
import { NbAuthModule } from '@nebular/auth';
import { 
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbOptionModule,
  NbSelectModule,
} from '@nebular/theme';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserService } from '../../services/user.service';
import { ThemeModule } from '../../@theme/theme.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,
    NbAuthModule,
    NbSelectModule,
    NbOptionModule
   
  ],
  declarations: [
    RegisterComponent,
    LoginComponent,
  ],
  providers: [
    UserService
  ]
})
export class NgxAuthModule {
}