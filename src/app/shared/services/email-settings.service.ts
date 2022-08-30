import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class EmailSettingsService {
    constructor(private httpClient: HttpClient) {
    }

    saveEmailSettings = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'saveEmailSettings', data);
    }

    getEmailSettings = () => {
        return this.httpClient.get(AppConstants.API_URL + 'getEmailSettings');
    }
}

