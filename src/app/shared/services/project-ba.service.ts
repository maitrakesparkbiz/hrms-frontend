import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()

export class ProjectBaService {
    constructor(private httpClient: HttpClient) {

    }

    saveBaProject = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_BA/saveBaProject', data);
    }

    getBaProjectById = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_BA/getBaProjectById', { id: id });
    }
    getAllJBaSelfBA = () => {
        return this.httpClient.get(AppConstants.API_URL + 'project_BA/getAllJBaSelfBA');
    }
    getAllEmpTimingRecords = (project_id) => {
        return this.httpClient.post(AppConstants.API_URL + 'project_BA/getAllEmpTimingRecords', { project_id: project_id });
    }
}
