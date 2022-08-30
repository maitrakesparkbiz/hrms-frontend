import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { JobsService } from '../../../../shared/services/jobs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { FlashMessageService } from '../../../../shared/services/flash-message.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppConstants } from '../../../../constants/app.constants';
import { FileUploadService } from '../../../../shared/services/file-upload.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-applications-add',
  templateUrl: './applications-add.component.html',
  styleUrls: ['./applications-add.component.scss']
})
export class ApplicationsAddComponent implements OnInit {
  applicationForm: FormGroup;
  optionData: any;
  applicationEdit: any = [];
  file_response: any;
  edit_id: any;
  IMAGE_URL: any;
  DOWNLOAD_IMAGE_URL: any;
  files: any;
  edit_resume: any;
  disabled_opt: Element;
  int_select = true;
  reject_reason = true;
  resume_select: any = false;
  @ViewChild('selectStage') opt: ElementRef;
  constructor(private jobsService: JobsService,
    private flashMessageService: FlashMessageService,
    private router: Router,
    private _fb: FormBuilder,
    private fileuploadservice: FileUploadService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private spinner: NgxSpinnerService) {
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.edit_id = +params['id'];
    });
    this.applicationForm = this._fb.group({
      'job_id': ['', Validators.required],
      'applicant_name': ['', Validators.required],
      'location': [''],
      'contact_email': ['', Validators.required],
      'phone_number1': ['', Validators.required],
      'phone_number2': [''],
      'source': [''],
      'current_company': [''],
      'current_ctc': [''],
      'expected_ctc': [''],
      'degree': [''],
      'resume': ['', Validators.required],
      'stage': [''],
      'interview_date': [''],
      'interview_time': [''],
      'reject_reason':['']
    });
    this.IMAGE_URL = AppConstants.FILE_URL;
    this.DOWNLOAD_IMAGE_URL = AppConstants.DOWNLOAD_FILE_URL;
    if (this.edit_id) {
      this.spinner.show();
      this.applicationForm.get('resume').setValidators([]);
      this.jobsService.getApplicationById(this.edit_id).subscribe(
        (res) => {
          this.applicationEdit = res;
          if (this.applicationEdit) {
            Object.keys(this.applicationForm.value).forEach(field => {
              if (this.applicationEdit[field]) {

                if (field === 'resume') {
                  this.edit_resume = this.applicationEdit['resume'];
                  // this.applicationForm.get(field).setValue(AppConstants.FILE_URL + this.applicationEdit[field]);
                } else if (field === 'interview_date' || field === 'interview_time') {
                  this.applicationForm.get(field).setValue(moment(this.applicationEdit[field].date).format());
                }
                // else if (field === 'reject_reason' && +this.applicationEdit['stage']===4) {
                //   this.applicationForm.get(field).setValue(this.applicationEdit[field]);
                // }
                else {
                  this.applicationForm.get(field).setValue(this.applicationEdit[field]);
                }
              }
            });
          }
          if (+this.applicationEdit['stage'] === 4){
            this.reject_reason =false;
            this.applicationForm.get('reject_reason').setValidators([Validators.required]);
            this.applicationForm.get('reject_reason').updateValueAndValidity();
            this.applicationForm.get('reject_reason').setValue(this.applicationEdit['reject_reason']);
          }
          if (+this.applicationEdit['stage'] === 2) { this.onSelect(2); }
          for (let i = 1; i <= this.opt.nativeElement.childElementCount; i++) {
            this.disabled_opt = this.opt.nativeElement[i - 1];
            if (this.applicationEdit['stage'] > i) {
              this.renderer.setAttribute(this.disabled_opt, 'disabled', 'true');
              this.renderer.addClass(this.disabled_opt, 'opt-disabled');
            }
          }
          this.spinner.hide();
        }
      );
    } else {
      this.applicationForm.get('stage').setValue('1');
    }
    this.getJobOpenings();
  }

  getJobOpenings = () => {
    this.jobsService.getJobOptionsData().subscribe(
      (res) => {
        this.optionData = res;
      }
    );
  }

  SaveApplication = async () => {
    const applicationData = this.applicationForm.value;
    if ((this.files && this.applicationForm.valid) || (this.edit_id && this.applicationForm.valid)) {
      this.spinner.show();
      if (applicationData['interview_date']) {
        applicationData['interview_date'] = moment(applicationData['interview_date']).format();
      }
      if (applicationData['interview_time']) {
        applicationData['interview_time'] = moment(applicationData['interview_time']).format('HH:mm');
      }
      if (this.files && this.files.length > 0) {
        const fData: FormData = new FormData;
        for (let i = 0; i < this.files.length; i++) {
          fData.append('file', this.files[i]);
        }
        this.file_response = await this.fileuploadservice.tempuploadFile(fData);
        applicationData['resume'] = this.file_response.filename;
      } else {
        applicationData['resume'] = this.edit_resume;
      }
      applicationData['stage'] = +applicationData['stage'];
      if (this.edit_id) {
        applicationData['id'] = this.edit_id;
      }
      this.jobsService.saveApplication(applicationData).subscribe(
        (res) => {
          if (res === 'success') {
            this.flashMessageService.pop('success', 'Applicant Added Successfully', 'Applicant Add');
            this.router.navigate(['/jobs/applications']);
          } else if (res === 'updated') {
            this.flashMessageService.pop('success', 'Applicant Updated Successfully', 'Applicant Updated');
            this.router.navigate(['/jobs/applications']);
          } else {
            this.flashMessageService.pop('error', 'Error while saving an applicant', 'Error');
          }
          this.spinner.hide();
        }
      );
    }
  }

  uploadImage = (event: any) => {
    this.files = event.target.files;
    if (this.files.length > 0) {
      this.applicationEdit['resume'] = this.files[0].name;
      this.resume_select = true;
    }
  }

  removeImage = (file_name) => {
    this.applicationEdit[file_name] = '';
    this.resume_select = false;
  }

  cancel = () => {
    this.router.navigate(['/jobs/applications']);
  }

  onSelect = (id) => {
    if (+id === 2) {
      this.int_select = false;
      // this.applicationForm.controls['interview_date'].setValidators(Validators.required);
      // this.applicationForm.controls['interview_time'].setValidators(Validators.required);
    } else {
      // this.applicationForm.get('interview_date').setValidators([]);
      // this.applicationForm.get('interview_time').setValidators([]);
      this.applicationForm.get('interview_date').setValue('');
      this.applicationForm.get('interview_time').setValue('');
      this.int_select = true;
    }
    if (+id === 4) {

      this.applicationForm.get('reject_reason').setValidators([Validators.required]);
      this.applicationForm.get('reject_reason').updateValueAndValidity();
      this.reject_reason = false;
    }else{
      this.applicationForm.get('reject_reason').clearValidators();
      this.applicationForm.get('reject_reason').updateValueAndValidity();
      // this.applicationForm.get('reject_reason').setValue('');?
      this.reject_reason = true;
    }
  }
}
