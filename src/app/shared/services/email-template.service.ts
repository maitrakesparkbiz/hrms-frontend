import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from '../../constants/app.constants';

@Injectable()

export class EmailTemplateService {
    constructor(private httpClient: HttpClient) { }

    saveEmailTemplate = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'saveEmailTemplate', data);
    }
    saveTemplate = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'saveTemplate', data);
    }

    getEmailTemplate = () => {
        return this.httpClient.get(AppConstants.API_URL + 'getEmailTemplate');
    }
    getTemplateById = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'getTemplateById', { id: id });
    }

    getAllTemplatesOption = () => {
        return this.httpClient.get(AppConstants.API_URL + 'getAllTemplatesOption');
    }
    deleteTemplate = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'deleteTemplate', data);
    }
}
