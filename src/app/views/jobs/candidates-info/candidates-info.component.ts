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
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { DashboardService } from '../../../shared/services/dashboard.service';
import {CandidateInfoService} from "../../../shared/services/candidate-info.service";

@Component({
    selector: 'app-candidates-info',
    templateUrl: './candidates-info.component.html',
    styleUrls: ['./candidates-info.component.scss']
})
export class CandidatesInfoComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    modalRef: BsModalRef;
    allApplications: any;
    applicationDetail: any;
    optionData: any;
    search;
    allcheck_id;
    application_edit;
    allcheck_id_count: any = 0;
    file_download_url = '';
    newAppsCount = 0;
    FILE_URL = AppConstants.FILE_URL;
    filterForm: FormGroup;
    mailForm: FormGroup;

    send_mail;

    constructor(private jobsService: JobsService,
                private candidateInfo:CandidateInfoService,
                private flashMessageService: FlashMessageService,
                private modalService: BsModalService,
                private router: Router,
                private spinner: NgxSpinnerService,
                private datatableService: DatatableService,
                private dashBoardService: DashboardService) { }

    ngOnInit() {
        this.file_download_url = AppConstants.DOWNLOAD_FILE_URL;
        this.filterForm = new FormGroup({
            // 'exp': new FormControl('all')
            'exp': new FormControl(''),
            'sal_filter': new FormControl('0'),
            'cat_filter': new FormControl('0')
        });
        this.mailForm = new FormGroup({
            'title': new FormControl(null, Validators.required),
            'description': new FormControl(null, Validators.required)
        });
        this.getJobOpenings();
        this.getAllCandidatesInfo();
    }
    getJobOpenings = () => {
        this.jobsService.getJobOptionsData().subscribe(
            (res) => {
                this.optionData = res;
            }
        );
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }
    getAllCandidatesInfo = () => {
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
                dataTablesParameters.columns[3].search.value = this.filterForm.get('exp').value;
                dataTablesParameters.columns[4].search.value = this.filterForm.get('sal_filter').value;
                dataTablesParameters.columns[2].search.value = this.filterForm.get('cat_filter').value;
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllCandidatesInfo').subscribe(resp => {

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
                { name: 'candidate_name' },
                { name: 'category' ,orderable: false},
                { name: 'experiance' },
                { name: 'expected_ctc' },
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
        let tempCount = 0;
        for (let i = 0; i < this.allApplications.length; i++) {
            if (+id === +this.allApplications[i]['id']) {
                this.allApplications[i]['isSelected'] = !this.allApplications[i]['isSelected'];
                if (this.allApplications[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selectId = this.allApplications[i];
                }
            } else {
                if (this.allApplications[i]['isSelected']) {
                    selectId = this.allApplications[i];
                    this.allcheck_id_count++;
                }
            }
            if (this.allApplications[i]['isSelected']) {
                tempCount++;
            }
        }
        if (tempCount === this.allApplications.length) {
            this.allcheck_id = true;
        }
        if (this.allcheck_id_count === 1) {
            this.getApplicationById(selectId);
        }
    }

    getApplicationById = (seletedRow) => {
        const temp_arr = [];
        this.applicationDetail = seletedRow;

    }

    editApplication = () => {
        this.router.navigate(['/jobs/candidates-info/edit/' + this.applicationDetail['id']]);
    }
    openModel = (template) => {
        this.modalRef = this.modalService.show(template);
    }


    closeModel = () => {
        this.modalRef.hide();
    }
    sendMails = () => {
        if(this.mailForm.valid) {
            this.send_mail = this.allApplications;
            this.closeModel();
            this.spinner.show();
            this.candidateInfo.sendCandidateMail(this.send_mail, this.mailForm.value).subscribe((responseData: any) => {
                if (responseData.response === 'success') {
                    this.spinner.hide();
                    this.mailForm.reset();
                    this.allcheck_id_count = 0;
                    this.flashMessageService.pop('success', 'Candidate', 'Mail Send Succesfully');
                    this.rerender();
                } else {
                    this.spinner.hide();
                    this.allcheck_id_count = 0;
                    this.flashMessageService.pop('error', 'Error', 'Mail Send Error');
                    this.rerender();
                }
            });
        }
    }
}

