import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';
import { Subject } from 'rxjs';

@Injectable()
export class ActivityBoxService {

    newNotification = new Subject();

    constructor(private httpClient: HttpClient) {
    }

    getEmpNotifications = () => {
        return this.httpClient.get(AppConstants.API_URL + 'activity_box/getEmpNotifications');
    }

    readAllNotificationsEmp = () => {
        return this.httpClient.get(AppConstants.API_URL + 'activity_box/readAllNotificationsEmp');
    }

    deleteNotification = (id) => {
        return this.httpClient.post(AppConstants.API_URL + 'activity_box/deleteNotification', { id: id });
    }
}

