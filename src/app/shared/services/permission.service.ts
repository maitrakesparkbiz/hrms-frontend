import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';
import { StorageManagerService } from './storage-manager.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable()
export class PermissionService {
    permissions: any = [];
    constructor(private httpClient: HttpClient, private apiService: ApiService, private router: Router) {
    }

    getAllPermission = () => {
        return this.httpClient.get(AppConstants.API_URL + 'permission/get_all_permission');
    }

    hasPermission = (permission: string) => {
        if (this.permissions.length === 0) {
            const user = JSON.parse(StorageManagerService.getUser());
            this.permissions = user.permission;
            if (this.permissions.length === 0) {
                this.apiService.logout().subscribe(
                    (res: any) => {
                        if (res.response === 'success') {
                            StorageManagerService.clearAll();
                            this.router.navigate(['/login']);
                        }
                    }
                );
            }
        }
        if (this.permissions.includes(permission)) {
            return true;
        }
        return false;
    }
}
