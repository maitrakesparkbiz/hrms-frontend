import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { AppConstants } from "../../../../constants/app.constants";
import { DatatableService } from "../../../../shared/services/datatable.service";
import { CompanyProjectService } from "../../../../shared/services/company-project.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { PusherService } from "../../../../shared/services/pusher.sevice";
import { FlashMessageService } from "../../../../shared/services/flash-message.service";
import {UserService} from "../../../../shared/services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from 'moment';

@Component({
    selector: 'app-ba-tl-report',
    templateUrl: './ba-tl-report.component.html',
    styleUrls: ['./ba-tl-report.component.scss']
})

export class BaTlReportComponent implements OnInit {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    public daterange: any = {};
    startDate = moment().startOf('month');
    endDate = moment().endOf('month');


    projectForm: FormGroup;
    allcheck_id_count = 0;
    allProjects: any = [];
    projectDetails: any = [];
    jrBAs: any = [];
    FILE_URL = AppConstants.FILE_URL;
    IMAGE_URL = AppConstants.IMAGE_URL;
    modalRef: BsModalRef;
    actionType = '';
    promptMsg = '';
    employee_image = '../../../../assets/img/avatars/profile_image.jpg';
    all_users: any = [];
    all_project: any = [];
    empTimingRecord: any = [];
    empTimingRecordTime: any = [];
    display =false;

    searchData: any = {};

    public options: any = {
        locale: { format: 'DD/MM/YYYY' },
        alwaysShowCalendars: false,
        startDate: this.startDate,
        endDate: this.endDate,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    };
    constructor(private _fb: FormBuilder,
        private datatableService: DatatableService,
                private companyProjectService: CompanyProjectService,
                private modalService: BsModalService,
                private pusherService: PusherService,
                private userService: UserService,
                private msgService: FlashMessageService) {
    }

    ngOnInit() {
        this.projectForm = this._fb.group({
            'emp_id': [null],
            'project_id': [null],
        });
        this.userService.getAllUsersExceptHR().subscribe(
            (res: any) => {
                const arr = [];
                for (const data of res) {
                    arr.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
                }
                this.all_users = arr;
            }
        );
        this.companyProjectService.getAllProjectsList().subscribe(
            (res: any) => {
                const arr = [];
                for (const data of res) {
                    arr.push({ label: data.project_name, value: data.id });
                }
                this.all_project = arr;
            }
        );

        this.searchData['start_date'] = this.startDate.format();
        this.searchData['end_date'] = this.endDate.format();
    }
    selectedDate = (value: any, datepicker?: any) => {
        datepicker.start = value.start;
        datepicker.end = value.end;

        this.daterange.start = value.start;
        this.daterange.end = value.end;
        this.daterange.label = value.label;

        this.startDate = value.start;
        this.endDate = value.end;
        this.searchData['start_date'] = this.startDate.format();
        this.searchData['end_date'] = this.endDate.format();
        // this.getTeamByDate();
        // this.rerender();
    }
    // getReport = (event) =>
    // {
    //     if(event && event.value) {
    //         this.companyProjectService.getReportByEmp(event.value).subscribe(
    //             (res: any) => {
    //                 this.empTimingRecord = res['timing'][0];
    //                 this.empTimingRecordTime = res.timing[1];
    //
    //             }
    //         );
    //     }
    //     else {
    //         this.empTimingRecord = [];
    //     }
    // }

    getReport = () => {

        this.companyProjectService.getReportByEmp(this.projectForm.value,this.searchData).subscribe(
            (res: any) => {

                this.empTimingRecord = res['timing'][0];
                this.empTimingRecordTime = res.timing[1];
            }
        );

    }

}
