import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()

export class TeamService {
    constructor(private httpClient: HttpClient) {
    }

    addTeam = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'team/addTeam', { data });
    }

    getTeamById = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'team/getTeamById', { 'id': id });
    }

    deleteTeam = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'team/deleteTeam', { 'id': id });
    }
}
