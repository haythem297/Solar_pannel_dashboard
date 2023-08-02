import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthSigninComponent } from './auth-signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  declarations: [AuthSigninComponent]
})
export class AuthSigninModule { }
