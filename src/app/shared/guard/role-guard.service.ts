import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageManagerService } from '../services/storage-manager.service';

@Injectable()

export class RoleGuard implements CanActivate {
    constructor(private _router: Router) { }

    canActivate = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean => {
        const user = JSON.parse(StorageManagerService.getUser());
        if (user !== null && user.role) {
            if (user.role.name.toLowerCase() === 'employee') {
                if (user.role.name === next.data.role) {
                    return true;
                } else {
                    this._router.navigate(['/', 'self', 'dashboard']);
                    return false;
                }
            } else {
                return true;
            }
        }
        this._router.navigate(['/', 'login']);
        return false;
    }
}
