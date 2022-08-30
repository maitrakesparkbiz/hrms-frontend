declare const Pusher: any;

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StorageManagerService } from './storage-manager.service';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class PusherService {
    pusher: any;
    projectUpdateChannel: any;
    userData: any = [];

    constructor(private httpClient: HttpClient) {
        this.subscribeChannel();
    }

    subscribeChannel = () => {
        this.userData = JSON.parse(StorageManagerService.getUser());
        if (this.userData) {
            const dataLength = Object.keys(this.userData).length;
            if (dataLength > 0) {
                // this.pusher = new Pusher(environment.pusher.key, {
                //     cluster: environment.pusher.cluster,
                //     encrypted: true
                // });
                // this.projectUpdateChannel = this.pusher.subscribe('project-update-' + this.userData.id);
                // Pusher.log = function (message) {
                //     if (window.console && window.console.log) {
                //         // window.console.log(message);
                //     }
                // };
            }
        }
    }

    sendNotifications = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'sendNotifications', data);
    }

    unSubscribe = () => {
        // this.pusher.unsubscribe('project-update-' + this.userData.id);
    }
}
