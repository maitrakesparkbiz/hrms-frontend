import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()

export class ProjectCommentsService {

    constructor(private httpClient: HttpClient) {

    }

    getProjectComments = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_comments/getProjectComments', { conv_id: id });
    }

    getSrProjectComments = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_comments/getSrProjectComments', data);
    }

    getJrProjectComments = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_comments/getJrProjectComments', data);
    }

    doCommentSr = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_comments/doCommentSr', data);
    }

    doCommentJr = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_comments/doCommentJr', data);
    }

    // for approved projects

    getApprovedProjectComments = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_comments/getApprovedProjectComments', data);
    }

    doApprovedCommentSr = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_comments/doApprovedCommentSr', data);
    }

    doApprovedCommentJr = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'project_comments/doApprovedCommentJr', data);
    }
}
