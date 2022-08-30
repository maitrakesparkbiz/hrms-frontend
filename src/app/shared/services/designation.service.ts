import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class DesignationService {

    // //API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    // API_URL = 'http://snaphrms.com/api/';
    // // API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
    }
    saveDesignation = (designation) => {

        return this.httpClient.post<any>(AppConstants.API_URL + 'designation/save_designation', designation);
    }
    getDesignation = () => {
        return this.httpClient.get<any>(AppConstants.API_URL + 'designation/get_all_designation');
    }

    deleteDesignation = (designation) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'designation/delete_designation', designation);
    }


}
