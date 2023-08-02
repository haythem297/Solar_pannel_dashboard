import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '../guards/admin-guard';
import {ManageUsersComponent} from './manage-users.component';

const routes: Routes = [
  {
    path: '',
    component: ManageUsersComponent,canActivate:[AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageUsersRoutingModule { }
