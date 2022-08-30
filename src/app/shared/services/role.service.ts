import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class RoleService {
    constructor(private httpClient: HttpClient) {
    }
    saveRole = (roledetail) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'role/save_role', roledetail);
    }
    getRole = () => {
        return this.httpClient.get(AppConstants.API_URL + 'role/get_all_roles');
    }
    getRolewithoutEmployee = () => {
        return this.httpClient.get(AppConstants.API_URL + 'role/get_roll_without_employee');
    }
    getRole_permission = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'role/get_role_permission', { 'id': id });
    }
    deleteRole = (roledetail) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'role/delete_role', roledetail);
    }
    rolePermissions = (role_id) => {
        return this.httpClient.get(AppConstants.API_URL + 'role/rolePermissions' + role_id);
    }
}
