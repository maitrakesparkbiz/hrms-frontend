import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class CompanyProjectService {
    // // API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    // API_URL = 'http://snaphrms.com/api/';
    // //  API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
    }


    saveProject = (projectData) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'company_project/save_project', projectData);
    }
    saveProjectBa = (projectData) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'company_project/save_project_ba', projectData);
    }
    getProjectById = (id, isBa = false) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'company_project/getProjectById', { id: id, isBa: isBa });
    }
    getBaProjectById = (id, isBa = false) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'company_project/getBaProjectById', { id: id, isBa: isBa });
    }

    getProjectDataBaTl = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'company_project/getProjectDataBaTl', { id: id });
    }
    getAllEmpTimingRecords = (project_id) => {
        return this.httpClient.post(AppConstants.API_URL + 'company_project/getAllEmpTimingRecords', { project_id: project_id });
    }
    doComment = (data) => {
        return this.httpClient.post(AppConstants.API_URL + 'company_project/doComment', data);
    }
    projectAction = (event, id) => {
        return this.httpClient.post(AppConstants.API_URL + 'company_project/projectAction', { event: event, id: id });
    }
    checkProjectNameExist = (projectName,proj_id) =>{
        return this.httpClient.post(AppConstants.API_URL + 'company_project/checkProjectNameExist', { projectName: projectName,proj_id:proj_id});
    }
    getReportByEmp = (formData,dateRange) =>{
        return this.httpClient.post(AppConstants.API_URL + 'company_project/getReportByEmp',{ formData,dateRange});
    }
    getAllProjectsList = () =>{
        return this.httpClient.get(AppConstants.API_URL + 'company_project/getAllProjectsList');
    }
    getTotalHoursByProject = (id) =>{
        return this.httpClient.post(AppConstants.API_URL + 'company_project/getTotalHoursByProject',{id: id });
    }

}
