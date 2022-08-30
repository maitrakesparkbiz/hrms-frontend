import { Component, OnInit } from '@angular/core';
import { LeaveapplicationService } from '../../../../shared/services/leaveapplication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';
@Component({
    selector: 'app-unpaid-leaves',
    templateUrl: 'unpaid-leaves.component.html',
    styleUrls: ['./unpaid-leaves.component.scss']
})

export class UnpaidLeavesComponent implements OnInit {
    unpaidLeaves;
    search;
    year;
    leave: any = {};
    years = [];
    selectedYear: number;
    emp_data: any = [];
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    constructor(private spinner: NgxSpinnerService,
        public leaveapplicationservice: LeaveapplicationService) { }

    ngOnInit() {
        this.leave.year = +(moment(new Date()).format('YYYY'));
        this.selectedYear = this.leave.year;
        this.year = moment(new Date()).format('YYYY');
        const start_year = +this.year;
        for (let i = 0; i < 7; i++) {
            this.years[i] = start_year - i;
        }
        this.emp_data = JSON.parse(StorageManagerService.getUser());
        this.EmployeeUnpaidLeaves();
    }

    EmployeeUnpaidLeaves = () => {
        this.unpaidLeaves = [];
        this.leaveapplicationservice.getEmpUPL(this.emp_data.id).subscribe(res => {
            if (res.length > 0) {
                const leaveData = res;
                for (const month of this.months) {
                    let leaveCount = 0;
                    Object.keys(leaveData).forEach((index) => {
                        if (month === moment(leaveData[index].leave_date.date).format('MMMM') &&
                            +this.selectedYear === +moment(leaveData[index].leave_date.date).format('YYYY')) {
                            leaveCount += +leaveData[index]['leave_count'];
                        }
                    });
                    this.unpaidLeaves.push({ 'month': month, 'leave_count': leaveCount });
                }
            } else {
                Object.keys(this.months).forEach((index) => {
                    this.unpaidLeaves.push({ 'month': this.months[index], 'leave_count': 0 });
                });
            }
            // this.unpaidLeaves = res;
        });
    }

    loaduserYear = (year) => {
        this.selectedYear = year;
        this.EmployeeUnpaidLeaves();
    }
}
