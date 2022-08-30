import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class LocationService {

    // // API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    // API_URL = 'http://snaphrms.com/api/';
    // // API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
    }
    saveLocation = (location) => {

        return this.httpClient.post<any>(AppConstants.API_URL + 'location/save_location', location);
    }
    getLocation = () => {
        return this.httpClient.get<any>(AppConstants.API_URL + 'location/get_all_location');
    }

    deleteLocation = (location) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'location/delete_location', location);
    }

    getAllLocationOpt = () => {
        return this.httpClient.get<any>(AppConstants.API_URL + 'location/getAllLocationOpt');
    }

    getUserBatch = () => {
        return this.httpClient.get<any>(AppConstants.API_URL + 'location/getUserBatch');
    }
}
