import {Component, ViewEncapsulation, OnInit, ViewChild, TemplateRef, ElementRef} from '@angular/core';
import {
    startOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addWeeks,
    subWeeks,
    addMonths,
    subMonths,
    addHours
} from 'date-fns';

import {CalendarEvent, CalendarEventAction} from 'angular-calendar'; // import should be from `angular-calendar` in your app

import {moment} from 'ngx-bootstrap/chronos/test/chain';
import {CloseScrollStrategy} from '@angular/cdk/overlay';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';

import {NgxSpinnerService} from 'ngx-spinner';
import {HolidayService} from '../../../shared/services/holiday.service';
import {LocationService} from '../../../shared/services/location.service';
import {UserService} from '../../../shared/services/user.service';
import {FlashMessageService} from '../../../shared/services/flash-message.service';
import {AppConstants} from '../../../constants/app.constants';
import {StorageManagerService} from '../../../shared/services/storage-manager.service';
import {
    OwlDateTimeComponent,
    DateTimeAdapter,
    OWL_DATE_TIME_FORMATS,
    OWL_DATE_TIME_LOCALE,
    OwlDateTimeFormats
} from 'ng-pick-datetime';
import {MomentDateTimeAdapter} from 'ng-pick-datetime-moment';
import {Moment} from 'moment';
import * as _moment from 'moment';
import {AttandanceService} from '../../../shared/services/attandance.service';

const moment1 = (_moment as any).default ? (_moment as any).default : _moment;

export const MY_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
    parseInput: 'MM/YYYY',
    fullPickerInput: 'l LT',
    datePickerInput: 'MM/YYYY',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};

@Component({
    selector: 'app-summary',
    templateUrl: 'summary.component.html',
    styleUrls: ['./summary.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    providers: [
        // `MomentDateTimeAdapter` and `OWL_MOMENT_DATE_TIME_FORMATS` can be automatically provided by importing
        // `OwlMomentDateTimeModule` in your applications root module. We provide it at the component level
        // here, due to limitations of our example generation script.
        {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},

        {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS},
    ],
})

export class SummaryComponent implements OnInit {
    modalRef: BsModalRef;
    selectedMonthYear: any;
    view: any = 'month';
    viewDate: Date = new Date();
    test_img = true;
    dropdownSettings = {};
    IMAGE_URL;
    checkInData: any = [];
    leaveData: any = [];
    allUsers: any = [];
    employee: any = [];
    employee_image = '../../../assets/img/avatars/profile_image.jpg';
    emp_info: any = [];
    selectForm: FormGroup;
    selectedData: any = [];
    events: CalendarEvent[] = [];
    afterChangeStatus = true;
    actions: CalendarEventAction[] = [];
    UserData: any = [];

    activeDayIsOpen = true;

    constructor(private attendanceService: AttandanceService,
                private modalService: BsModalService,
                private _fb: FormBuilder,
                private userservice: UserService,
                public datepipe: DatePipe,
                private msgService: FlashMessageService,
                private spinner: NgxSpinnerService) {
    }

