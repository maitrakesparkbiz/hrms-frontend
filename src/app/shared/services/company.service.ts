import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class CompanyService {
    public company_subject = new Subject<any>();
    //   // API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    //    API_URL = 'http://snaphrms.com/api/';
    // //  API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
    }


    saveCompany = (company) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'company/save_company', company);
    }
    getCompanyById = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'company/get_company', { id: id });
    }
    getLogoPaths = () => {
        return this.httpClient.get(AppConstants.API_URL + 'getlogopath');
    }
    uploadImage = (data: any) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'uploadlogo', data);
    }
    getDateTimeFormat = () => {
        return this.httpClient.get(AppConstants.API_URL + 'company/getDateTimeFormat');
    }
}
