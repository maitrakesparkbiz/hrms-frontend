import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';
import { Subject } from 'rxjs';

@Injectable()
export class JobsService {
    // public applicationSubject = new Subject<any>();

    constructor(private httpClient: HttpClient) {
    }

    getAllOpenings = () => {
        return this.httpClient.get(AppConstants.API_URL + 'getAllOpenings');
    }

    getAllOpeningsSelf = () => {
        return this.httpClient.get(AppConstants.API_URL + 'getAllOpeningsSelf');
    }

    getOpeningsPublic = () => {
        return this.httpClient.get(AppConstants.API_URL + 'getOpeningsPublic');
    }

    getApplicationByEmpId = (emp_id) => {
        return this.httpClient.get(AppConstants.API_URL + 'getApplicationByEmpId' + emp_id);
    }

    deleteOpening = (id) => {
        return this.httpClient.get(AppConstants.API_URL + 'deleteOpening' + id);
    }

    saveOpening = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'saveOpening', data);
    }

    getOpeningById = (edit_id) => {
        return this.httpClient.get(AppConstants.API_URL + 'getOpeningById' + edit_id);
    }

    // job application

    getAllJobApplications = () => {
        return this.httpClient.get(AppConstants.API_URL + 'getAllJobApplications');
    }

    getAllJobApplicationsInt = () => {
        return this.httpClient.get(AppConstants.API_URL + 'getAllJobApplicationsInt');
    }

    getJobOptionsData = () => {
        return this.httpClient.get(AppConstants.API_URL + 'getJobOptionsData');
    }

    saveApplication = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'saveApplication', data);
    }
    saveCandidatesInfo = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'saveCandidatesInfo', data);
    }

    getApplicationById = (id) => {
        return this.httpClient.get(AppConstants.API_URL + 'getApplicationById' + id);
    }
    getCandidatesInfoById = (id) => {
        return this.httpClient.get(AppConstants.API_URL + 'getCandidatesInfoById' + id);
    }

    rescheduleInterview = (data) => {
        return this.httpClient.post(AppConstants.API_URL + 'rescheduleInterview', data);
    }
    getAllInterviews = (id) => {
        return this.httpClient.get(AppConstants.API_URL + 'getAllInterviews' + id);
    }
}
