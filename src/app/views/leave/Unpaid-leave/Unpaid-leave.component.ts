import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { LeaveTypeService } from '../../../shared/services/leave_type.service';
import { LeaveapplicationService } from '../../../shared/services/leaveapplication.service';
import { AppConstants } from '../../../constants/app.constants';
import { UserService } from '../../../shared/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

@Component({
    selector: 'app-unpaidleave',
    templateUrl: './Unpaid-leave.component.html',
    styleUrls: ['./Unpaid-leave.component.scss']
})
export class UnpaidLeaveComponent implements OnInit {
    employee;
    unpaidLeaves;
    search;
    year;
    IMAGE_URL;
    leave: any = {};
    years = [];
    employee_image;
    emp_id: number;
    selectedYear: number;
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    @ViewChild('leaveList') leaveList: ElementRef;
    constructor(public userservice: UserService,
        private spinner: NgxSpinnerService,
        public unpaidLeaveservice: LeaveTypeService,
        public leaveapplicationservice: LeaveapplicationService,
        public renderer2: Renderer2) {

        this.leave.year = +(moment(new Date()).format('YYYY'));
        this.selectedYear = this.leave.year;
        this.year = moment(new Date()).format('YYYY');
        const start_year = +this.year;
        for (let i = 0; i < 7; i++) {
            this.years[i] = start_year - i;
        }
    }

    ngOnInit() {
        this.IMAGE_URL = AppConstants.IMAGE_URL;
        this.employee_image = '../../../assets/img/avatars/profile_image.jpg';
        this.spinner.show();
        this.userservice.getAllUsers().subscribe(res => {
            this.employee = res.data;
            setTimeout(() => { this.onClick(0, this.employee[0].id); }, 1);
            this.spinner.hide();
            // console.log(this.employee);
        });
    }

    onClick = (index, emp_id: number = null) => {
        this.emp_id = emp_id;
        const native_child = this.leaveList.nativeElement.children[index];

        Object.keys(this.leaveList.nativeElement.children).forEach(element => {
            if (this.leaveList.nativeElement.children[element].classList.contains('active')) {
                this.renderer2.removeClass(this.leaveList.nativeElement.children[element], 'active');
            }
        });

        this.renderer2.addClass(native_child, 'active');
        if (emp_id) {
            this.EmployeeUnpaidLeaves(emp_id);
        }
    }

    EmployeeUnpaidLeaves = (id) => {
        this.unpaidLeaves = [];
        this.leaveapplicationservice.getEmpUPL(id).subscribe(res => {
            if (res.length > 0) {
                const leaveData = res;
                for (const month of this.months) {
                    let leaveCount = 0;
                    Object.keys(leaveData).forEach((index) => {
                        if (month === moment(leaveData[index].leave_date.date).format('MMMM') &&
                            +this.selectedYear === +moment(leaveData[index].leave_date.date).format('YYYY')) {
                            leaveCount += +leaveData[index]['leave_count'];
                            // delete leaveData[index];
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
        this.EmployeeUnpaidLeaves(this.emp_id);
    }
}
