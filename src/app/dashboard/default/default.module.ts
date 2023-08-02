import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultRoutingModule } from './default-routing.module';
import { DefaultComponent } from './default.component';
import {SharedModule} from '../../theme/shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { NgxGaugeModule } from 'ngx-gauge';

@NgModule({
  imports: [
    CommonModule,
    DefaultRoutingModule,
    SharedModule,ChartsModule,
    NgxGaugeModule
  ],
  declarations: [DefaultComponent]
})
export class DefaultModule { }