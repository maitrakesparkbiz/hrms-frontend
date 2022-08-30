import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class AppreciationService {
    //   // API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    //    API_URL = 'http://snaphrms.com/api/';
    // //  API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
    }


    saveAppreciation = (contact) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'appreciation/save_appreciation', contact);
    }
    getAllappreciation = () => {
        return this.httpClient.get(AppConstants.API_URL + 'appreciation/get_appreciation');
    }
    getAppreciationByID = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'appreciation/get_appreciationByID', { id: id });
    }
    deleteAppreciation = (appreciation) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'appreciation/delete_appreciation', appreciation);
    }
    getAppreciationByEmp = (id) => {
        return this.httpClient.get(AppConstants.API_URL + 'appreciation/getAppreciationByEmpId' + id);
    }

}
