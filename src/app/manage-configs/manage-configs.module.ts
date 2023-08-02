import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageConfigsComponent } from './manage-configs.component';
import { ManageConfigsRoutingModule } from './manage-configs-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../theme/shared/shared.module';

@NgModule({
  declarations: [ManageConfigsComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ManageConfigsRoutingModule,
    SharedModule
  ]
})
export class ManageConfigsModule { }
