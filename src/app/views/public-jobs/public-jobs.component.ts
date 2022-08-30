import { OnInit, Component } from '@angular/core';
import { JobsService } from '../../shared/services/jobs.service';
import { ActivatedRoute } from '@angular/router';
import { FileUploadService } from '../../shared/services/file-upload.service';
import { CompanyService } from '../../shared/services/company.service';
import { AppComponent } from '../../app.component';
import { AppConstants } from '../../constants/app.constants';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { StorageManagerService } from '../../shared/services/storage-manager.service';
import { ConfirmPasswordValidation } from '../../validators/confirm-password.validator';

@Component({
    selector: 'app-public-jobs',
    templateUrl: 'public-jobs.component.html',
    styleUrls: ['./public-jobs.component.scss', 'style2.component.scss', 'style3.component.scss']
})


export class PublicJobsComponent implements OnInit {
    openingData: any = [];
    id;
    length = 0;
    logoPath = '';
    ApplicationForm: FormGroup;
    page1 = true;
    page2 = false;
    page3 = false;
    file_response: any;
    files: any;
    resume_name = '';
    applied_count = 0;

    constructor(public jobsService: JobsService,
        public activatedRoute: ActivatedRoute,
        private companyService: CompanyService,
        private _fb: FormBuilder,
        private fileuploadservice: FileUploadService) { }

    ngOnInit() {
        this.ApplicationForm = this._fb.group({
            'applicant_name': ['', Validators.required],
            'contact_email': ['', [Validators.required, Validators.email]],
            'phone_number1': ['', [Validators.required, Validators.minLength(7), Validators.maxLength(11), Validators.pattern('^[0-9]*$')]],
            'resume': ['', Validators.required]
        }, {
                validator: ConfirmPasswordValidation.checkResume
            });
        this.companyService.getLogoPaths().subscribe(
            (res) => {
                this.logoPath = AppConstants.IMAGE_URL + res;
            }
        );
        this.activatedRoute.params.subscribe(
            (param) => {
                if (Object.keys(param).length === 2) {
                    this.id = param.id;
                }
                // else {
                //     if (param['name-id'] !== undefined) {
                //         const start = param['name-id'].lastIndexOf('-') + 1;
                //         const end = param['name-id'].length;
                //         console.log(param['name-id'].substring(start, end));
                //     }
                // }
            }
        );



        this.jobsService.getOpeningById(this.id).subscribe(
            (res) => {
                if (res) {
                    this.openingData = res[0];
                    this.length = Object.keys(this.openingData).length;
                } else {
                }
            }
        );
    }

    onApply() {
        this.page2 = !this.page2;
        this.page1 = !this.page1;
        this.resume_name = '';
        this.ApplicationForm.reset();
    }

    onReturn() {
        this.page1 = !this.page1;
        this.page3 = !this.page3;
    }

    async SaveApplicant() {
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
            applicationData['job_id'] = this.id;
            this.jobsService.saveApplication(applicationData).subscribe(
                (res) => {
                    if (res === 'success') {
                        this.page2 = false;
                        this.page3 = true;
                    }
                }
            );
        }
    }

    uploadImage(event: any) {
        this.files = event.target.files;
        this.resume_name = this.files[0].name;
    }

    removeImage() {
        this.ApplicationForm.get('resume').reset();
        this.resume_name = '';
    }
}
