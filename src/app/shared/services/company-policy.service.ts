import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class CompanyPolicyService {
    constructor(private httpClient: HttpClient) {
    }

    getPolicyById = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'company_policy/companyPolicyById', { id: id });
    }

    savePolicy = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'company_policy/savePolicy', data);
    }

    deletePolicy = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'company_policy/deletePolicy', { id: id });
    }

}