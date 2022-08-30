import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { AppConstants } from '../../../constants/app.constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExpenseService } from '../../../shared/services/expense.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { HttpClient } from '@angular/common/http';
import { DatatableService } from '../../../shared/services/datatable.service';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import {FormGroup, FormControl, FormArray, Validators, FormBuilder} from '@angular/forms';
import * as moment from 'moment'
import {CompanyProjectService} from "../../../shared/services/company-project.service";
import {Location} from "@angular/common";
import {EmployeeTimingsService} from "../../../shared/services/employee-timings.service";


@Component({
    selector: 'app-self-timings',
    templateUrl: 'self-timings.component.html',
    styleUrls: ['./self-timings.component.scss']
})

export class SelfTimingsComponent implements OnInit {

    projectForm: FormGroup;
    timing_date = moment().format('YYYY-MM-DD');
    all_project: any = [];
    userData: any = [];

    public searchTxt: any;

    empTimingRecord: any = [];
    empTimingRecordTime: any = [];
    constructor(
        private _fb: FormBuilder,
        public router: Router,
        private spinner: NgxSpinnerService,
        private expenseservice: ExpenseService,
        private flashMessageService: FlashMessageService,
        private modalService: BsModalService,
        private httpclient: HttpClient,
        private location: Location,
        private msgService: FlashMessageService,
        private companyProjectService:CompanyProjectService,
        private empTimingService: EmployeeTimingsService,
        private datatableService: DatatableService) {
    }

    ngOnInit() {
        this.projectForm = this._fb.group({
            'searchTxt': [''],
            'record_timing': this._fb.array([])
        });
        this.userData = JSON.parse(StorageManagerService.getUser());

        this.companyProjectService.getAllProjectsList().subscribe(
            (res: any) => {
                const arr = [];
                for (const data of res) {
                    arr.push({ label: data.project_name, value: data.id });
                }
                this.all_project = arr;
            }
        );
        this.projectForm.get('searchTxt').valueChanges.subscribe((val) => {
            this.searchTxt = val;
        });

        this.getTimings();

    }
    getTimings = () => {
        this.empTimingService.getEmpTimingRecordsById(+this.userData.id).subscribe(
            (res: any) => {
                console.log(res);
                this.empTimingRecord = res.timing[0];
                this.empTimingRecordTime = res.timing[1];
            });
    }

    initAddress = () => {
        return this._fb.group({
            emp_id: [+this.userData.id],
            record_date: [null],
            project_id: [null, Validators.required],
            record_hours: ['', [Validators.max(12), Validators.required]],
            comment: ['']
        });
    }
    removeFormArray = () => {
        const control = <FormArray>this.projectForm.controls['record_timing'];
        while (control.length !== 0) {
            control.removeAt(0)
        }
    }
    addAddress = () => {
        const control = <FormArray>this.projectForm.controls['record_timing'];
        control.push(this.initAddress());
    }

    removeAddress = (i: number) => {
        const control = <FormArray>this.projectForm.controls['record_timing'];
        control.removeAt(i);
    }
    saveTimings = ()=>{
        if (this.projectForm.valid) {
            this.empTimingService.saveEmpTimings(this.projectForm.value).subscribe(
                (res:any) =>{

                    if (res.res === 'created') {
                        this.msgService.pop('success', 'Timing Inserted', 'Inserted Successfully');
                        this.removeFormArray();
                        this.getTimings();
                    }else {
                        this.msgService.pop('danger', 'Error Occured', 'Error Occured');
                    }
            }
            );

        }
    }
    onBack = () => {
        this.location.back();
    }


}
