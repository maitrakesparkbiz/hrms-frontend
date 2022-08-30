import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { JobsService } from '../../../shared/services/jobs.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AppConstants } from '../../../constants/app.constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../../shared/services/datatable.service';
import { FormGroup, FormControl } from '@angular/forms';
import { DashboardService } from '../../../shared/services/dashboard.service';

@Component({
    selector: 'app-applications',
    templateUrl: './applications.component.html',
    styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    modalRef: BsModalRef;
    allApplications: any;
    applicationDetail: any;
    search;
    allcheck_id;
    application_edit;
    allcheck_id_count: any = 0;
    file_download_url = '';
    newAppsCount = 0;
    FILE_URL = AppConstants.FILE_URL;
    filterForm: FormGroup;

    constructor(private jobsService: JobsService,
        private flashMessageService: FlashMessageService,
        private modalService: BsModalService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private datatableService: DatatableService,
        private dashBoardService: DashboardService) { }

    ngOnInit() {
        this.file_download_url = AppConstants.DOWNLOAD_FILE_URL;
        this.filterForm = new FormGroup({
            'status': new FormControl('all')
        });
        this.getAllJobApplications();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }
    getAllJobApplications = () => {
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
            // search: { search: this.leaveForm.get('status').value },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.columns[3].search.value = this.filterForm.get('status').value;
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllJobApplications').subscribe(resp => {
                    this.allcheck_id = false;
                    this.allcheck_id_count = 0;
                    this.allApplications = resp.data['data'];
                    this.newAppsCount = resp.data['count'];
                    this.dashBoardService.pendingJobs.next({ 'count': this.newAppsCount });
                    // this.spinner.hide();
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

    checkboxHeader = (evt: Event) => {
        this.allcheck_id_count = 0;
        if (this.allcheck_id !== true) {
            for (let i = 0; i < this.allApplications.length; i++) {
                this.allApplications[i]['isSelected'] = true;
                this.allcheck_id_count++;
            }
        } else {
            for (let i = 0; i < this.allApplications.length; i++) {
                this.allApplications[i]['isSelected'] = false;
            }
        }
    }

    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    checkone = (id) => {
        this.allcheck_id = false;
        let selectId = '';
        this.allcheck_id_count = 0;
        // let tempCount = 0;
        for (let i = 0; i < this.allApplications.length; i++) {
            if (+id === +this.allApplications[i][0]['id']) {
                this.allApplications[i]['isSelected'] = !this.allApplications[i]['isSelected'];
                if (this.allApplications[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selectId = this.allApplications[i];
                }
            } else {
                this.allApplications[i]['isSelected'] = false;
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
    //     this.applicationDetail = [];
    //     setTimeout(() => {
    //         for (let i = 0; i < this.allApplications.length; i++) {
    //             if (+this.allApplications[i][0]['id'] === +id) {
    //                 if (this.allApplications[i]['isSelected']) {
    //                     this.allcheck_id_count++;
    //                     selectId = this.allApplications[i];
    //                 }
    //             } else {
    //                 this.allApplications[i]['isSelected'] = false;
    //             }
    //         }
    //         if (this.allcheck_id_count === 1) {
    //             this.getApplicationById(selectId);
    //         }
    //     }, 100);
    // }

    getApplicationById = (seletedRow) => {
        const temp_arr = [];
        this.applicationDetail = seletedRow;
        temp_arr['exp_required'] = this.applicationDetail['exp_required'];
        temp_arr['isSelected'] = this.applicationDetail['isSelected'];
        temp_arr['role'] = this.applicationDetail['role'];
        temp_arr['stage_name'] = this.applicationDetail['stage_name'];
        this.applicationDetail = this.applicationDetail[0];
        Object.keys(temp_arr).forEach((key) => {
            this.applicationDetail[key] = temp_arr[key];
        });
        delete this.applicationDetail[0];
    }

    editApplication = () => {
        // this.jobsService.applicationSubject['appDetail'] = this.applicationDetail;
        this.router.navigate(['/jobs/applications/edit/' + this.applicationDetail['id']]);
    }
}

