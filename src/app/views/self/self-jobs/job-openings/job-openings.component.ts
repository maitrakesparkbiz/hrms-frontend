import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { JobsService } from '../../../../shared/services/jobs.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FlashMessageService } from '../../../../shared/services/flash-message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploadService } from '../../../../shared/services/file-upload.service';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../../../shared/services/datatable.service';

@Component({
    selector: 'app-self-job-openings',
    templateUrl: 'job-openings.component.html',
    styleUrls: ['./job-openings.component.scss']
})

export class JobOpenigsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    search;
    allcheck_id;
    allcheck_id_count = 0;
    modalRef: BsModalRef;
    openings: any = [];
    selectedOpening: any = [];
    ApplicationForm: FormGroup;
    public btnstatus = false;
    file_response: any;
    files: any;
    resume_name = '';
    site_url = window.location.host;

    constructor(private jobsService: JobsService,
        private modalService: BsModalService,
        public flashMessageService: FlashMessageService,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private _fb: FormBuilder,
        private fileuploadservice: FileUploadService,
        private datatableService: DatatableService) { }

    ngOnInit() {
        this.ApplicationForm = this._fb.group({
            'applicant_name': ['', Validators.required],
            'contact_email': ['', Validators.required],
            'phone_number1': [],
            'resume': ['', Validators.required]
        });

        this.getAllOpeningsSelf();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    getAllOpeningsSelf = () => {
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllOpeningsSelf').subscribe(resp => {
                    this.allcheck_id = false;
                    this.allcheck_id_count = 0;
                    this.openings = resp.data;
                    for (let i = 0; i < this.openings.length; i++) {
                        if (this.openings[i].posted_as === 'Public' || this.openings[i].posted_as === 'Both') {
                            this.openings[i].url =
                                'http://' + this.site_url +
                                '/job/' + this.openings[i].id + '/' + this.openings[i].role.split(' ').join('-');
                        }
                    }
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
            { name: 'role' },
            { name: 'exp_required' },
            { name: 'last_date' }]
        };
    }

    checkboxHeader = (evt: Event) => {
        this.allcheck_id_count = 0;
        if (this.allcheck_id !== true) {
            for (let i = 0; i < this.openings.length; i++) {
                this.openings[i]['isSelected'] = true;
                this.allcheck_id_count++;
            }
        } else {
            for (let i = 0; i < this.openings.length; i++) {
                this.openings[i]['isSelected'] = false;
            }
        }
    }
    checkone = (id) => {
        this.allcheck_id = false;
        let selectId = '';
        this.allcheck_id_count = 0;
        // let tempCount = 0;
        for (let i = 0; i < this.openings.length; i++) {
            if (+id === +this.openings[i]['id']) {
                this.openings[i]['isSelected'] = !this.openings[i]['isSelected'];
                if (this.openings[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selectId = this.openings[i];
                }
            } else {
                this.openings[i]['isSelected'] = false;
            }
        }
        if (this.allcheck_id_count === 1) {
            this.getSelectIdData(selectId);
        }
    }

    getSelectIdData = (selectRow) => {
        this.selectedOpening = selectRow;
    }

    openModal = (template: TemplateRef<any>) => {
        this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
        this.btnstatus = true;
    }

    closeModel = () => {
        this.modalRef.hide();
        this.resume_name = '';
        this.ApplicationForm.reset();
    }

    SaveApplicant = async () => {
        if (this.ApplicationForm.valid && this.resume_name) {
            const applicationData = this.ApplicationForm.value;
            if (this.files && this.files.length > 0) {
                const fData: FormData = new FormData;
                for (let i = 0; i < this.files.length; i++) {
                    fData.append('file', this.files[i]);
                }
                this.file_response = await this.fileuploadservice.tempuploadFile(fData);
                applicationData['resume'] = this.file_response.filename;
            }
            applicationData['stage'] = 1;
            applicationData['job_id'] = this.selectedOpening['id'];
            const emp_data = JSON.parse(StorageManagerService.getUser());
            applicationData['assoc_emp_id'] = emp_data.id;
            this.jobsService.saveApplication(applicationData).subscribe(
                (res) => {
                    if (res === 'success') {
                        this.allcheck_id_count = 0;
                        this.closeModel();
                    }
                }
            );
        }
    }

    uploadImage = (event: any) => {
        this.files = event.target.files;
        this.resume_name = this.files[0].name;
    }

    removeImage = () => {
        this.ApplicationForm.get('resume').reset();
        this.resume_name = '';
    }
}
