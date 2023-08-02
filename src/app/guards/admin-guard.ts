
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Injectable({ providedIn: 'root' })

export class AdminGuard implements CanActivate {
    constructor(private apiService: ApiService,private Route: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.apiService.Isloggin()) {
            return true;
        } else {
            this.Route.navigate(['/sign-in']);
        }
    }
}
