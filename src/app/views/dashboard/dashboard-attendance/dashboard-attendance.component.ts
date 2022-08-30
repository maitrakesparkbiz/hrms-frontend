import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { AppConstants } from '../../../constants/app.constants';

@Component({
    selector: 'app-dashboard-attendance',
    templateUrl: 'dashboard-attendance.component.html',
    styleUrls: ['./dashboard-attendance.component.scss']
})

export class DashboardAttendanceComponent implements OnInit {
    allAttn: any = [];
    employee_image;
    IMAGE_URL = AppConstants.IMAGE_URL;
    presentCount = 0;
    notMarkedCount = 0;
    constructor(private dashboardService: DashboardService) {

    }

    ngOnInit() {
        this.getAttendanceDashboard();
    }

    getAttendanceDashboard = () => {
        this.employee_image = '../../../../assets/img/avatars/profile_image.jpg';
        this.dashboardService.getAttendanceDashboard().subscribe(
            (res) => {
                this.allAttn = res;
                for (const attn of this.allAttn) {
                    if (attn.check_in_id) {
                        this.presentCount++;
                    } else {
                        this.notMarkedCount++;
                    }
                }
            }
        );
    }
}
