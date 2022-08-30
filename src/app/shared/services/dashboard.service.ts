import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';
import { Subject } from 'rxjs';

@Injectable()
export class DashboardService {
    recentLeaves: Subject<any> = new Subject;
    updatedData: Subject<any> = new Subject;
    pendingLeaves: Subject<any> = new Subject;
    pendingClaims: Subject<any> = new Subject;
    pendingJobs: Subject<any> = new Subject;
    todayLeaves: Subject<any> = new Subject;
    unreadNews: Subject<any> = new Subject;

    constructor(private httpClient: HttpClient) {
    }

    getLeaveDataDashboard = () => {
        return this.httpClient.get(AppConstants.API_URL + 'dashboard/getLeaveDataDashboard');
    }

    getPendingClaims = () => {
        return this.httpClient.get(AppConstants.API_URL + 'dashboard/getPendingClaims');
    }

    getAttendanceDashboard = () => {
        return this.httpClient.get(AppConstants.API_URL + 'dashboard/getAttendanceDashboard');
    }

    getUpcomingBdays = () => {
        return this.httpClient.get(AppConstants.API_URL + 'user/getUpcomingBdays');
    }

    getYearMonthFinalLeaves = (date) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'dashboard/getYearMonthFinalLeaves', { 'date': date });
    }

    getCurrentMonthIncrementEmp = () => {
        return this.httpClient.get(AppConstants.API_URL + 'dashboard/getCurrentMonthIncrementEmp');
    }

    getLeavesSelfDashboard = (date) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'dashboard/getLeavesSelfDashboard', { 'date': date });
    }
    getLeavesSelfTeamLeaderDashboard = (date) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'dashboard/getLeavesSelfTeamLeaderDashboard', { 'date': date });
    }

    getPendingCount = () => {
        return this.httpClient.get(AppConstants.API_URL + 'dashboard/getPendingCount');
    }
    getPendingCountSelf = () => {
        return this.httpClient.get(AppConstants.API_URL + 'dashboard/getPendingCountSelf');
    }
}
