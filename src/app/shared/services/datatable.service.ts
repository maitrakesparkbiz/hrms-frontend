import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class DatatableService {

    constructor(private httpClient: HttpClient) {
    }

    getTableData = (dataTablesParameters, url) => {
        return this.httpClient.post<DataTablesResponse>(AppConstants.API_URL + url, dataTablesParameters);
    }
    getClosedTableData = (dataTablesParameters, url) => {
        return this.httpClient.post<DataTablesResponse>(AppConstants.API_URL + url, dataTablesParameters);
    }
    getLetterTemplate = (dataTablesParameters, url) => {
        return this.httpClient.post<DataTablesResponse>(AppConstants.API_URL + url, dataTablesParameters);
    }

    getTableDataAttn = (dataTablesParameters, attn_date) => {
        return this.httpClient.post<DataTablesResponse>(AppConstants.API_URL + 'datatable/getAllUsersAttendance',
            { dataTablesParameters, attn_date });
    }

    getTableDataAttnSelf = (dataTablesParameters, dateRange) => {
        return this.httpClient.post<DataTablesResponse>(AppConstants.API_URL + 'datatable/getUserAttendanceByDate',
            { dataTablesParameters, dateRange });
    }
    getTableDataTeamSelf = (dataTablesParameters, dateRange, team_id) => {
        return this.httpClient.post<DataTablesResponse>(AppConstants.API_URL + 'datatable/getTeamAttendanceByDate',
            { dataTablesParameters, dateRange, team_id });
    }

    getHolidaysDatatable = (parameters, year) => {
        return this.httpClient.post<DataTablesResponse>(AppConstants.API_URL + 'datatable/getHolidaysDatatable',
            { parameters, year });
    }


}

class DataTablesResponse {
    data: any[];
    draw: number;
    recordsFiltered: number;
    recordsTotal: number;
}
