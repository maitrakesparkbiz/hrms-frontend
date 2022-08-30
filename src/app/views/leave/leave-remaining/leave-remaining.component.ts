import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { LeaveTypeService } from '../../../shared/services/leave_type.service';
import { AppConstants } from '../../../constants/app.constants';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { LeaveapplicationService } from '../../../shared/services/leaveapplication.service';

@Component({
    selector: 'app-leaveremaining',
    templateUrl: './leave-remaining.component.html',
    styleUrls: ['./leave-remaining.component.scss']
})
export class LeaveRemainingComponent implements OnInit {
    employee;
    leavetypes: any = [];
    search;
    year;
    IMAGE_URL;
    leave: any = {};
    years = [];
    employee_image;
    active: number;
    @ViewChild('leaveList') leaveList: ElementRef;
    constructor(public userservice: UserService,
        private spinner: NgxSpinnerService,
        public leavetypeservice: LeaveTypeService,
        public leaveapplicationservice: LeaveapplicationService,
        public renderer2: Renderer2) {
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

        // this.leavetypeservice.getAllLeaveTypes().subscribe(res => {
        //     this.leavetypes = res;
        //     this.spinner.hide();
        // });
    }

    activateClass = (employee) => {
        employee.active = !employee.active;
    }

    EmployeeLeaveRemaining = (id) => {
        this.leave.user_id = id;
        // this.spinner.show();
        this.leavetypes = [];
        this.leaveapplicationservice.getLeaveByEmp(id).subscribe(
            (res) => {
                this.spinner.hide();
                if (res.length > 0) {
                    this.leavetypes.push({ 'leavetype': 'CL', 'count': res[0]['cl'] });
                    this.leavetypes.push({ 'leavetype': 'PL', 'count': res[0]['pl'] });
                    this.leavetypes.push({ 'leavetype': 'SL', 'count': res[0]['sl'] });
                } else {
                    this.leavetypes.push({ 'leavetype': 'CL', 'count': 0 });
                    this.leavetypes.push({ 'leavetype': 'PL', 'count': 0 });
                    this.leavetypes.push({ 'leavetype': 'SL', 'count': 0 });
                }
            }
        );
        // this.leaveapplicationservice.getLeaveApplication(this.leave).subscribe(res => {
        //     this.leavetypes = res;
        //     if (this.leavetypes) {
        //         for (let i = 0; i < this.leavetypes.length; i++) {
        //             if (this.leavetypes[i]['count'] < 0) {
        //                 this.leavetypes[i]['count'] = 0;
        //             }
        //         }
        //     }
        //     this.spinner.hide();
        // });
    }

    onClick = (index, emp_id: number = null) => {
        const native_child = this.leaveList.nativeElement.children[index];

        Object.keys(this.leaveList.nativeElement.children).forEach(element => {
            if (this.leaveList.nativeElement.children[element].classList.contains('active')) {
                this.renderer2.removeClass(this.leaveList.nativeElement.children[element], 'active');
            }
        });

        this.renderer2.addClass(native_child, 'active');
        if (emp_id) {
            this.EmployeeLeaveRemaining(emp_id);
        }
    }
}
