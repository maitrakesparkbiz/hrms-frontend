import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()

export class ProjectJrBaService {
    constructor(private httpClient: HttpClient) {
    }

    saveBaProject = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_Jr_BA/saveBaProject', data);
    }

    getBaProjectById = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_Jr_BA/getBaProjectById', { id: id });
    }

    getJrBaDataofProject = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_Jr_BA/getJrBaDataofProject', { ba_project_id: id });
    }
}
