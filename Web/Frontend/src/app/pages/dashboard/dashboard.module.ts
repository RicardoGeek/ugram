import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule } from '@nebular/theme';

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
    NbCardModule,
    NbIconModule
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
