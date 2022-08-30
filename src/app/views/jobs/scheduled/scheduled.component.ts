import { OnInit, Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { JobsService } from '../../../shared/services/jobs.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppConstants } from '../../../constants/app.constants';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../../shared/services/datatable.service';

@Component({
    selector: 'app-scheduled',
    templateUrl: './scheduled.component.html',
    styleUrls: ['./scheduled.component.scss']
})

export class ScheduledComponent implements OnInit, AfterViewInit, OnDestroy {
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
    rescheduleForm: FormGroup;
    re_applicant_id: any;
    reschedule_data: any = [];
    constructor(private jobsService: JobsService,
        private flashMessageService: FlashMessageService,
        private modalService: BsModalService,
        private router: Router,
        private _fb: FormBuilder,
        private spinner: NgxSpinnerService,
        private datatableService: DatatableService) { }

    ngOnInit() {
        this.file_download_url = AppConstants.DOWNLOAD_FILE_URL;
        this.rescheduleForm = this._fb.group({
            'interview_date': ['', Validators.required],
            'interview_time': ['', Validators.required],
            'subject': ['', Validators.required]
        });
        this.getAllJobApplications();
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllJobApplicationsInt').subscribe(resp => {
                    this.allcheck_id = false;
                    this.allcheck_id_count = 0;
                    this.allApplications = resp.data;
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
            { name: 'interview_date' },
            { name: 'action', orderable: false, searchable: false }]
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
        this.jobsService.getAllInterviews(this.applicationDetail.id).subscribe(
            (res) => {
                this.reschedule_data = res;
            }
        );
    }

    editApplication = () => {
        // this.jobsService.applicationSubject['appDetail'] = this.applicationDetail;
        this.router.navigate(['/jobs/applications/edit/' + this.applicationDetail['id']]);
    }

    reschedule = (id) => {
        this.jobsService.rescheduleInterview(id).subscribe(
            (res) => {

            }
        );
    }

    openModel = (template, app_id) => {
        this.re_applicant_id = app_id;
        this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    }

    closeModel = () => {
        this.modalRef.hide();
        this.rescheduleForm.reset();
    }

    saveReschedule = () => {
        if (this.rescheduleForm.valid) {
            let rescheduleData: any;
            rescheduleData = this.rescheduleForm.value;
            rescheduleData['applicant_id'] = this.re_applicant_id;
            rescheduleData['interview_date'] = moment(rescheduleData['interview_date']).format();
            rescheduleData['interview_time'] = moment(rescheduleData['interview_time']).format('HH:mm');
            this.closeModel();
            this.jobsService.rescheduleInterview(rescheduleData).subscribe(
                (res) => {
                    if (res === 'success') {
                        this.rerender();
                        this.flashMessageService.pop('success', 'Interview Rescheduled', 'Interview Rescheduled successfully');
                        this.allApplications.forEach(element => {
                            if (element[0]['id'] === this.re_applicant_id) {
                                element['re_count'] += 1;
                            }
                        });
                    }
                }
            );
        }
    }

    addRoute = () => {
        this.router.navigate(['/jobs/applications/add']);
    }
}
