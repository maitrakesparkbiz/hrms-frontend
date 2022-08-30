import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class LeaveTypeService {
    //
    // // API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    // API_URL = 'http://snaphrms.com/api/';
    // // API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
    }
    saveLeaveType = (leave_type) => {

        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_type/save_leave_type', leave_type);
    }

    getLeave_typeById = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_type/get_leave_type', { 'id': id });
    }
    getAllLeaveTypes = () => {
        return this.httpClient.get(AppConstants.API_URL + 'leave_type/get_all_leave_type');
    }
    deleteLeaveType = (leave_type) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_type/delete_leave_type', leave_type);
    }
}
