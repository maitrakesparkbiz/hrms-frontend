import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserService } from '../../shared/services/user.service';
import { LeaveTypeService } from '../../shared/services/leave_type.service';
import { FlashMessageService } from '../../shared/services/flash-message.service';
import { LeaveapplicationService } from '../../shared/services/leaveapplication.service';
import { AppConstants } from '../../constants/app.constants';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { interval, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { DatatableService } from '../../shared/services/datatable.service';
import { DashboardService } from '../../shared/services/dashboard.service';
@Component({
    selector: 'app-leaveapplication',
    templateUrl: './leave.component.html',
    styleUrls: ['./leave.component.scss']
})
export class LeaveComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    modalRef: BsModalRef;
    AllLeaves: any = [];
    selectedResult: any = [];
    search;
    allcheck_id;
    edit_id;
    cancel_id;
    leavedetail: any = {};
    leave_edit;
    Leave_status;
    Final_approve;
    allcheck_id_count: any = 0;
    IMAGE_URL;
    employee_image;
    pending_leaves_count;
    leaveForm: FormGroup;
    rejectForm: FormGroup;
    cancelForm: FormGroup;
    constructor(
        public router: Router,
        public userservice: UserService,
        public leavetypeservice: LeaveTypeService,
        private spinner: NgxSpinnerService,
        public leaveapplicationservice: LeaveapplicationService,
        private flashMessageService: FlashMessageService, private modalService: BsModalService,
        private dashboardService: DashboardService,
        private _datePipe: DatePipe,
        private datatableService: DatatableService) {
    }

    ngOnInit() {

        this.IMAGE_URL = AppConstants.IMAGE_URL;
        this.employee_image = '../../../assets/img/avatars/profile_image.jpg';
        this.leaveForm = new FormGroup({
            'duration': new FormControl('all'),
            'status': new FormControl('Pending')
        });
        this.getAllLeaves();
        this.rejectForm = new FormGroup({
            'reject_reason': new FormControl('', [Validators.required])
        });
        this.cancelForm = new FormGroup({
            'cancel_reason': new FormControl('', [Validators.required])
        });
        // this.dtTrigger.next();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    // getAllLeaves() {
    //     this.spinner.show();
    //     this.leaveapplicationservice.getAllLeave().subscribe(res => {
    //         this.AllLeaves = res;
    //         for (let i = 0; i < this.AllLeaves.length; i++) {
    //             this.AllLeaves[i].firstname = this.AllLeaves[i].user_id['firstname'] + ' ' + this.AllLeaves[i].user_id['lastname'];
    //             this.AllLeaves[i].profile_image = this.AllLeaves[i].user_id['profile_image'];
    //             this.AllLeaves[i].leave_date = moment(this.AllLeaves[i].leave_date.date).format('MMM D YYYY');
    //         }
    //         this.selectedResult = this.AllLeaves;
    //         this.spinner.hide();
    //     });
    // }

    getSelectedData = () => {
        this.rerender();
    }

    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    getAllLeaves = () => {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 50,
            lengthMenu: [5, 10, 25, 50],
            serverSide: true,
            processing: true,
            language: {
                searchPlaceholder: 'Search...',
                search: ''
            },
            // search: { search: this.leaveForm.get('status').value },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.columns[2].search.value = this.leaveForm.get('duration').value;
                dataTablesParameters.columns[4].search.value = this.leaveForm.get('status').value;
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllLeaves').subscribe(resp => {
                    this.allcheck_id = false;
                    this.allcheck_id_count = 0;
                    this.AllLeaves = resp.data['data'];
                    this.pending_leaves_count = resp.data['count'];
                    this.dashboardService.pendingLeaves.next({ 'count': this.pending_leaves_count });
                    // this.spinner.hide();
                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: []
                    });
                });
            },
            order: [],
            columns: [{ name: 'id', orderable: false },
            { name: 'firstname' },
            { name: 'leave_date' },
            { name: 'reason' },
            { name: 'status', searchable: false }]
        };
    }


    checkboxHeader = (evt: Event) => {
        this.allcheck_id_count = 0;
        if (this.allcheck_id !== true) {
            for (let i = 0; i < this.AllLeaves.length; i++) {
                this.AllLeaves[i]['isSelected'] = true;
                this.allcheck_id_count++;
            }
        } else {
            for (let i = 0; i < this.AllLeaves.length; i++) {
                this.AllLeaves[i]['isSelected'] = false;
            }
        }
        // console.log(this.dept);
    }

    checkone = (id) => {
        this.allcheck_id = false;
        let selectId = '';
        this.allcheck_id_count = 0;
        for (let i = 0; i < this.AllLeaves.length; i++) {
            if (+this.AllLeaves[i]['id'] === +id) {
                this.AllLeaves[i]['isSelected'] = !this.AllLeaves[i]['isSelected'];
                if (this.AllLeaves[i]['isSelected']) {
                    this.Leave_status = this.AllLeaves[i]['status'];
                    this.Final_approve = this.AllLeaves[i]['final_approve'];
                    this.cancel_id = this.AllLeaves[i]['id'];
                    this.allcheck_id_count++;
                    selectId = this.AllLeaves[i];
                }
            } else {
                this.AllLeaves[i]['isSelected'] = false;
            }
        }
        if (this.allcheck_id_count === 1) {
            this.getLeaveDetail(selectId);
        }
    }

    getLeaveDetail = (detail) => {
        this.leavedetail = detail;
    }

    EditLeave = () => {
        this.leave_edit = [];
        this.leave_edit = this.AllLeaves;
        for (let i = 0; i < this.AllLeaves.length; i++) {
            if (this.leave_edit[i]['isSelected']) {
                this.router.navigate(['/leave/leave-applications/edit/' + this.leave_edit[i].id]);
            }
        }
    }


    DeleteLeave = () => {
        this.leave_edit = [];
        this.leave_edit = this.AllLeaves;
        this.closeModel();
        for (let i = 0; i < this.AllLeaves.length; i++) {
            if (this.leave_edit[i]['isSelected']) {
                this.leaveapplicationservice.deleteLeaveApplication(this.leave_edit[i]['id']).subscribe(res => {
                    if (res === 'Deleted Successfully') {
                        this.rerender();
                        this.flashMessageService.pop('error', 'Leave Deleted SuccesFully', 'Delete Leave');
                    }
                });
            }
        }
    }

    AcceptLeave = () => {
        this.leave_edit = [];
        this.leave_edit = this.AllLeaves;
        this.closeModel();
        this.leaveapplicationservice.updateAcceptStatus(this.edit_id).subscribe(res => {
            if (res === 'Updated Successfully') {
                this.rerender();
                this.allcheck_id_count = 0;
                this.flashMessageService.pop('success', 'Leave Accepted SuccesFully', 'Accept Leave');
            }
        });
    }

    RejectLeave = () => {
        if (this.rejectForm.valid) {
            this.leave_edit = [];
            this.closeModel();
            this.leave_edit['reject_reason'] = this.rejectForm.get('reject_reason').value;
            this.leave_edit['id'] = this.edit_id;
            this.leaveapplicationservice.updateRejectStatus(this.leave_edit).subscribe(res => {
                if (res === 'Updated Successfully') {
                    this.rerender();
                    this.allcheck_id_count = 0;
                    this.flashMessageService.pop('error', 'Leave Rejected', 'Reject Leave');
                }
            });
        }
    }
    CancelLeave = () => {

        if (this.cancelForm.valid) {
            this.leave_edit = [];
            this.closeModel();
            this.leave_edit['reason'] = this.cancelForm.get('cancel_reason').value;
            this.leave_edit['id'] = this.cancel_id;

            this.leaveapplicationservice.updateCancelStatus(this.leave_edit).subscribe(res => {
                if (res === 'Updated Successfully') {
                    this.rerender();
                    this.allcheck_id_count = 0;
                    this.flashMessageService.pop('error', 'Leave Cancel', 'Cancel Leave');
                }
            });
        }
    }


    openModel = (template, id) => {
        this.edit_id = id;
        this.rejectForm.reset();
        this.modalRef = this.modalService.show(template);
    }

    closeModel = () => {
        this.modalRef.hide();
    }



    // getSelectedData() {
    //     console.log(this.AllLeaves);
    //     const tempArray: any[] = [];
    //     switch (this.leaveForm.get('duration').value) {
    //         case 'all':
    //             for (let i = 0; i < this.AllLeaves.length; i++) {
    //                 tempArray.push(this.AllLeaves[i]);
    //             }
    //             break;
    //         case 'last_30_days':
    //             const last_30_days = (moment().subtract(30, 'days').format('MMM D YYYY'));
    //             for (let i = 0; i < this.AllLeaves.length; i++) {
    //                 if (moment(this.AllLeaves[i]['leave_date']).isSameOrAfter(last_30_days)) {
    //                     tempArray.push(this.AllLeaves[i]);
    //                 }
    //             }
    //             break;


    //         case 'last_3_months':
    //             const last_3_months = (moment().subtract(3, 'month').format('MMM  YYYY'));
    //             for (let i = 0; i < this.AllLeaves.length; i++) {
    //                 if (moment(this.AllLeaves[i]['leave_date']).isSameOrAfter(last_3_months)) {
    //                     tempArray.push(this.AllLeaves[i]);
    //                 }
    //             }
    //             break;
    //         case 'last_year':
    //             const last_year = (moment().subtract(1, 'year').format('MMM YYYY'));
    //             for (let i = 0; i < this.AllLeaves.length; i++) {
    //                 if (moment(this.AllLeaves[i]['leave_date']).isSameOrBefore(last_year)) {
    //                     tempArray.push(this.AllLeaves[i]);
    //                 }
    //             }
    //             break;
    //         case 'this_month':
    //             const leave_date = (moment().startOf('month').subtract(1, 'days').format('MMM D YYYY'));
    //             const last_date = (moment().endOf('month').format('MMM D YYYY'));
    //             for (let i = 0; i < this.AllLeaves.length; i++) {
    //                 if (moment(this.AllLeaves[i]['leave_date']).isBetween(leave_date, last_date)) {
    //                     tempArray.push(this.AllLeaves[i]);
    //                 }
    //             }
    //             break;


    //         case 'last_6_months':
    //             const last_6_months = (moment().subtract(6, 'month').format('MMM  YYYY'));
    //             for (let i = 0; i < this.AllLeaves.length; i++) {
    //                 if (moment(this.AllLeaves[i]['leave_date']).isSameOrAfter(last_6_months)) {
    //                     tempArray.push(this.AllLeaves[i]);
    //                 }
    //             }
    //             break;
    //     }

    //     const afterSelectedDurationTempArray: any[] = [];

    //     switch (this.leaveForm.get('status').value) {
    //         case 'all':
    //             for (let i = 0; i < tempArray.length; i++) {
    //                 afterSelectedDurationTempArray.push(tempArray[i]);
    //             }

    //             break;
    //         case 'Accept':
    //             for (let i = 0; i < tempArray.length; i++) {
    //                 if (tempArray[i]['status'] === 'Accept') {
    //                     afterSelectedDurationTempArray.push(tempArray[i]);
    //                 }
    //             }
    //             break;
    //         case 'Reject':
    //             for (let i = 0; i < tempArray.length; i++) {
    //                 if (tempArray[i]['status'] === 'Reject') {
    //                     afterSelectedDurationTempArray.push(tempArray[i]);
    //                 }
    //             }
    //             break;
    //         case 'Pending':
    //             for (let i = 0; i < tempArray.length; i++) {
    //                 if (tempArray[i]['status'] === 'Pending') {
    //                     afterSelectedDurationTempArray.push(tempArray[i]);
    //                 }
    //             }
    //             break;
    //     }
    //     this.AllLeaves = afterSelectedDurationTempArray;
    // }

}

