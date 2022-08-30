import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class DepartmentService {

    //  // API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    // API_URL = 'http://snaphrms.com/api/';
    // // API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
    }
    saveDepartment = (department) => {

        return this.httpClient.post<any>(AppConstants.API_URL + 'department/save_department', department);
    }
    getDepartments = () => {
        return this.httpClient.get<any>(AppConstants.API_URL + 'department/get_all_department');
    }

    deletedepartment = (department) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'department/delete_department', department);
    }


}
