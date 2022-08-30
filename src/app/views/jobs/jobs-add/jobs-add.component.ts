import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { JobsService } from '../../../shared/services/jobs.service';
import { FormBuilder, Form, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmPasswordValidation } from '../../../validators/confirm-password.validator';
import { DatePipe } from '@angular/common';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-jobs-add',
    templateUrl: './jobs-add.component.html',
    styleUrls: ['./jobs-add.component.scss'],
    // encapsulation: ViewEncapsulation.None
})

export class JobsAddComponent implements OnInit {
    openingForm: FormGroup;
    planModel: any = { start_time: new Date() };
    edit_id: Number;
    edit_job: any;
    constructor(private jobsService: JobsService,
        private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        public datepipe: DatePipe,
        private flashMessageService: FlashMessageService,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.edit_id = +params['id'];
        });
        this.openingForm = this._fb.group({
            'role': ['', Validators.required],
            'exp_required': [''],
            'ctc': [''],
            'vacancies': [''],
            'introduction': [''],
            'responsibilities': [''],
            'skill_set': [''],
            'last_date': ['', Validators.required],
            'posted_date': ['', Validators.required],
            'posted_as': ['Both', Validators.required],
            'status': ['Open', Validators.required]
        },
            {
                validator: [ConfirmPasswordValidation.checkDates],
            }
        );
        if (this.edit_id) {
            this.spinner.show();
            this.jobsService.getOpeningById(this.edit_id).subscribe(
                (res) => {
                    if (res[0]) {
                        this.edit_job = res[0];
                        Object.keys(this.openingForm.value).forEach((element) => {
                            if (element === 'last_date' || element === 'posted_date') {
                                this.openingForm.get(element).setValue(moment(this.edit_job[element].date).format());
                            } else {
                                this.openingForm.get(element).setValue(this.edit_job[element]);
                            }
                        });
                    } else {
                        this.flashMessageService.pop('danger', 'Error occured', 'error');
                    }
                    this.spinner.hide();
                }
            );
        }
    }

    SaveOpening = () => {
        if (this.edit_id) {
            this.openingForm.value['id'] = this.edit_id;
        }
        this.openingForm.value['last_date'] = this.datepipe.transform(this.openingForm.value['last_date'], 'dd-MM-yyyy');
        this.openingForm.value['posted_date'] = this.datepipe.transform(this.openingForm.value['posted_date'], 'dd-MM-yyyy');
        if (this.openingForm.valid) {
            this.jobsService.saveOpening(this.openingForm.value).subscribe(
                (res) => {
                    if (res === 'success') {
                        this.flashMessageService.pop('success', 'Job Added Successfully', 'Job Add');
                        this.router.navigate(['/jobs/openings']);
                    } else if (res === 'updated') {
                        this.flashMessageService.pop('success', 'Job Updated Successfully', 'Job Update');
                        this.router.navigate(['/jobs/openings']);
                    }

                }
            );
        }
    }

    cancel = () => {
        this.router.navigate(['/jobs/openings']);
    }
}
