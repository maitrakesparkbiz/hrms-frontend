import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class ExpensecategoryService {

    // // API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    // API_URL = 'http://snaphrms.com/api/';
    // // API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
    }
    saveExpenseCategory = (expensecategory) => {

        return this.httpClient.post<any>(AppConstants.API_URL + 'expense_category/save_expense_category', expensecategory);
    }
    getExpenseCategory = () => {
        return this.httpClient.get<any>(AppConstants.API_URL + 'expense_category/get_all_expense_category');
    }

    deleteExpenseCategory = (expensecategory) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'expense_category/delete_expense_category', expensecategory);
    }


}
