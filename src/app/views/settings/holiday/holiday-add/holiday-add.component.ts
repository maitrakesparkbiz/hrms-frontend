import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HolidayService } from '../../../../shared/services/holiday.service';
import * as moment from 'moment';
import { FlashMessageService } from '../../../../shared/services/flash-message.service';
import { DatePipe } from '@angular/common';

@Component({
    templateUrl: 'holiday-add.component.html',
    styleUrls: ['./holiday-add.component.scss']
})

export class HolidayAddComponent implements OnInit {
    year: any;
    edit_id: any;
    yearForm: FormGroup;
    editData: any;
    constructor(private _fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private holidayService: HolidayService,
        private msgService: FlashMessageService,
        public datepipe: DatePipe) {
    }

    ngOnInit() {
        this.yearForm = this._fb.group({
            'event_name': ['', Validators.required],
            'description': ['', Validators.required],
            'start_date': ['', Validators.required]
        });
        this.route.params.subscribe(
            (param) => {
                if (param['year'] !== undefined) {
                    this.year = +param['year'];
                }
                if (param['id'] !== undefined) {
                    this.edit_id = +param['id'];
                }
            }
        );
        if (this.edit_id) {
            this.getHolidayInfo();
        }
    }

    getHolidayInfo = () => {
        this.holidayService.getHolidayInfo(this.edit_id).subscribe(
            (res) => {
                if (res) {
                    this.editData = res;
                    Object.keys(this.yearForm.controls).forEach(element => {
                        if (element === 'start_date') {
                            this.yearForm.get(element).setValue(moment((this.editData[element].date)).format());
                        } else {
                            this.yearForm.get(element).setValue(this.editData[element]);
                        }
                    });
                }
            }
        );
    }

    saveHoliday = () => {
        if (this.yearForm.valid) {
            const post_data = this.yearForm.value;
            if (this.year) {
                post_data['year'] = this.year;
            }
            if (this.edit_id) {
                post_data['id'] = this.edit_id;
            }
            post_data['start_date'] = this.datepipe.transform(post_data['start_date'], 'dd-MM-yyyy');
            this.holidayService.saveHoliday(post_data).subscribe(
                (res) => {
                    if (res === 'updated') {
                        this.msgService.pop('success', 'Updated', 'Holiday Successfully Updated');
                    }
                    if (res === 'created') {
                        this.msgService.pop('success', 'Added', 'Holiday Successfully Added');
                    }
                    this.router.navigate(['/settings/holiday']);
                }
            );
        }
    }

    onBack = () => {
        this.router.navigate(['/settings/holiday']);
    }
    cancle = () => {
        this.router.navigate(['/settings/holiday']);
    }
}
