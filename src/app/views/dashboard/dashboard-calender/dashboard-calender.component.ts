import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
import { DashboardService } from '../../../shared/services/dashboard.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-dashboard-calender',
    templateUrl: 'dashboard-calender.component.html',
    styleUrls: ['./dashboard-calender.component.scss']
})

export class DashboardCalenderComponent implements OnInit, OnDestroy {
    UpdatedData: any = [];
    current_year = (new Date()).getFullYear();
    view: any = 'month';
    viewDate: Date = new Date();
    selectedYear = (new Date()).getFullYear();
    IMAGE_URL;
    employee_image = '../../../assets/img/avatars/profile_image.jpg';
    leaveData: any = [];
    recentLeaves: any = [];
    events: CalendarEvent[] = [];
    actions: CalendarEventAction[] = [];
    changeStatus = false;
    updateDataSubject: Subscription;

    constructor(private dashboardService: DashboardService) {
    }

    ngOnInit() {
        // this.dashboardService.recentLeaves.subscribe(
        //     (res) => {
        //         this.recentLeaves = res['recentLeaves'];
        //         this.getYearMonthFinalLeaves();
        //     }
        // );
        this.getYearMonthFinalLeaves();

        this.updateDataSubject = this.dashboardService.updatedData.subscribe(
            () => {
                this.getYearMonthFinalLeaves();
            }
        );
    }

    getYearMonthFinalLeaves = () => {
        this.leaveData = [];
        this.dashboardService.getYearMonthFinalLeaves(moment(this.viewDate).format()).subscribe(
            (res) => {

                this.leaveData = res;
                this.markdays();
            }
        );
    }

    markdays = () => {
        this.changeStatus = false;
        this.events = [];
        for (const row of this.leaveData) {
            this.events.push({
                start: new Date(row[0]['leave_date']['date']),
                title: row['firstname'] + ' ' + row['lastname'],
                cssClass: row['isFinal'] ? 'final-leave-label' : 'pending-leave-label',
                id: row['id'],
                actions: row
            });
        }
        this.changeStatus = true;
    }

    increment = (): void  => {
        const addFn: any = {
            day: addDays,
            week: addWeeks,
            month: addMonths
        }[this.view];
        this.viewDate = addFn(this.viewDate, 1);
        this.getYearMonthFinalLeaves();
    }

    decrement = (): void  => {

        const subFn: any = {
            day: subDays,
            week: subWeeks,
            month: subMonths
        }[this.view];

        this.viewDate = subFn(this.viewDate, 1);
        this.getYearMonthFinalLeaves();
    }

    today = (): void => {
        this.viewDate = new Date();
    }

    ngOnDestroy() {
        this.updateDataSubject.unsubscribe();
    }
}
