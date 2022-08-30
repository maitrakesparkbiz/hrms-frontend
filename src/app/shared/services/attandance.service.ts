import { Injectable, ApplicationInitStatus } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class AttandanceService {
    data_sub: any = [];
    choosedDate: any = '';
    choosedEmp: any = '';
    constructor(private httpClient: HttpClient) {
    }

    presentEvent = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'attendance/presentEvent', data);
    }

    saveComment = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'saveComment', data);
    }

    checkCurrentStatus = () => {
        return this.httpClient.get<any>(AppConstants.API_URL + 'attendance/checkCurrentStatus');
    }

    generateListings = () => {
        return this.httpClient.get<any>(AppConstants.API_URL + 'attendance/generateListings');
    }

    getClientIp = () => {
        return this.httpClient.get('http://www.geoplugin.net/json.gp');
    }

    getEmpMonthYearData = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'attendance/getEmpMonthYearData',
            { 'emp_id': data['emp_id'], 'month_year': data['month_year'] });
    }

    getCheckInDataById = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'checkIn/getCheckInDataById', { 'check_in_id': id });
    }

    updateAttendance = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'attendance/updateAttendance', data);
    }

    getUserAttendanceByDate = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'checkIn/getUserAttendanceByDate', data);
    }

    getEmpProductivityRatio = (emp_id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'attendance/getEmpProductivityRatio', { 'emp_id': emp_id });
    }
    getReportDataOfAllUser = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'attendance/getReportDataOfAllUser',data);
    }
    exportReportToExcel = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'attendance/exportReportToExcel',data);
    }
}
