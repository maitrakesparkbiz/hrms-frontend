import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlashMessageService } from '../../../../shared/services/flash-message.service';
import { JobsService } from '../../../../shared/services/jobs.service';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';
import * as moment from 'moment';
import { AppConstants } from '../../../../constants/app.constants';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { DatatableService } from '../../../../shared/services/datatable.service';

@Component({
    selector: 'app-self-job-applications',
    templateUrl: 'job-applications.component.html',
    styleUrls: ['./job-applications.component.scss']
})

export class JobApplicationsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    search;
    allcheck_id;
    allcheck_id_count: any = 0;
    modalRef: BsModalRef;
    applications: any = [];
    selectedApplication: any = [];
    FILE_URL = AppConstants.FILE_URL;
    selectedResult;
    filterForm: FormGroup;

    constructor(private jobsService: JobsService,
        private modalService: BsModalService,
        public flashMessageService: FlashMessageService,
        public spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private datatableService: DatatableService) {
    }

    ngOnInit() {
        const emp_data = JSON.parse(StorageManagerService.getUser());
        this.filterForm = new FormGroup({
            'status': new FormControl('all')
        });
        this.getApplicationByEmpId();
        // this.spinner.show();
        // this.jobsService.getApplicationByEmpId(emp_data.id).subscribe(
        //     (res) => {
        //         this.spinner.hide();
        //         this.applications = res;
        //         this.applications.forEach(element => {
        //             element['name'] = element[0]['applicant_name'];
        //             element['created_at'] = moment(element[0].created_at.date).format('MMM D,Y');
        //         });
        //         this.selectedResult = this.applications;
        //     }
        // );
    }

    getApplicationByEmpId = () => {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50],
            serverSide: true,
            processing: true,
            language: {
                searchPlaceholder: 'Search...',
                search: ''
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.columns[3].search.value = this.filterForm.get('status').value;
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getApplicationByEmpId').subscribe(resp => {
                    this.allcheck_id = false;
                    this.allcheck_id_count = 0;
                    this.applications = resp.data;
                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: []
                    });
                });
            },
            order: [],
            columns: [{ name: 'id', orderable: false },
            { name: 'applicant_name' },
            { name: 'role' },
            { name: 'stage_name', orderable: false },
            { name: 'created_at' }]
        };
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }


    checkboxHeader = (evt: Event) => {
        this.allcheck_id_count = 0;
        if (this.allcheck_id !== true) {
            for (let i = 0; i < this.applications.length; i++) {
                this.applications[i]['isSelected'] = true;
                this.allcheck_id_count++;
            }
        } else {
            for (let i = 0; i < this.applications.length; i++) {
                this.applications[i]['isSelected'] = false;
            }
        }
    }
    checkone = (id) => {
        // console.log(id);
        this.allcheck_id = false;
        let selectId = '';
        this.allcheck_id_count = 0;
        // let tempCount = 0;
        for (let i = 0; i < this.applications.length; i++) {
            if (+id === +this.applications[i][0]['id']) {
                this.applications[i]['isSelected'] = !this.applications[i]['isSelected'];
                if (this.applications[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selectId = this.applications[i];
                }
            } else {
                this.applications[i]['isSelected'] = false;
                // if (this.allTeams[i]['isSelected']) {
                //     selectId = this.allTeams[i];
                //     this.allcheck_id_count++;
                // }
            }
            // if (this.allTeams[i]['isSelected']) {
            //     tempCount++;
            // }
        }
        // if (tempCount === this.allTeams.length) {
        //     this.allcheck_id = true;
        // }
        if (this.allcheck_id_count === 1) {
            this.getApplicationById(selectId);
        }
    }

    // checkone(id) {
    //     this.allcheck_id = false;
    //     let selectId = '';
    //     this.allcheck_id_count = 0;
    //     this.selectedApplication = [];
    //     setTimeout(() => {
    //         for (let i = 0; i < this.applications.length; i++) {
    //             if (+id === +this.applications[i][0]['id']) {
    //                 if (this.applications[i]['isSelected']) {
    //                     selectId = this.applications[i];
    //                     this.allcheck_id_count++;
    //                 }
    //             } else {
    //                 this.applications[i]['isSelected'] = false;
    //             }
    //         }
    //         if (this.allcheck_id_count === 1) {
    //             this.getApplicationById(selectId);
    //         }
    //     }, 100);
    // }

    getApplicationById = (seletedRow) => {
        const temp_arr = [];
        this.selectedApplication = seletedRow;
        temp_arr['exp_required'] = this.selectedApplication['exp_required'];
        temp_arr['isSelected'] = this.selectedApplication['isSelected'];
        temp_arr['role'] = this.selectedApplication['role'];
        temp_arr['stage_name'] = this.selectedApplication['stage_name'];
        this.selectedApplication = this.selectedApplication[0];
        Object.keys(temp_arr).forEach((key) => {
            this.selectedApplication[key] = temp_arr[key];
        });
        delete this.selectedApplication[0];
    }

    onSelectStage = (opt) => {
        const tempArray = [];
        if (opt !== 'all') {
            for (let i = 0; i < this.selectedResult.length; i++) {
                if (this.selectedResult[i]['stage_name'] === opt) {
                    tempArray.push(this.selectedResult[i]);
                }
            }
            this.applications = tempArray;
        } else {
            this.applications = this.selectedResult;
        }
    }
}
