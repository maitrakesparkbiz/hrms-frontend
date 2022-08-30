import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class CandidateInfoService {
    // // API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    // API_URL = 'http://snaphrms.com/api/';
    // //  API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
    }


    sendCandidateMail = (data,body) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'candidate/sendCandidateMail',{ data:data,body:body});
    }


}
