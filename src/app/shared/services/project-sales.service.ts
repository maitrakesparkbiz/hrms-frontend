import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()

export class ProjectSalesService {
    constructor(private httpClient: HttpClient) {

    }

    saveProject = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_sales/saveProject', data);
    }

    getProjectById = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_sales/getProjectById', { id: id });
    }

    saveFinalApproveProject = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_sales/saveFinalApproveProject', data);
    }

    updateFinalApproveProject = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_sales/updateFinalApproveProject', data);
    }

    getFinalApproveProjectById = (id, jr_ba = false, sr_ba = false) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_sales/getFinalApproveProjectById',
            { id: id, jr_ba: jr_ba, sr_ba: sr_ba });
    }

    startApprovedProject = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_sales/startApprovedProject', data);
    }
    getAllBASelfSales = () => {
        return this.httpClient.get(AppConstants.API_URL + 'project_sales/getAllBASelfSales');
    }
}
