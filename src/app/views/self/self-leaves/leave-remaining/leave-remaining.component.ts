import { Component, OnInit } from '@angular/core';
import { LeaveapplicationService } from '../../../../shared/services/leaveapplication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';

@Component({
    selector: 'app-leave-remaining',
    templateUrl: 'leave-remaining.component.html',
    styleUrls: ['./leave-remaining.component.scss']
})

export class LeaveRemainingComponent implements OnInit {
    search;
    emp_data: any = [];
    leavetypes: any = [];
    constructor(public leaveapplicationservice: LeaveapplicationService,
        private spinner: NgxSpinnerService) {

    }

    ngOnInit() {
        this.emp_data = JSON.parse(StorageManagerService.getUser());
        this.getEmpLeaveRemaining();
    }

    getEmpLeaveRemaining = () => {
        this.spinner.show();
        this.leaveapplicationservice.getLeaveByEmp(this.emp_data.id).subscribe(
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
    }
}
