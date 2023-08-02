import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '../guards/admin-guard';
import {ManageConfigsComponent} from './manage-configs.component';

const routes: Routes = [
  {
    path: '',
    component: ManageConfigsComponent,canActivate:[AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ManageConfigsRoutingModule { }