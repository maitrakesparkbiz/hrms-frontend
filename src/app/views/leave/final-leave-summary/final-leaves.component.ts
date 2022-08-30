import {Component, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AppConstants} from '../../../constants/app.constants';
import {LeaveapplicationService} from '../../../shared/services/leaveapplication.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FlashMessageService} from '../../../shared/services/flash-message.service';
import * as moment from 'moment';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {LeaveTypeService} from '../../../shared/services/leave_type.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {DatatableService} from '../../../shared/services/datatable.service';

@Component({
    selector: 'app-final-leaves',
    templateUrl: 'final-leaves.component.html',
    styleUrls: ['./final-leaves.component.scss']
})

export class FinalLeavesComponent implements OnInit, AfterViewInit, OnDestroy {
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
    leave_edit;
    Leave_status;
    allcheck_id_count: any = 0;
    LeaveEditForm: FormGroup;
    IMAGE_URL = AppConstants.IMAGE_URL;
    userLeave;
    halfDayError = false;
    leaveOpt: any = [];
    leavetypes: any = [];
    count = 0;
    employee_image = '../../../../assets/img/avatars/profile_image.jpg';
    msg = '';
    rejectForm: FormGroup;
    leaveForm: FormGroup;

    constructor(private leaveService: LeaveapplicationService,
                private spinner: NgxSpinnerService,
                private modalService: BsModalService,
                private flashMessageService: FlashMessageService,
                private _fb: FormBuilder,
                private leavetypeservice: LeaveTypeService,
                private datatableService: DatatableService) {
    }

