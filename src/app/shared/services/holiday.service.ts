import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class HolidayService {
    constructor(private httpClient: HttpClient) {

    }
    getHolidayData = (year) => {
        return this.httpClient.get(AppConstants.API_URL + 'getHolidayData' + year);
    }
    saveHoliday = (data) => {
        return this.httpClient.post(AppConstants.API_URL + 'saveHoliday', data);
    }
    getHolidayInfo = (id) => {
        return this.httpClient.get(AppConstants.API_URL + 'getHolidayInfo' + id);
    }

    deleteHolidays = (data) => {
        return this.httpClient.post(AppConstants.API_URL + 'deleteHolidays', data);
    }

    deleteEvent = (id) => {
        return this.httpClient.get(AppConstants.API_URL + 'deleteEvent' + id);
    }
}
