import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

import { CalendarEvent, CalendarEventAction } from 'angular-calendar'; // import should be from `angular-calendar` in your app

import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { DatePipe } from '@angular/common';

import { NgxSpinnerService } from 'ngx-spinner';
import { HolidayService } from '../../../shared/services/holiday.service';
import { LocationService } from '../../../shared/services/location.service';
import { AppConstants } from '../../../constants/app.constants';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { UserService } from '../../../shared/services/user.service';


@Component({
    templateUrl: 'self-calendar.component.html',
    styleUrls: ['./self-calendar.component.scss']
})

export class SelfCalendarComponent implements OnInit {
    current_year = (new Date()).getFullYear();
    view: any = 'month';
    batch_opt: any = [];
    selectedBatchData: any = [];
    workingDayArray: any = [];
    viewDate: Date = new Date();
    selectedYear = (new Date()).getFullYear();
    holidayData: any = [];
    IMAGE_URL;
    editEventArray: any = [];
    editStatus = false;
    allUsers: any = [];
    edit_id: any;
    afterChangeStatus = true;
    employee_image = '../../../assets/img/avatars/profile_image.jpg';
    emp_info: any = [];

    events: CalendarEvent[] = [];

    actions: CalendarEventAction[] = [];

    constructor(private holidayService: HolidayService,
        private locationService: LocationService,
        private userservice: UserService,
        public datepipe: DatePipe,
        private spinner: NgxSpinnerService) {
    }

    ngOnInit() {
        this.emp_info = JSON.parse(StorageManagerService.getUser());
        this.IMAGE_URL = AppConstants.IMAGE_URL;
        this.userservice.getAllUsersSelf().subscribe(
            (res) => {
                this.allUsers = res;
            }
        );
        this.getAllLocationOpt();
    }

    getAllLocationOpt = async () => {
        if (this.emp_info.batch_data) {
            this.selectedBatchData = this.emp_info.batch_data
        } else {
            this.selectedBatchData = await this.locationService.getUserBatch().toPromise();
        }
        this.holidayData = await this.holidayService.getHolidayData(this.selectedYear).toPromise();
        this.filterEmployeeHoliday();
        this.onSelectBatch();
    }

    onSelectBatch = () => {
        this.editStatus = false;
        this.events = [];
        const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        let selected_batch_days = [];
        this.workingDayArray = [];
        if (this.selectedBatchData['working_days']) {
            selected_batch_days = this.selectedBatchData['working_days'].split(',');
        }
        Object.keys(days).forEach(element => {
            if (selected_batch_days.indexOf(days[element]) > -1) {
                this.workingDayArray.push(element);
            }
        });
        this.selectedBatchData['work_days'] = this.workingDayArray;
        this.markHoliday(this.selectedBatchData, this.holidayData);
    }


    filterEmployeeHoliday = () => {
        Object.keys(this.holidayData).forEach(index => {
            if (this.holidayData[index].is_company_event) {
                if (this.holidayData[index].assoc_emp_id.length > 0) {
                    let flag = true;
                    for (const emp_id of this.holidayData[index].assoc_emp_id) {
                        if (+emp_id['id'] === +this.emp_info['id']) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        delete this.holidayData[index];
                    }
                }
            }
        });
        this.holidayData = this.holidayData.filter(function (val) { return val; });
    }

    markHoliday = (value: any, holidayData) => {
        const thisYear = this.selectedYear;
        const months = Array.apply(0, Array(12)).map(function (_, i) { return moment().year(thisYear).month(i).format('MM'); });
        if (holidayData.length > 0) {
            for (const day of holidayData) {
                if (day['is_company_event']) {
                    this.events.push({
                        start: new Date(day['start_date']['date']),
                        end: new Date(day['end_date']['date']),
                        title: day['event_name'],
                        cssClass: 'year-events',
                        id: day['id']
                    });
                } else {
                    this.events.push({
                        start: new Date(day['start_date']['date']),
                        end: new Date(day['end_date']['date']),
                        title: day['event_name'],
                        cssClass: 'year-festival',
                        id: day['id']
                    });
                }
            }
        }
        for (const month of months) {
            const selected = moment().year(thisYear).month(+month - 1);
            const newSat = selected.startOf('month').day('Saturday');
            const newMonth = newSat.month();
            let count = 0;
            if (+value['alt_sat'] === 1) {
                while (newMonth === newSat.month()) {
                    if (count % 2 === 0) {
                        this.events.push({
                            start: startOfDay(newSat._date),
                            end: startOfDay(newSat._date),
                            title: 'Saturday',
                            cssClass: 'custom-holiday'
                        });
                    }
                    newSat.add(7, 'd');
                    count++;
                }
            } else {
                if (!value['work_days'].includes('6')) {
                    while (newMonth === newSat.month()) {
                        // console.log(newSat._date);
                        this.events.push({
                            start: startOfDay(newSat._date),
                            end: startOfDay(newSat._date),
                            title: 'Saturday',
                            cssClass: 'custom-holiday'
                        });
                        newSat.add(7, 'd');
                    }
                }
            }
        }
        const sunday = moment().year(thisYear).month(0).date(1).day(0);
        const end = moment().year(thisYear).month(12).date(31).day(0);
        while (sunday.isBefore(end)) {
            if (sunday.year() === moment().year(thisYear).year()) {
                this.events.push({
                    start: startOfDay(sunday._date),
                    end: startOfDay(sunday._date),
                    title: 'Sunday',
                    cssClass: 'custom-holiday'
                    // actions: this.actions
                });
            }
            sunday.add(7, 'days');
        }
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

    today = (): void => {
        this.viewDate = new Date();
    }

    editYearEvent = (id) => {
        this.edit_id = id;
        this.editEventArray = {};
        Object.keys(this.holidayData).forEach(index => {
            if (+this.holidayData[index]['id'] === +id) {
                this.editEventArray = this.holidayData[index];
                this.editStatus = true;
            }
        });
        // this.editEventArray['start_date_formatted'] =
        //     this.datepipe.transform(this.editEventArray['start_date']['date'], 'MMMM dd, yyyy h:MM a');
        // this.editEventArray['end_date_formatted'] =
        //     this.datepipe.transform(this.editEventArray['end_date']['date'], 'MMMM dd, yyyy h:MM a');
        const arr = [];
        if (this.editEventArray.assoc_emp_id !== null) {
            Object.keys(this.editEventArray.assoc_emp_id).forEach(element => {
                Object.keys(this.allUsers).forEach(row => {
                    if (+this.editEventArray.assoc_emp_id[element].id === +this.allUsers[row].id) {
                        arr.push(this.allUsers[row]);
                    }
                });
            });
        }

        this.editEventArray['assoc_emp'] = arr;
    }

    editOtherHoliday = (days: any) => {
        this.editEventArray = {};
        this.editStatus = true;
        this.editEventArray['start_date'] = days['start'];
        this.editEventArray['end_date'] = days['end'];
        this.editEventArray['event_name'] = days['title'];
        return false;
    }
}