    ngOnInit() {
        this.emp_info = JSON.parse(StorageManagerService.getUser());
        this.IMAGE_URL = AppConstants.IMAGE_URL;
        this.selectForm = this._fb.group({
            'emp_id': [],
            'year_month': [moment1()]
        });
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
        };
        this.UserData = this.userservice.all_users;
        if (this.UserData.length === 0) {
            this.getSetAllUsers();
        } else {
            const arr = [];
            for (const data of this.UserData) {
                arr.push({label: data.firstname + ' ' + data.lastname, value: data.id});
            }
            this.employee = arr;
        }
    }

    getSetAllUsers = async () => {
        const arr = [];
        this.UserData = await this.userservice.getSetAllUsers().toPromise();
        for (const data of this.UserData) {
            arr.push({label: data.firstname + ' ' + data.lastname, value: data.id});
        }
        this.employee = arr;
    }
    onChange = () => {
        const emp_id = this.selectForm.get('emp_id').value;
        const monthYear = this.selectForm.get('year_month').value;
        this.viewDate = new Date(monthYear);
        const data = {};
        data['emp_id'] = emp_id;
        data['month_year'] = monthYear.format('01-MM-YYYY');
        this.checkInData = [];
        this.events = [];
        if (data['emp_id'] && data['month_year']) {
            this.attendanceService.getEmpMonthYearData(data).subscribe(
                (res) => {
                    if (res !== null) {
                        // this.checkInData = res;
                        if (res['all_check_in_data']) {
                            this.checkInData = res['all_check_in_data'];
                        } else {
                            this.checkInData = [];
                        }
                        if (res['final_approve_leave']) {
                            this.leaveData = res['final_approve_leave'];
                        } else {
                            this.leaveData = [];
                        }
                        this.markAttendace();
                    }
                }
            );
        }
    }

    markAttendace = () => {
        if (this.checkInData.length > 0) {
            for (const row of this.checkInData) {
                if (row['check_out_time'] !== null) {
                    this.events.push({
                        start: new Date(row['check_in_time']['date']),
                        end: new Date(row['check_in_time']['date']),
                        title: 'Staffing Hours :' + row['staffing_hours'],
                        cssClass: 'staffing_hours',
                        id: row['id']
                    });
                } else {
                    this.events.push({
                        start: new Date(row['check_in_time']['date']),
                        end: new Date(row['check_in_time']['date']),
                        title: 'Yet to check out',
                        cssClass: 'check_out_pending',
                        id: row['id']
                    });
                }
                this.events.push({
                    start: new Date(row['check_in_time']['date']),
                    end: new Date(row['check_in_time']['date']),
                    title: 'Check In :' + moment(row['check_in_time']['date']).format('hh:mm'),
                    cssClass: 'check_in',
                    id: row['id'],
                    allDay: row['comments'].length > 0 ? true : false
                });
                if (row['breaks'].length > 0) {
                    for (const row2 of row['breaks']) {

                        this.events.push({
                            start: new Date(row2['break_in_time']['date']),
                            end: new Date(row2['break_in_time']['date']),
                            title: 'Break In :' + moment(row2['break_in_time']['date']).format('hh:mm'),
                            cssClass: 'break_in',
                            id: row2['id']
                        });
                        this.events.push({
                            start: new Date(row2['break_out_time']['date']),
                            end: new Date(row2['break_out_time']['date']),
                            title: 'Break Out :' + moment(row2['break_out_time']['date']).format('hh:mm'),
                            cssClass: 'break_out',
                            id: row2['id']
                        });
                    }
                }
                if (row['check_out_time'] !== null) {
                    this.events.push({
                        start: new Date(row['check_out_time']['date']),
                        end: new Date(row['check_out_time']['date']),
                        title: 'Check Out :' + moment(row['check_out_time']['date']).format('hh:mm'),
                        cssClass: 'check_out',
                        id: row['id']
                    });
                }
                if (row['red_mark']) {
                    this.events.push({
                        start: new Date(row['check_out_time']['date']),
                        end: new Date(row['check_out_time']['date']),
                        title: '',
                        cssClass: 'red_mark',
                        id: row['red_mark']
                    });
                }
            }
        }

        if (this.leaveData.length > 0) {
            for (const row of this.leaveData) {
                this.events.push({
                    start: new Date(row[0]['leave_date']['date']),
                    end: new Date(row[0]['leave_date']['date']),
                    title: row[0]['half_day'] == true ? 'Leave: Half Day (' + row['leavetype'] + ')' : 'Leave: Full Day (' + row['leavetype'] + ')',
                    cssClass: 'check_out_pending',
                    id: row['id']
                });
            }
        }

    }

    onCommentClick = (id, template: BsModalRef) => {
        let data = {};
        this.selectedData['data'] = [];
        this.selectedData['comments'] = [];
        for (const row of this.checkInData) {
            if (+row['id'] === +id) {
                data = row;
            }
        }
        this.selectedData['data'].push([{'type': 'Checked In'},
            {'time': moment(data['check_in_time']['date']).format('MMM Do, YYYY hh:mm A')}]);
        if (data['breaks'].length > 0) {
            Object.keys(data['breaks']).forEach(key => {
                this.selectedData['data'].push([
                    {'type': 'Breaked In'},
                    {'time': moment(data['breaks'][key]['break_in_time']['date']).format('MMM Do, YYYY hh:mm A')}
                ]);
                this.selectedData['data'].push([
                    {'type': 'Breaked Out'},
                    {'time': moment(data['breaks'][key]['break_out_time']['date']).format('MMM Do, YYYY hh:mm A')}
                ]);
            });
        }

        if (data['check_out_time'] !== null) {
            this.selectedData['data'].push([
                {'type': 'Checked Out'},
                {'time': moment(data['check_out_time']['date']).format('MMM Do, YYYY hh:mm A')}
            ]);
        }
        this.selectedData['comments'] = data['comments'].length > 0 ? data['comments'] : null;
        this.openModel(template);
    }

    openModel = (template) => {
        this.modalRef = this.modalService.show(template);
    }
    closeModel = () => {
        this.modalRef.hide();
    }


    increment = (): void => {
        const addFn: any = {
            day: addDays,
            week: addWeeks,
            month: addMonths
        }[this.view];

        this.viewDate = addFn(this.viewDate, 1);
    }

    decrement = (): void => {

        const subFn: any = {
            day: subDays,
            week: subWeeks,
            month: subMonths
        }[this.view];

        this.viewDate = subFn(this.viewDate, 1);

    }

    // today(): void {
    //     this.viewDate = new Date();
    // }

    dayClicked({date, events}: { date: Date, events: CalendarEvent[] }, template: TemplateRef<any>): void {
        // this.EventForm.reset();
        // this.EventForm.get('start_date').setValue(moment(date).format());
        // this.EventForm.get('end_date').setValue(moment(date).format());
        this.modalRef = this.modalService.show(template);
    }


    chosenYearHandler = (normalizedYear: Moment) => {
        const ctrlValue = this.selectForm.get('year_month').value;
        ctrlValue.year(normalizedYear.year());
        this.selectForm.get('year_month').setValue(ctrlValue);
    }

    chosenMonthHandler = (normalizedMonth: Moment, datepicker: OwlDateTimeComponent<Moment>) => {
        const ctrlValue = this.selectForm.get('year_month').value;
        ctrlValue.month(normalizedMonth.month());
        this.selectForm.get('year_month').setValue(ctrlValue);
        datepicker.close();
    }

    getNumberArray = (number) => {
        return  Array.from({ length: number }, (v, k) => k + 1);
    }

    onSubmit = () => {
    }

}
