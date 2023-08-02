import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '../guards/admin-guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'default',
        canActivate: [AdminGuard],
        loadChildren: () => import('./default/default.module').then(m => m.DefaultModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
