import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageManagerService } from '../services/storage-manager.service';
import { PermissionService } from '../services/permission.service';

@Injectable()
export class AuthGuardService implements CanActivateChild {

    constructor(private route: Router, private permissionService: PermissionService) {
    }

    canActivateChild = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean => {
        if (StorageManagerService.getToken() !== null) {
            if (this.permissionService.hasPermission(childRoute.data.auth)) {
                return true;
            }
            if (this.permissionService.hasPermission('DASHBOARD.VIEW')) {
                this.route.navigate(['dashbaord']);
            } else {
                this.route.navigate(['self']);
            }
            return false;
        }
        this.route.navigate(['/', 'login']);
    }
}
