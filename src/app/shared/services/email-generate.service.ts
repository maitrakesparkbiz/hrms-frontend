import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class EmailGenerateService {
    constructor(private httpClient: HttpClient) {
    }

    saveGeneratedEmail = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'generate/saveGeneratedEmail', data);
    }

    getGeneratedEmailById = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'generate/getGeneratedEmailById', { id: id });
    }
}

