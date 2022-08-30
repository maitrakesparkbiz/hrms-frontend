import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';
import { Subject } from 'rxjs';

@Injectable()
export class UserService {
  public profile_subject = new Subject<any>();
  public all_users: any = [];
  constructor(private httpClient: HttpClient, private inj: Injector) {
  }
  getAllUsers = () => {
    return this.httpClient.get<any>(AppConstants.API_URL + 'user/get_all_users');
  }
  getAllUsersWithLeaves = () => {
    return this.httpClient.get<any>(AppConstants.API_URL + 'user/getAllUsersWithLeaves');
  }
  getAllUsersWithFinalLeaves = () => {
    return this.httpClient.get<any>(AppConstants.API_URL + 'user/getAllUsersWithFinalLeaves');
  }
  checkUniquefield = (employee_id) => {
    return this.httpClient.post<any>(AppConstants.API_URL + 'user/check_email', { 'employee_id': employee_id });
  }
  checkUniquefieldUpdate = (employee_id, id) => {
    return this.httpClient.post<any>(AppConstants.API_URL + 'user/check_employeeID', { 'employee_id': employee_id, 'id': id });
  }
  saveEmployee = (employee) => {
    return this.httpClient.post<any>(AppConstants.API_URL + 'user/save_employee', employee);
  }
  getEmployeeById = (employee_id) => {
    return this.httpClient.post<any>(AppConstants.API_URL + 'user/getEmployeeById', { 'employee_id': employee_id });
  }
  getEmployeeByIdSelf = (emp_id) => {
    return this.httpClient.get(AppConstants.API_URL + 'user/getEmployeeByIdSelf' + emp_id);
  }
  getManagerUser = () => {
    return this.httpClient.get<any>(AppConstants.API_URL + 'user/get_manager_user');
  }
  updateEmployee = (employee) => {
    return this.httpClient.post<any>(AppConstants.API_URL + 'user/update_employee', employee);
  }
  deleteUser = (employee) => {
    return this.httpClient.post<any>(AppConstants.API_URL + 'user/delete_employee', employee);
  }
  getAllUsersAttendance = (attn_date) => {
    return this.httpClient.post<any>(AppConstants.API_URL + 'user/getAllUsersAttendance', { 'attn_date': attn_date });
  }
  getMemberData = (emp_id) => {
    return this.httpClient.post<any>(AppConstants.API_URL + 'user/getMemberData', { emp_id });
  }
  getAllUsersSelf = () => {
    return this.httpClient.get(AppConstants.API_URL + 'user/getAllUsersSelf');
  }
  getContactUsers = (params) => {
    return this.httpClient.post<any>(AppConstants.API_URL + 'user/getContactUsers', params);
  }
  getAllUsersExceptHR = () => {
    return this.httpClient.get(AppConstants.API_URL + 'user/getAllUsersExceptHR');
  }
  getAllJBaSelfBA = () => {
    return this.httpClient.get(AppConstants.API_URL + 'user/getAllJBaSelfBA');
  }
  getSetAllUsers = () => {
    if (this.all_users.length === 0) {
      this.getAllUsersSelf().subscribe(res => {
        this.all_users = res;
      });
      return this.httpClient.get(AppConstants.API_URL + 'user/getAllUsersSelf');
    }
  }

  getUserLetterData = (id) => {
    return this.httpClient.post<any>(AppConstants.API_URL + 'user/getUserLetterData', { id: id });
  }


}
