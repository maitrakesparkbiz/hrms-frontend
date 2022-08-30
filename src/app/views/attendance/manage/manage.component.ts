import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AttandanceService } from '../../../shared/services/attandance.service';
import { BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { DatePipe } from '@angular/common';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { AppConstants } from '../../../constants/app.constants';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../../shared/services/datatable.service';
import { OwlDateTimeFormats, DateTimeAdapter, OWL_DATE_TIME_LOCALE, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';

const moment1 = (moment as any).default ? (moment as any).default : moment;

export const MY_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
    parseInput: 'MM/YYYY',
    fullPickerInput: 'l LT',
    datePickerInput: 'DD/MM/YYYY',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};

@Component({
    selector: 'app-attendance-manage',
    templateUrl: 'manage.component.html',
    styleUrls: ['./manage.component.scss'],
    providers: [
        { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS },
    ],
})

export class ManageComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    IMAGE_URL;
    selectForm: FormGroup;
    search;
    allcheck_id;
    allcheck_id_count: any = 0;
    allAttn: any = [];
    attnDetail: any = [];
    employee_image = '';
    attn_date;
    other_data: any = [];
    constructor(private attendanceService: AttandanceService,
        private modalService: BsModalService,
        private _fb: FormBuilder,
        private userservice: UserService,
        public datepipe: DatePipe,
        private msgService: FlashMessageService,
        private spinner: NgxSpinnerService,
        public router: Router,
        private datatableService: DatatableService) {
    }

    ngOnInit() {
        this.employee_image = '../../../assets/img/avatars/profile_image.jpg';
        this.IMAGE_URL = AppConstants.IMAGE_URL;
        this.selectForm = this._fb.group({
            'attn_date': [moment1()]
        });
        if (this.attendanceService.choosedDate) {
            this.selectForm.get('attn_date').setValue(moment(this.attendanceService.choosedDate, 'DD/MM/YYYY'));
        }
        this.attn_date = this.selectForm.get('attn_date').value;
        this.attn_date = this.datepipe.transform(this.attn_date, 'dd-MM-yyyy');
        this.onChange();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    // onChange() {
    //     this.spinner.show();
    //     this.attn_date = this.selectForm.get('attn_date').value;
    //     this.attn_date = this.datepipe.transform(this.attn_date, 'dd-MM-yyyy');
    //      this.userservice.getAllUsersAttendance(this.attn_date).subscribe(
    //         (res) => {
    //             this.allAttn = res.data;
    //             this.other_data = res.other_data;
    //             this.allcheck_id_count = 0;
    //             this.spinner.hide();
    //         }
    //     );
    // }

    onChange = () => {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 50,
            lengthMenu: [5, 10, 25, 50],
            serverSide: true,
            processing: true,
            language: {
                searchPlaceholder: 'Search employee ...',
                search: ''
            },

            ajax: (dataTablesParameters: any, callback) => {
                this.datatableService.getTableDataAttn(dataTablesParameters, this.attn_date).subscribe(resp => {
                    this.allcheck_id = false;
                    this.allAttn = resp.data['data'];
                    this.other_data = resp.data['other_data'];
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
            { name: 'check_in_time' },
            { name: 'check_out_time' },
            { name: 'break_time', orderable: false },
            { name: 'working_time', orderable: false }]
        };
    }

    rerender = (): void => {
        this.attn_date = this.selectForm.get('attn_date').value;
        this.attn_date = this.datepipe.transform(this.attn_date, 'dd-MM-yyyy');
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
        });
    }

    checkboxHeader = (evt: Event) => {
        this.allcheck_id_count = 0;
        if (this.allcheck_id !== true) {
            for (let i = 0; i < this.allAttn.length; i++) {
                this.allAttn[i]['isSelected'] = true;
                this.allcheck_id_count++;
            }
        } else {
            for (let i = 0; i < this.allAttn.length; i++) {
                this.allAttn[i]['isSelected'] = false;
            }
        }
    }

    checkone = (id) => {
        this.allcheck_id = false;
        let selectId = '';
        this.allcheck_id_count = 0;
        this.attnDetail = [];
        for (let i = 0; i < this.allAttn.length; i++) {
            if (+id === +this.allAttn[i]['id']) {
                this.allAttn[i]['isSelected'] = !this.allAttn[i]['isSelected'];
                if (this.allAttn[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selectId = this.allAttn[i];
                }
            } else {
                this.allAttn[i]['isSelected'] = false;
            }
        }
        if (this.allcheck_id_count === 1) {
            this.attnDetail = selectId;
        }
    }

    onSubmit() { }

    openProfile = (id) => {
        this.router.navigate(['/self/profile/' + id]);
    }

    addAttn = () => {
        this.router.navigate(['/attendance/new-attendance/', this.attnDetail.id + '&' + btoa(this.attn_date)]);
        this.attendanceService.choosedEmp = this.attnDetail.name;
    }

    updateAttn = () => {
        this.router.navigate(['/attendance/mark-attendance/', this.attnDetail.attn_data.id + '&' + btoa(this.attn_date)]);
        this.attendanceService.choosedEmp = this.attnDetail.name;
    }

    // editAttn() {
    //     this.attendanceService.data_sub = [];
    //     if (this.attnDetail.attn_data) {
    //         this.router.navigate(['/attendance/mark-attendance/', this.attnDetail.attn_data.id + '&' + btoa(this.attn_date)]);
    //     } else {
    //         this.router.navigate(['/attendance/new-attendance/', this.attnDetail.id + '&' + btoa(this.attn_date)]);
    //     }
    // }

}