    ngOnInit() {
        this.LeaveEditForm = this._fb.group({
            'user_id': [],
            'leave_date': [],
            'leave_type': [null, [Validators.required]],
            'half_day': [],
            'reason': [],
        });
        this.rejectForm = new FormGroup({
            'reject_reason': new FormControl('')
        });
        this.leaveForm = new FormGroup({
            'duration': new FormControl('all'),
        });
        this.leavetypeservice.getAllLeaveTypes().subscribe(res => {
            this.leavetypes = res;
        });

        this.getLeaves();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    // getLeaves() {
    //     this.spinner.show();
    //     this.leaveService.getAllApprovedLeaves().subscribe(
    //         (res) => {
    //             if (res !== null) {
    //                 this.allcheck_id_count = 0;
    //                 this.AllLeaves = res;
    //                 for (let i = 0; i < this.AllLeaves.length; i++) {
    //                     this.AllLeaves[i].firstname = this.AllLeaves[i].user_id['firstname'] + ' '
    //                          + this.AllLeaves[i].user_id['lastname'];
    //                     this.AllLeaves[i].profile_image = this.AllLeaves[i].user_id['profile_image'];
    //                     this.AllLeaves[i].leave_date = moment(this.AllLeaves[i].leave_date.date).format('MMM D YYYY');
    //                 }
    //                 this.selectedResult = this.AllLeaves;
    //                 this.spinner.hide();
    //             }
    //         }
    //     );
    // }


    getLeaves = () => {
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllApprovedLeaves').subscribe(resp => {
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
            columns: [{name: 'id', orderable: false},
                {name: 'firstname'},
                {name: 'leave_date'},
                {name: 'reason'},
                {name: 'status', orderable: false}]
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

    getLeaveDetail = (leavedetail) => {
        this.leavedetail = leavedetail;
    }

    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    getSelectedData = () => {
        this.rerender();
    }
    // getSelectedData(opt) {
    //     const tempArray: any[] = [];
    //     switch (opt) {
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

    //     this.selectedResult = tempArray;
    // }

    openModel = (template) => {
        this.rejectForm.reset();
        this.modalRef = this.modalService.show(template);
    }

    closeModel = () => {
        this.LeaveEditForm.reset();
        this.halfDayError = false;
        this.modalRef.hide();
    }

    editLeave = async (template) => {
        this.leaveOpt = [];
        this.modalRef = this.modalService.show(template);
        this.userLeave = await this.leaveService.getLeaveByEmp(this.leavedetail['user_id']['id']).toPromise();
        if (this.userLeave) {
            this.userLeave = this.userLeave[0];
        }
        // this.LeaveEditForm.get('half_day').setAsyncValidators(
        //     [UniqueemailValidator.checkHalfDay(userLeave[this.leavedetail['leave_type']['leavetype'].toLowerCase()])]);
        this.LeaveEditForm.get('user_id').setValue(this.leavedetail['firstname']);
        this.LeaveEditForm.get('leave_date').setValue(this.leavedetail['leave_date']);
        if (this.leavedetail['leave_type']['leavetype'] === 'UPL') {
            this.LeaveEditForm.get('leave_type').setValue(this.leavedetail['leave_type']['leavetype']);
        } else {
            this.LeaveEditForm.get('leave_type').setValue(this.leavedetail['leave_type']['leavetype'] + ' - '
                + this.userLeave[this.leavedetail['leave_type']['leavetype'].toLowerCase()]);
        }
        this.LeaveEditForm.get('half_day').setValue(this.leavedetail['half_day']);
        this.LeaveEditForm.get('reason').setValue(this.leavedetail['reason']);

        const selectedMonth = moment(this.leavedetail['leave_date']).month();
        const selectedYear = moment(this.leavedetail['leave_date']).year();
        const selectedUser = this.leavedetail['user_id']['id'];
        for (const row of this.AllLeaves) {
            if (+row['user_id']['id'] === +selectedUser) {
                if (selectedMonth === moment(row['leave_date']).month() &&
                    selectedYear === moment(row['leave_date']).year()) {
                    if (row.leave_type.leavetype === 'CL' || row.leave_type.leavetype === 'PL') {
                        this.count += +row.leave_count;
                    }
                }
            }
        }

        for (const row of this.leavetypes) {
            if (row.leavetype === 'UPL') {
                this.leaveOpt.push({
                    'id': row.id,
                    'label': row.leavetype,
                    'available': ''
                });
            } else {
                if (this.count < 3) {
                    if (+this.userLeave[row.leavetype.toLowerCase()] > 0.5) {
                        this.leaveOpt.push({
                            'id': row.id,
                            'label': row.leavetype,
                            'available': this.userLeave[row.leavetype.toLowerCase()]
                        });
                    }
                }
            }
        }
    }

    onHalfDay = () => {
        const half_day = this.LeaveEditForm.get('half_day').value;
        if (!half_day) {
            if (+this.userLeave[this.leavedetail['leave_type']['leavetype'].toLowerCase()] === 0.00) {
                this.LeaveEditForm.get('leave_type').reset();
                this.LeaveEditForm.get('leave_type').setValue(null);
                this.halfDayError = true;
            }
        } else {
            if (this.leavedetail['leave_type']['leavetype'] === 'UPL') {
                this.LeaveEditForm.get('leave_type').setValue(this.leavedetail['leave_type']['leavetype']);
            } else {
                this.LeaveEditForm.get('leave_type').setValue(this.leavedetail['leave_type']['leavetype'] + ' - '
                    + this.userLeave[this.leavedetail['leave_type']['leavetype'].toLowerCase()]);
            }
            this.halfDayError = false;
        }

        if (this.halfDayError) {
            if (this.count >= 3) {
                this.msg = 'Selected employee has already taken 3 CL/PL in this month, So only Unpaid Leaves are applicable';
            } else {
                this.msg = '';
            }
        } else {
            this.msg = '';
        }
    }

    SaveLeave = () => {
        if (this.LeaveEditForm.valid) {
            const leaveData = {};
            if (this.halfDayError) {
                for (const row of this.leavetypes) {
                    if (+row.id === +this.LeaveEditForm.get('leave_type').value) {
                        leaveData['new_leave_type'] = row;
                    }
                }
                leaveData['old_leave_type'] = this.leavedetail['leave_type']['leavetype'];
            } else {
                leaveData['leavetype'] = this.leavedetail['leave_type']['leavetype'];
            }
            leaveData['half_day'] = this.LeaveEditForm.get('half_day').value;
            leaveData['user_id'] = this.leavedetail['user_id']['id'];
            leaveData['id'] = this.leavedetail['id'];
            if (this.leavedetail['half_day'] === leaveData['half_day']) {
                this.flashMessageService.pop('success', 'Updated', 'Leave Updated Successfully');
                this.closeModel();
                this.getLeaves();
            } else {
                if (this.leavedetail['half_day']) {
                    leaveData['leave_count'] = 1;
                } else {
                    leaveData['leave_count'] = 0.5;
                }
                this.leaveService.updateFinalLeave(leaveData).subscribe(
                    (res) => {
                        if (res === 'updated') {
                            this.flashMessageService.pop('success', 'Updated', 'Leave Updated Successfully');
                            this.closeModel();
                            this.getLeaves();
                        } else {
                            this.flashMessageService.pop('danger', 'Error', 'Error Occured');
                            this.closeModel();
                            this.getLeaves();
                        }
                    }
                );
            }
        }
    }

    RejectLeave = () => {
        this.leave_edit = [];
        this.leave_edit = this.AllLeaves;
        this.closeModel();
        for (let i = 0; i < this.AllLeaves.length; i++) {
            if (this.leave_edit[i]['isSelected']) {
                let leaveData = [];
                leaveData = this.leave_edit[i];
                leaveData['reject_reason'] = this.rejectForm.get('reject_reason').value;
                this.leaveService.finalRejectLeave(leaveData).subscribe(res => {
                    if (res === 'updated') {
                        this.flashMessageService.pop('error', 'Leave Deleted', 'Delete Leave');
                    }
                    if (res === 'error') {
                        this.rerender();
                    }
                    this.allcheck_id_count = 0;
                    this.rerender();
                });
            }
        }
    }
}
