import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../shared/services/user.service';
import { LeaveTypeService } from '../../../../shared/services/leave_type.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LeaveapplicationService } from '../../../../shared/services/leaveapplication.service';
import { FlashMessageService } from '../../../../shared/services/flash-message.service';
import { DatePipe } from '@angular/common';
import { AppConstants } from '../../../../constants/app.constants';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';
import * as moment from 'moment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../../../shared/services/datatable.service';
import { ConfirmPasswordValidation } from '../../../../validators/confirm-password.validator';

@Component({
    selector: 'app-applications',
    templateUrl: 'applications.component.html',
    styleUrls: ['./applications.component.scss']
})

export class ApplicationsComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();


    modalRef: BsModalRef;
    AllLeaves: any = [];
    selectedResult: any = [];
    search;
    allcheck_id;
    leavedetail: any = {};
    leavetypes: any = [];
    userLeave: any = [];
    leaveOpt: any = [];
    emp_data: any = [];
    finalLeaves: any = [];
    leave_edit;
    Leave_status;
    Final_approve;
    cancel_id;
    allcheck_id_count: any = 0;
    IMAGE_URL;
    employee_image;
    leaveFilterForm: FormGroup;
    LeaveForm: FormGroup;
    halfDayError = false;
    mode = '';
    count = 0;
    msg = '';

    cancelForm: FormGroup;
    constructor(public router: Router,
        public userservice: UserService,
        public leavetypeservice: LeaveTypeService,
        private spinner: NgxSpinnerService,
        public leaveapplicationservice: LeaveapplicationService,
        private flashMessageService: FlashMessageService,
        private modalService: BsModalService,
        private _datePipe: DatePipe,
        private _fb: FormBuilder,
        private datatableService: DatatableService) {

    }

    ngOnInit() {
        this.IMAGE_URL = AppConstants.IMAGE_URL;
        this.employee_image = '../../../../assets/img/avatars/profile_image.jpg';
        this.emp_data = JSON.parse(StorageManagerService.getUser());
        this.leaveFilterForm = new FormGroup({
            'duration': new FormControl('all'),
            'status': new FormControl('all')
        });
        this.LeaveForm = this._fb.group({
            'leave_id': [null],
            'user_id': [null],
            'leave_date': [null, [Validators.required]],
            'leave_type': [null, [Validators.required]],
            'half_day': [false],
            'reason': [null, [Validators.required]]
        },
            {
                validator: ConfirmPasswordValidation.checkLeaveDate
            });
        this.cancelForm = new FormGroup({
            'cancel_reason': new FormControl('', [Validators.required])
        });
        this.getOtherData();
        this.getEmployeeleaves();
    }


    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    getEmployeeleaves = () => {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 15,
            lengthMenu: [5, 10, 25, 50],
            serverSide: true,
            processing: true,
            language: {
                searchPlaceholder: 'Search...',
                search: ''
            },
            // search: { search: this.leaveForm.get('status').value },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.columns[2].search.value = this.leaveFilterForm.get('duration').value;
                dataTablesParameters.columns[4].search.value = this.leaveFilterForm.get('status').value;
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getLeaveRequiredData').subscribe(resp => {
                    this.allcheck_id = false;
                    this.allcheck_id_count = 0;
                    this.AllLeaves = resp.data;
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
            { name: 'leavetype' },
            { name: 'leave_date' },
            { name: 'leave_count' },
            { name: 'status' }]
        };
    }

    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    getOtherData = () => {
        this.leaveapplicationservice.getSelfLeaveRequiredData(this.emp_data.id).subscribe((res) => {
            this.finalLeaves = res['finalLeaves'];
            this.userLeave = res['leaveByEmp'];
            this.leavetypes = res['leaveTypes'];
        });
    }

    checkboxHeader = (evt: Event)  => {
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
    }

    checkone = (id) => {
        this.allcheck_id = false;
        let selectId = '';
        this.allcheck_id_count = 0;
        for (let i = 0; i < this.AllLeaves.length; i++) {
            if (+id === +this.AllLeaves[i]['id']) {
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

    openModel = async (template, mode = '') => {
        this.leaveOpt = [];
        if (mode === 'edit') {
            this.mode = mode;
            this.LeaveForm.get('leave_id').setValue(this.leavedetail['id']);
            this.LeaveForm.get('leave_date').setValue(moment(this.leavedetail['leave_date']['date']).format());
            this.LeaveForm.get('leave_type').setValue(this.leavedetail['leave_type']['id']);
            this.LeaveForm.get('half_day').setValue(this.leavedetail['half_day']);
            this.LeaveForm.get('reason').setValue(this.leavedetail['reason']);
        }
        this.generateOpt();
        this.modalRef = this.modalService.show(template, { class: 'modal-lg' });

        // this.modalRef.config()
    }

    openDeleteModel = (template) => {
        this.modalRef = this.modalService.show(template);
    }
    openCancelModel = (template, id) => {
        this.cancelForm.reset();
        this.modalRef = this.modalService.show(template);
    }

    generateOpt = () => {
        this.leaveOpt = [];
        if (this.mode === 'edit') {
            for (const row of this.leavetypes) {
                if (row.leavetype === 'UPL') {
                    this.leaveOpt.push({
                        'id': +row.id,
                        'label': row.leavetype,
                        'available': ''
                    });
                } else {
                    if (this.count < 3) {
                        if (this.leavedetail['leave_type']['leavetype'] === row.leavetype) {
                            this.leaveOpt.push({
                                'id': +row.id,
                                'label': row.leavetype,
                                'available': this.userLeave[row.leavetype.toLowerCase()]
                            });
                        } else {
                            if (+this.userLeave[row.leavetype.toLowerCase()] > 0) {
                                this.leaveOpt.push({
                                    'id': +row.id,
                                    'label': row.leavetype,
                                    'available': this.userLeave[row.leavetype.toLowerCase()]
                                });
                            }
                        }
                    }
                }
            }
        } else {
            this.mode = '';
            for (const row of this.leavetypes) {
                if (row.leavetype === 'UPL') {
                    this.leaveOpt.push({
                        'id': +row.id,
                        'label': row.leavetype,
                        'available': ''
                    });
                } else {
                    if (this.count < 3) {
                        if (+this.userLeave[row.leavetype.toLowerCase()] > 0) {
                            this.leaveOpt.push({
                                'id': +row.id,
                                'label': row.leavetype,
                                'available': this.userLeave[row.leavetype.toLowerCase()]
                            });
                        }
                    }
                }
            }
        }
    }

    closeModel = () => {
        this.modalRef.hide();
        this.LeaveForm.reset();
        this.msg = '';
    }

    checkMonthLeave = () => {
        this.generateOpt();
    }

    onHalfDay = (value = '') => {
        const halfDayStatus = this.LeaveForm.get('half_day').value;
        const leave_id = this.LeaveForm.get('leave_type').value;
        let leavetype = '';
        let leavecount: number;
        for (const row of this.leavetypes) {
            if (+row.id === +leave_id) {
                leavetype = row.leavetype.toLowerCase();
                if (leavetype !== 'upl') {
                    leavecount = this.userLeave[leavetype];
                }
            }
        }
        if (leavetype) {
            if (this.mode === 'edit') {
                const old_leave_id = this.leavedetail['leave_type']['id'];
                if (+old_leave_id !== +leave_id) {
                    if (!halfDayStatus) {
                        if (leavecount <= 0.50) {
                            this.LeaveForm.get('leave_type').setErrors({ 'not_allowed': true });
                        } else {
                            this.LeaveForm.get('leave_type').setErrors(null);
                        }
                    } else {
                        this.LeaveForm.get('leave_type').setErrors(null);
                    }
                } else {
                    if (leavecount <= 0.50) {
                        if (!halfDayStatus) {
                            this.LeaveForm.get('leave_type').setErrors({ 'not_allowed': true });
                        } else {
                            this.LeaveForm.get('leave_type').setErrors(null);
                        }
                    }
                }
            } else {
                if (leavetype === 'upl') {
                    this.halfDayError = false;
                } else {
                    if (halfDayStatus) {
                        this.halfDayError = false;
                    } else {
                        if (leavecount < 1.00) {
                            this.halfDayError = true;
                        } else {
                            this.halfDayError = false;
                        }
                    }
                }
                if (this.halfDayError) {
                    this.LeaveForm.get('leave_type').setErrors({ 'not_allowed': true });
                } else {
                    this.LeaveForm.get('leave_type').setErrors(null);
                }
            }
        } else {
            this.LeaveForm.get('leave_type').setErrors({ 'required': true });
        }
    }

    SaveLeave = () => {
        if (this.LeaveForm.valid) {
            let leaveData = [];
            leaveData = this.LeaveForm.value;
            leaveData['user_id'] = this.emp_data.id;

            for (const row of this.leavetypes) {
                if (+row.id === +this.LeaveForm.get('leave_type').value) {
                    leaveData['leave_type'] = row;
                }
            }

            if (leaveData['leave_id']) {
                if (+leaveData['leave_type']['id'] !== +this.leavedetail['leave_type']['id']) {
                    for (const row of this.leavetypes) {
                        if (+row.id === +this.leavedetail['leave_type']['id']) {
                            leaveData['old_leave_type'] = row;
                        }
                    }
                }
            }

            leaveData['leave_date'] = this._datePipe.transform(leaveData['leave_date'], 'dd-MM-yyyy');

            if (leaveData['half_day']) {
                leaveData['leave_count'] = 0.5;
            } else {
                leaveData['leave_count'] = 1;
            }
            this.leaveapplicationservice.saveLeaveApplication(leaveData).subscribe(
                (res) => {
                    if (res === 'created') {
                        this.flashMessageService.pop('success', 'Leave Added', 'Leave Added Successfully');
                    } else if (res === 'updated') {
                        this.flashMessageService.pop('success', 'Leave Updated', 'Leave Updated Successfully');
                    } else {
                        this.flashMessageService.pop('danger', 'Error', 'Error occured');
                    }
                    this.allcheck_id_count = 0;
                    this.Leave_status = '';
                    this.closeModel();
                    this.rerender();
                    this.getOtherData();
                    this.LeaveForm.reset();
                }
            );
        }
    }

    DeleteLeave = () => {
        this.leaveapplicationservice.deleteLeaveApplication(this.leavedetail.id).subscribe(
            (res) => {
                if (res === 'deleted') {
                    this.flashMessageService.pop('Success', 'Deleted', 'Leave Deleted Successfully');
                } else {
                    this.flashMessageService.pop('danger', 'Error', 'Error occured');
                }
                this.allcheck_id_count = 0;
                this.closeModel();
                this.rerender();
            }
        );
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
}
