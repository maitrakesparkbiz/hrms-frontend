import { Component, OnInit } from '@angular/core';

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
import { DashboardService } from '../../../../shared/services/dashboard.service';

import * as moment from 'moment';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';

@Component({
    selector: 'app-self-dashboard-calender',
    templateUrl: 'self-dashboard-calender.component.html',
    styleUrls: ['./self-dashboard-calender.component.scss']
})

export class SelfDashboardCalenderComponent implements OnInit {
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
    userId;
    changeStatus = false;


    constructor(private dashboardService: DashboardService) {
    }

    ngOnInit() {
        // this.dashboardService.recentLeaves.subscribe(
        //     (res) => {
        //         this.recentLeaves = res['recentLeaves'];
        //         this.getYearMonthFinalLeaves();
        //     }
        // );
        const userData = JSON.parse(StorageManagerService.getUser());
        this.userId = userData['id'];
        this.getYearMonthLeaves();
    }

    getYearMonthLeaves = () =>{
        this.leaveData = [];

        this.dashboardService.getLeavesSelfDashboard(moment(this.viewDate).format()).subscribe(
            (res) => {
                // this.leaveData = res;
                if(res['team_member'] == null)
                {
                    res['team_member'] = [];
                }
                this.leaveData = res['leader'].concat(res['team_member']);


                this.markdays();
            }
        );
    }

    markdays = () =>{
        this.changeStatus = false;
        this.events = [];
        for (const row of this.leaveData) {
            this.events.push({
                start: new Date(row[0]['leave_date']['date']),
                title: row['firstname'] + ' ' + row['lastname'],
                cssClass: (row[0]['status'] === 'Accept' ? 'approved-leave' : row[0]['status'] === 'Pending' ? 'pending-leave' : 'reject-leave'),
                id: row['id'],
                actions: row
            });
        }
        this.changeStatus = true;
    }

    increment = (): void => {
        const addFn: any = {
            day: addDays,
            week: addWeeks,
            month: addMonths
        }[this.view];
        this.viewDate = addFn(this.viewDate, 1);
        this.getYearMonthLeaves();
    }

    decrement = (): void => {

        const subFn: any = {
            day: subDays,
            week: subWeeks,
            month: subMonths
        }[this.view];

        this.viewDate = subFn(this.viewDate, 1);
        this.getYearMonthLeaves();
    }

    today = (): void => {
        this.viewDate = new Date();
    }
}
