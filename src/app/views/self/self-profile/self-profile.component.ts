import { Component, OnInit } from '@angular/core';
import { AppConstants } from '../../../constants/app.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { LocationService } from '../../../shared/services/location.service';
import { AppreciationService } from '../../../shared/services/appreciation.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

@Component({
    selector: 'app-self-profile',
    templateUrl: 'self-profile.component.html',
    styleUrls: ['./self-profile.component.scss']
})

export class SelfProfileComponent implements OnInit {
    IMAGE_URL;
    employee_image;
    employeedetail: any = [];
    appreciationData: any = [];
    tabStatus = true;
    dataStatus = false;
    edit_id;
    FILE_URL;
    constructor(private router: Router,
        private userservice: UserService,
        private appreciationService: AppreciationService,
        private activeRoute: ActivatedRoute,
        private spinner: NgxSpinnerService) { }

    async ngOnInit() {
        this.FILE_URL = AppConstants.FILE_URL;
        this.activeRoute.params.subscribe(params => {
            if (params) {
                this.edit_id = params['id'];
            }
        });

        this.IMAGE_URL = AppConstants.IMAGE_URL;
        this.employee_image = '../../../../assets/img/avatars/profile_image.jpg';

        if (!this.edit_id) {
            const emp_data = JSON.parse(StorageManagerService.getUser());
            this.edit_id = emp_data.id;
        }
        this.employeedetail = await this.userservice.getEmployeeById(this.edit_id).toPromise();
        this.appreciationData = await this.appreciationService.getAppreciationByEmp(this.edit_id).toPromise();
        if (this.employeedetail.joining_date) {
            // this.employeedetail.duration = moment(this.employeedetail.joining_date.date).fromNow();
            this.employeedetail.duration = this.getDuration(this.employeedetail.joining_date.date);
        }
        this.dataStatus = true;
    }


    getDuration = (joinDate) => {
        const b = moment(joinDate);
        const a = moment();

        const intervals: any = ['years', 'months', 'days'];
        const out: any = [];

        for (let i = 0; i < intervals.length; i++) {
            const diff = a.diff(b, intervals[i]);
            b.add(diff, intervals[i]);
            if (+diff !== 0) {
                if (+diff > 1) {
                    out.push(diff + ' ' + intervals[i]);
                } else {
                    out.push(diff + ' ' + intervals[i].slice(0, -1));
                }
            }
        }
        if (out.length > 0) {
            return out.join(', ') + ' ago';
        }
        return '';
    }


    onTabClick = (mode) => {
        if (mode === 1) {
            this.tabStatus = true;
        } else {
            this.tabStatus = false;
        }
    }

    onEditBtn = () => {
        this.activeRoute.params.subscribe(params => {
            if (params.id !== undefined) {
                this.router.navigate(['/employee/update/' + params.id]);
            } else {
                this.router.navigate(['/self/profile/edit']);
            }
        });
    }
}
