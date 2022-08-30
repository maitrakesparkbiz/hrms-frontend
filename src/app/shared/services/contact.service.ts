import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class ContactService {
    public company_subject = new Subject<any>();
    //   // API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    //    API_URL = 'http://snaphrms.com/api/';
    // //  API_URL = 'http://192.168.10.96/api/';
    constructor(private httpClient: HttpClient) {
    }

    saveContact = (contact) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'contact/save_contact', contact);
    }
    getAllContact = () => {
        return this.httpClient.get(AppConstants.API_URL + 'contact/get_contact');
    }
    getContactByID = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'contact/get_contactByID', { id: id });
    }
    deleteContact = (contact) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'contact/delete_contact', contact);
    }

}
