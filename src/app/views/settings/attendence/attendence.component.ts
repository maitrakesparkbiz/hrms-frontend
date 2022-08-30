import { Component, ElementRef, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OptionService } from '../../../shared/services/option.service';
import { LocationService } from '../../../shared/services/location.service';
import * as moment from 'moment';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { PermissionService } from '../../../shared/services/permission.service';
@Component({
    templateUrl: 'attendence.component.html',
    styleUrls: ['./attendence.component.scss']
})
export class AttendanceComponent implements OnInit {
    locations = [];
    leave_start_months = [];
    LocationForm: FormGroup;
    addip = new FormArray([]);
    locationdetail = new FormArray([]);
    btnstatus = false;
    editAllowed = true;
    @ViewChild('switch') att_switch: ElementRef;

    constructor(private _fb: FormBuilder,
        public optionservice: OptionService,
        public locationservice: LocationService,
        public router: Router,
        public flashMessageService: FlashMessageService,
        private spinner: NgxSpinnerService,
        private perService: PermissionService) {
    }

    ngOnInit() {
        this.editAllowed = this.perService.hasPermission('ATTENDANCE-SETTING.EDIT');
        this.LocationForm = new FormGroup({
            'locationdetail': this.locationdetail
        });
        this.getlocation();
    }

    getlocation = () => {
        this.spinner.show();
        this.optionservice.getSelectOption('2').subscribe(response => {
            this.leave_start_months = response.data;
            this.locations = StorageManagerService.getLocation();
            if (this.locations == null) {
                setTimeout(() =>
                    this.locationservice.getLocation().subscribe(res => {
                        this.locations = res.data;
                        StorageManagerService.storeLocation(this.locations);
                    }), 1000);
            }
            if (this.locations.length > 0) {
                for (let i = 0; i < this.locations.length; i++) {
                    if (this.locations[i].allowed_ip !== null && this.locations[i].allowed_ip) {
                        const tempArr = this.locations[i].allowed_ip.split(',');
                        const newArr = [];
                        for (const item of tempArr) {
                            newArr.push({
                                'display': item,
                                'value': item
                            });
                        }
                        this.locations[i].allowed_ip = newArr;
                    }
                    if (this.locations[i].leave_start_month) {
                        this.locations[i].leave_start_month = this.locations[i].leave_start_month.id;
                    }
                    if (this.locations[i].office_start_time) {
                        this.locations[i].office_start_time = new Date(moment(this.locations[i].office_start_time.date).format());
                    }
                    if (this.locations[i].office_end_time) {
                        this.locations[i].office_end_time = new Date(moment(this.locations[i].office_end_time.date).format());
                    }
                    if (this.locations[i].half_day_hours) {
                        this.locations[i].half_day_hours = new Date(moment(this.locations[i].half_day_hours.date).format());
                    }
                    if (this.locations[i].clock_reminder_time) {
                        this.locations[i].clock_reminder_time = new Date(moment(this.locations[i].clock_reminder_time.date).format());
                    }
                    if (this.locations[i].clock_reminder === true) {
                        this.locations[i].clock_reminder = 1;
                    } else {
                        this.locations[i].clock_reminder = 0;
                    }
                    if (this.locations[i].employee_self_checking === true) {
                        this.locations[i].employee_self_checking = 1;
                    } else {
                        this.locations[i].employee_self_checking = 0;
                    }
                    if (this.locations[i].working_days) {
                        this.locations[i].work_day_arr = this.locations[i].working_days.split(',');
                    }
                    (<FormArray>this.LocationForm.get('locationdetail')).push(
                        new FormGroup({
                            'office_start_time': new FormControl(this.locations[i].office_start_time),
                            'office_end_time': new FormControl(this.locations[i].office_end_time),
                            'leave_start_month': new FormControl(this.locations[i].leave_start_month),
                            'employee_self_checking': new FormControl(this.locations[i].employee_self_checking),
                            'late_mark_after_minute': new FormControl(this.locations[i].late_mark_after_minute),
                            'clock_reminder': new FormControl(this.locations[i].clock_reminder),
                            'clock_reminder_time': new FormControl(this.locations[i].clock_reminder_time),
                            'overtime_pay': new FormControl(this.locations[i].overtime_pay),
                            'half_day_allowed': new FormControl(this.locations[i].half_day_allowed),
                            'half_day_hours': new FormControl(this.locations[i].half_day_hours),
                            'allowed_ip': new FormControl(this.locations[i].allowed_ip),
                            // 'addip': new FormArray([]),
                            'mon': new FormControl(),
                            'tue': new FormControl(),
                            'wed': new FormControl(),
                            'thu': new FormControl(),
                            'fri': new FormControl(),
                            'sat': new FormControl(),
                            'alt_sat': new FormControl(+this.locations[i].alt_sat)
                        })
                    );
                    if (this.locations[i].work_day_arr) {
                        if (this.locations[i].work_day_arr.indexOf('mon') > -1) {
                            this.LocationForm.get('locationdetail')['controls'][i]['controls']['mon'].setValue(true);
                        }
                        if (this.locations[i].work_day_arr.indexOf('tue') > -1) {
                            this.LocationForm.get('locationdetail')['controls'][i]['controls']['tue'].setValue(true);
                        }
                        if (this.locations[i].work_day_arr.indexOf('wed') > -1) {
                            this.LocationForm.get('locationdetail')['controls'][i]['controls']['wed'].setValue(true);
                        }
                        if (this.locations[i].work_day_arr.indexOf('thu') > -1) {
                            this.LocationForm.get('locationdetail')['controls'][i]['controls']['thu'].setValue(true);
                        }
                        if (this.locations[i].work_day_arr.indexOf('fri') > -1) {
                            this.LocationForm.get('locationdetail')['controls'][i]['controls']['fri'].setValue(true);
                        }
                        if (this.locations[i].work_day_arr.indexOf('sat') > -1) {
                            this.LocationForm.get('locationdetail')['controls'][i]['controls']['sat'].setValue(true);
                            this.LocationForm.get('locationdetail')['controls'][i]['controls']['alt_sat'].disable();
                        }
                    }
                    if (+this.locations[i].alt_sat) {
                        this.LocationForm.get('locationdetail')['controls'][i]['controls']['sat'].disable();
                        // this.LocationForm.get('locationdetail')['controls'][i]['controls']['sat'].setValue(false);
                    } else {
                    }
                }
                if (!this.editAllowed) {
                    (<FormArray>this.LocationForm.get('locationdetail'))
                        .controls
                        .forEach(control => {
                            control.disable();
                        });
                }
            }
            this.spinner.hide();
        });
    }


