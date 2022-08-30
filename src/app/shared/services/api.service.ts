import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';
import { Subject } from 'rxjs';

@Injectable()
export class ApiService {
    requestCount = 0;
    requestSubject = new Subject<any>();
    directiveSubject = new Subject<any>();
    //   //API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    // // Image_URL= 'http://www.snaphrms.taskgrids.com/api/api/public';
    //    API_URL = 'http://snaphrms.com/api/';
    // //  API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
        this.requestSubject.subscribe(
            (res) => {
                if (res) {
                    this.requestCount++;
                } else {
                    this.requestCount--;
                }
                this.directiveSubject.next();
            }
        )
    }

    handleRequest = () => {

    }

    login = (credentials: { email: string, password: string }) => {
        return this.httpClient.post(AppConstants.API_URL + 'login', credentials);
    }

    unlock = (password) => {
        return this.httpClient.post(AppConstants.API_URL + 'unlock', { password: password });
    }

    getRoles = () => {
        return this.httpClient.get(AppConstants.API_URL + 'roles');
    }

    // logout API to make sure Token gets invalid so no one can use it anyway
    logout = () => {
        return this.httpClient.delete(AppConstants.API_URL + 'logout');
    }
    updateUserPassword = (user) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'user/update_user_password', user);
    }
}
