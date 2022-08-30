import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class ExpenseService {

    // // API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    // API_URL = 'http://snaphrms.com/api/';
    // // API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
    }
    saveExpense = (expense) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'expense/save_expense', expense);
    }
    getAllExpense = () => {
        return this.httpClient.get<any>(AppConstants.API_URL + 'expense/get_allexpense');
    }

    getAllRecExpense = () => {
        return this.httpClient.get<any>(AppConstants.API_URL + 'expense/get_all_re_expense');
    }

    getExpenseById = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'expense/get_expenseById', { 'id': id });
    }

    deleteExpense = (expense) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'expense/delete_expense', expense);
    }
    publishNews = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'news/publish_news', { 'id': id });
    }
    getAllClaimExpense = () => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'expense/get_all_claims', {});
    }
    getClaimsSelf = (id) => {
        return this.httpClient.get(AppConstants.API_URL + 'expense/getClaimsSelf' + id);
    }
    approveclaim = (id, emp_id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'expense/approve_claim', { 'id': id, 'actioned_by': emp_id });
    }
    rejectclaim = (id, emp_id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'expense/reject_claim', { 'id': id, 'actioned_by': emp_id });
    }

    getExpenseByYear = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'expense/getExpenseByYear', data);
    }

    getPendingClaimsCount = () => {
        return this.httpClient.get(AppConstants.API_URL + 'expense/getPendingClaimsCount');
    }
}
