import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class CalenderService {
    public company_subject = new Subject<any>();
    // // API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    // API_URL = 'http://snaphrms.com/api/';
    // //  API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
    }

    saveCalenderMonth = (calender) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'calender/save_calender', { 'calendermonth': calender });
    }
    getCalenderMonthById = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'calender/getCalenderByID', { 'id': id });
    }

}
