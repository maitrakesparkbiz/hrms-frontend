import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageManagerService } from '../services/storage-manager.service';

@Injectable()
export class AppLockGuardService implements CanActivateChild {

  constructor(private router: Router) {
  }

  canActivateChild = (childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean => {
    if (StorageManagerService.getLockStatus() === null) {
      return true;
    }
    this.router.navigate(['/lock']);
  }

}
