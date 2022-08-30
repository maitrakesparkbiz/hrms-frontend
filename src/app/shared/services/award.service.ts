import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class AwardService {
    // // API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    // API_URL = 'http://snaphrms.com/api/';
    // //  API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
    }


    saveAward = (award) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'award/save_award', award);
    }
    getAwards = () => {
        return this.httpClient.get(AppConstants.API_URL + 'award/get_all_award');

    }
    getAwardById = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'award/get_award', { id: id });
    }

    deleteAward = (award) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'award/delete_award', award);
    }

}
