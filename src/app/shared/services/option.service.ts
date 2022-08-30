import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class OptionService {

    constructor(private httpClient: HttpClient) {
    }

    getSelectOption = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'option/get_select_options', { id: id });
    }

    getMultipleSelectOptions = (id_arr) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'option/get_multiple_select_options', id_arr);
    }

}
