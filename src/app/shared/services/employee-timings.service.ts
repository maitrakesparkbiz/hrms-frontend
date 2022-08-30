import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class EmployeeTimingsService {

    // //API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    // API_URL = 'http://snaphrms.com/api/';
    // // API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
    }
    saveEmpTimings = (empTimings) => {

        return this.httpClient.post<any>(AppConstants.API_URL + 'user/saveEmpTimings', empTimings);
    }
    getEmpTimingRecordsById = (emp_id) => {

        return this.httpClient.post<any>(AppConstants.API_URL + 'user/getEmpTimingsRecordsById', {emp_id:emp_id});
    }


}