    SaveLocation = () => {
        if (this.editAllowed) {
            for (let i = 0; i < this.locations.length; i++) {
                if (this.locations[i].office_start_time) {
                    this.locations[i].office_start_time = moment(this.locations[i].office_start_time).format('HH:mm');
                }
                if (this.locations[i].office_end_time) {
                    this.locations[i].office_end_time = moment(this.locations[i].office_end_time).format('HH:mm');
                }
                if (this.locations[i].half_day_hours) {
                    this.locations[i].half_day_hours = moment(this.locations[i].half_day_hours).format('HH:mm');
                }
                if (this.locations[i].clock_reminder_time) {
                    this.locations[i].clock_reminder_time = moment(this.locations[i].clock_reminder_time).format('HH:mm');
                }
                if (!this.locations[i].half_day_allowed) {
                    this.locations[i].half_day_hours = null;
                }
                if (this.LocationForm.value.locationdetail[i]) {
                    let work_days = '';
                    if (this.LocationForm.value.locationdetail[i].allowed_ip !== null
                        && this.LocationForm.value.locationdetail[i].allowed_ip.length > 0) {
                        let ips = '';
                        for (const ip of this.LocationForm.value.locationdetail[i].allowed_ip) {
                            ips += ip.value + ',';
                        }
                        ips = ips.slice(0, -1);
                        this.locations[i].allowed_ip = ips;
                    } else {
                        this.locations[i].allowed_ip = '';
                    }
                    Object.keys(this.LocationForm.value.locationdetail[i]).forEach(element => {
                        if (element === 'mon' ||
                            element === 'tue' ||
                            element === 'wed' ||
                            element === 'thu' ||
                            element === 'fri' ||
                            element === 'sat') {
                            if (element in this.LocationForm.value.locationdetail[i] &&
                                this.LocationForm.value.locationdetail[i][element]) {
                                work_days += element + ',';
                            }
                        }
                    });
                    work_days = work_days.slice(0, -1);
                    this.locations[i].working_days = work_days;
                }
                if ('alt_sat' in this.LocationForm.value.locationdetail[i] && this.LocationForm.value.locationdetail[i].alt_sat) {
                    this.locations[i].alt_sat = this.LocationForm.value.locationdetail[i].alt_sat;
                } else {
                    this.locations[i].alt_sat = false;
                }
            }

            this.locationservice.saveLocation(this.locations).subscribe(response => {
                this.locationservice.getLocation().subscribe(
                    (res) => {
                        if (res) {
                            StorageManagerService.storeLocation(res.data);
                        }
                    }
                );
                this.router.navigate(['/settings']);
                this.flashMessageService.pop('success', 'Attendence updated Succesfully', 'updated Succesfully');
            }
                , error => {

                });
        }
    }

    handleSat = (event, index) => {
        if (event.target.checked) {
            this.LocationForm.get('locationdetail')['controls'][index]['controls']['alt_sat'].setValue(false);
            this.LocationForm.get('locationdetail')['controls'][index]['controls']['alt_sat'].disable();
        } else {
            this.LocationForm.get('locationdetail')['controls'][index]['controls']['alt_sat'].enable();
        }
    }

    handleAltSat = (event, index) => {
        if (event.target.checked) {
            this.LocationForm.get('locationdetail')['controls'][index]['controls']['sat'].setValue(false);
            this.LocationForm.get('locationdetail')['controls'][index]['controls']['sat'].disable();
        } else {
            this.LocationForm.get('locationdetail')['controls'][index]['controls']['sat'].enable();
        }
    }
    onbtnclick1() {
        this.btnstatus = true;
    }

    onbtnclick2() {
        this.btnstatus = false;
    }

    onsecbtnclick() {
        this.btnstatus = true;
    }

}
