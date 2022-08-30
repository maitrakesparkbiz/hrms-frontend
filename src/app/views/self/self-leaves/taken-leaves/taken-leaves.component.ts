import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { LeaveTypeService } from '../../../../shared/services/leave_type.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LeaveapplicationService } from '../../../../shared/services/leaveapplication.service';
import { DatePipe } from '@angular/common';
import { UniqueemailValidator } from '../../../../validators/uniqueemail.validator';
import { AppConstants } from '../../../../constants/app.constants';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../../../shared/services/datatable.service';
@Component({
    selector: 'app-taken-leaves',
    templateUrl: 'taken-leaves.component.html',
    styleUrls: ['./taken-leaves.component.scss']
})

export class TakenLeavesComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    AllLeaves: any = [];
    selectedResult: any = [];
    search;
    allcheck_id;
    leavedetail: any = {};
    leavetypes: any = [];
    userLeave: any = [];
    leaveOpt: any = [];
    emp_data: any = [];
    leave_edit;
    Leave_status;
    allcheck_id_count: any = 0;
    IMAGE_URL;
    employee_image;
    leaveFilterForm: FormGroup;
    leaveCount: any = 0;

    constructor(public userservice: UserService,
        public leavetypeservice: LeaveTypeService,
        private spinner: NgxSpinnerService,
        public leaveapplicationservice: LeaveapplicationService,
        private _datePipe: DatePipe,
        private datatableService: DatatableService) {

    }

    ngOnInit() {
        this.IMAGE_URL = AppConstants.IMAGE_URL;
        this.employee_image = '../../../../assets/img/avatars/profile_image.jpg';
        this.leaveFilterForm = new FormGroup({
            'duration': new FormControl('all')
        });
        this.emp_data = JSON.parse(StorageManagerService.getUser());
        this.getEmpFinalLeaves();
        this.getEmpLeaveRemaining();
    }

    getEmpLeaveRemaining = () => {
        this.leaveapplicationservice.getLeaveByEmp(this.emp_data.id).subscribe(
            (res) => {
                if (res.length > 0) {
                    this.leavetypes['cl'] = res[0]['cl'];
                    this.leavetypes['pl'] = res[0]['pl'];
                    this.leavetypes['sl'] = res[0]['sl'];
                } else {
                    this.leavetypes['cl'] = 0;
                    this.leavetypes['pl'] = 0;
                    this.leavetypes['sl'] = 0;
                }
            }
        );

    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    // getEmpFinalLeaves() {
    //     this.spinner.show();
    //     this.leaveapplicationservice.getEmpFinalLeaves(this.emp_data.id).subscribe(
    //         (res) => {
    //             this.AllLeaves = res;
    //             for (let i = 0; i < this.AllLeaves.length; i++) {
    //                 this.AllLeaves[i].firstname = this.AllLeaves[i].user_id['firstname'] + ' ' + this.AllLeaves[i].user_id['lastname'];
    //                 this.AllLeaves[i].profile_image = this.AllLeaves[i].user_id['profile_image'];
    //                 this.AllLeaves[i].leave_date = moment(this.AllLeaves[i].leave_date.date).format('MMM D YYYY');
    //                 this.leaveCount += +this.AllLeaves[i].leave_count;
    //             }
    //             this.selectedResult = this.AllLeaves;
    //             this.spinner.hide();
    //         }
    //     );
    // }

    getEmpFinalLeaves = () => {
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getEmpAllTakenLeaves').subscribe(resp => {
                    this.allcheck_id = false;
                    this.allcheck_id_count = 0;
                    this.AllLeaves = resp.data['leaves'];
                    this.leaveCount = resp.data['total_leaves'];
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
            { name: 'status', orderable: false }]
        };
    }


    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
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
        // let tempCount = 0;
        for (let i = 0; i < this.AllLeaves.length; i++) {
            if (+id === +this.AllLeaves[i]['id']) {
                this.AllLeaves[i]['isSelected'] = !this.AllLeaves[i]['isSelected'];
                if (this.AllLeaves[i]['isSelected']) {
                    this.Leave_status = this.AllLeaves[i]['status'];
                    this.allcheck_id_count++;
                    selectId = this.AllLeaves[i];
                }
            } else {
                this.AllLeaves[i]['isSelected'] = false;
                // if (this.allTeams[i]['isSelected']) {
                //     selectId = this.allTeams[i];
                //     this.allcheck_id_count++;
                // }
            }
            // if (this.allTeams[i]['isSelected']) {
            //     tempCount++;
            // }
        }
        // if (tempCount === this.allTeams.length) {
        //     this.allcheck_id = true;
        // }
        if (this.allcheck_id_count === 1) {
            this.getLeaveDetail(selectId);
        }
    }

    // checkone(id) {
    //     this.allcheck_id = false;
    //     let selectId = '';
    //     this.allcheck_id_count = 0;
    //     setTimeout(() => {
    //         for (let i = 0; i < this.AllLeaves.length; i++) {
    //             if (+this.AllLeaves[i]['id'] === +id) {
    //                 if (this.AllLeaves[i]['isSelected']) {
    //                     this.Leave_status = this.AllLeaves[i]['status'];
    //                     this.allcheck_id_count++;
    //                     selectId = this.AllLeaves[i];
    //                 }
    //             } else {
    //                 this.AllLeaves[i]['isSelected'] = false;
    //             }
    //         }
    //         if (this.allcheck_id_count === 1) {
    //             this.getLeaveDetail(selectId);
    //         }
    //     }, 10);
    // }

    getLeaveDetail = (detail) => {
        this.leavedetail = detail;
        //  console.log(this.leavedetail);
    }


    getSelectedData = () => {
        const tempArray: any[] = [];
        switch (this.leaveFilterForm.get('duration').value) {
            case 'all':
                for (let i = 0; i < this.AllLeaves.length; i++) {
                    tempArray.push(this.AllLeaves[i]);
                }
                break;
            case 'last_30_days':
                const last_30_days = (moment().subtract(30, 'days').format('MMM D YYYY'));
                for (let i = 0; i < this.AllLeaves.length; i++) {
                    if (moment(this.AllLeaves[i]['leave_date']).isSameOrAfter(last_30_days)) {
                        tempArray.push(this.AllLeaves[i]);
                    }
                }
                break;


            case 'last_3_months':
                const last_3_months = (moment().subtract(3, 'month').format('MMM  YYYY'));
                for (let i = 0; i < this.AllLeaves.length; i++) {
                    if (moment(this.AllLeaves[i]['leave_date']).isSameOrAfter(last_3_months)) {
                        tempArray.push(this.AllLeaves[i]);
                    }
                }
                break;
            case 'last_year':
                const last_year = (moment().subtract(1, 'year').format('MMM YYYY'));
                for (let i = 0; i < this.AllLeaves.length; i++) {
                    if (moment(this.AllLeaves[i]['leave_date']).isSameOrBefore(last_year)) {
                        tempArray.push(this.AllLeaves[i]);
                    }
                }
                break;

            case 'this_month':
                const leave_date = (moment().startOf('month').format('MMM D YYYY'));
                const last_date = (moment().endOf('month').format('MMM D YYYY'));
                for (let i = 0; i < this.AllLeaves.length; i++) {
                    if (moment(this.AllLeaves[i]['leave_date']).isBetween(leave_date, last_date)) {
                        tempArray.push(this.AllLeaves[i]);
                    }
                }
                break;


            case 'last_6_months':
                const last_6_months = (moment().subtract(6, 'month').format('MMM  YYYY'));
                for (let i = 0; i < this.AllLeaves.length; i++) {
                    if (moment(this.AllLeaves[i]['leave_date']).isSameOrAfter(last_6_months)) {
                        tempArray.push(this.AllLeaves[i]);
                    }
                }
                break;
        }
        this.selectedResult = tempArray;
        // const afterSelectedDurationTempArray: any[] = [];

        // switch (this.leaveFilterForm.get('status').value) {
        //     case 'all':
        //         for (let i = 0; i < tempArray.length; i++) {
        //             afterSelectedDurationTempArray.push(tempArray[i]);
        //         }

        //         break;
        //     case 'Accept':
        //         for (let i = 0; i < tempArray.length; i++) {
        //             if (tempArray[i]['status'] === 'Accept') {
        //                 afterSelectedDurationTempArray.push(tempArray[i]);
        //             }
        //         }
        //         break;
        //     case 'Reject':
        //         for (let i = 0; i < tempArray.length; i++) {
        //             if (tempArray[i]['status'] === 'Reject') {
        //                 afterSelectedDurationTempArray.push(tempArray[i]);
        //             }
        //         }
        //         break;
        //     case 'Pending':
        //         for (let i = 0; i < tempArray.length; i++) {
        //             if (tempArray[i]['status'] === 'Pending') {
        //                 afterSelectedDurationTempArray.push(tempArray[i]);
        //             }
        //         }
        //         break;
        // }

        // this.selectedResult = afterSelectedDurationTempArray;
    }

}
