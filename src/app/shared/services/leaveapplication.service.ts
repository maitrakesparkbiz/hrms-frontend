import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class LeaveapplicationService {
    //
    // // API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    // API_URL = 'http://snaphrms.com/api/';
    // // API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
    }

    saveLeaveApplication = (leave_application) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_application/save_leave_application', leave_application);
    }

    getLeaveApplicationById = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_application/get_leave_application', { 'id': id });
    }
    getAllLeave = () => {
        return this.httpClient.get(AppConstants.API_URL + 'leave_application/get_all_leave_application');
    }
    deleteLeaveType = (leave_type) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_type/delete_leave_type', leave_type);
    }
    updateAcceptStatus = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_application/update_accept_status', { 'id': id });
    }
    updateRejectStatus = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_application/update_reject_status',
            { 'id': data.id, 'reject_reason': data.reject_reason });
    }
    updateCancelStatus = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_application/update_cancel_status',
            { 'id': data.id, 'reason': data.reason });
    }
    deleteLeaveApplication = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_application/delete_leave_application', { 'id': id });
    }
    getLeaveApplication = (leave) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_application/get_remaining_leave', leave);
    }
    getFirstApprovedApplications = () => {
        return this.httpClient.get(AppConstants.API_URL + 'leave_application/getFirstApprovedApplications');
    }
    finalApproveLeave = (data) => {
        return this.httpClient.post(AppConstants.API_URL + 'leave_approved/finalApproveLeave', data);
    }
    getAllApprovedLeaves = () => {
        return this.httpClient.get(AppConstants.API_URL + 'leave_approved/getAllApprovedLeaves');
    }
    finalRejectLeave = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_approved/finalRejectLeave', data);
    }
    saveFinalLeave = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_approved/saveFinalLeave', data);
    }
    updateFinalLeave = (data) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_approved/updateFinalLeave', data);
    }

    getLeaveByEmp = (emp_id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'user_leave/getLeaveByEmp', { 'emp_id': emp_id });
    }

    getEmployeeleaves = (emp_id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_application/getEmployeeleaves', { 'emp_id': emp_id });
    }

    getEmpFinalLeaves = (emp_id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_approved/getEmpFinalLeaves', { 'emp_id': emp_id });
    }

    getEmpUPL = (emp_id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_approved/getEmpUPL', { 'emp_id': emp_id });
    }

    getLeaveRequiredData = (emp_id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_application/getLeaveRequiredData', { 'emp_id': emp_id });
    }

    getSelfLeaveRequiredData = (emp_id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_application/getSelfLeaveRequiredData', { 'emp_id': emp_id });
    }

    getPendingLeavesCount = () => {
        return this.httpClient.get(AppConstants.API_URL + 'leave_application/getPendingLeavesCount');
    }
    // getTodayLeaves() {
    //     return this.httpClient.get<any>(AppConstants.API_URL + 'leave_application/getTodayLeaves');
    // }

    // getRecentLeaves() {
    //     return this.httpClient.get<any>(AppConstants.API_URL + 'leave_application/getRecentLeaves');
    // }
    SaveLeaveBalance = (leave_balance) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'leave_application/saveLeaveBalance', leave_balance);
    }
    getLeaveBalance = (id) => {
        return this.httpClient.get(AppConstants.API_URL + 'leave_application/getLeaveBalance/'+id);
    }
}
