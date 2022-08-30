import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()

export class FileUploadService {

    headers: any;
    constructor(private httpClient: HttpClient) {
    }

    downloadImage = (image_name) => {
        //
        // return this.httpClient.get(Image_url, {observe: 'response',responseType: 'blob'})
        //     .map((res) => {
        //
        //         return new Blob([res.body], {type: res.headers.get('Content-Type')});
        //     })
        return this.httpClient.get<any>(AppConstants.API_URL + 'downloadimage/' + image_name);
    }

    uploadFile = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'upload/uploadFile', data);
    }

    tempuploadFile = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'upload/uploadFile', data).toPromise();
    }

    multipleFileUpload = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'upload/multipleFileUpload', data);
    }
}
