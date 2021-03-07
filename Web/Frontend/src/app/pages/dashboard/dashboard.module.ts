import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbInputModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    CommonModule,
    FormsModule,
    NbInputModule,
    NbButtonModule,
    NbCardModule
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
