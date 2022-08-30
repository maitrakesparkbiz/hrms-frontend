import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IOption } from 'ng-select';
import { UserService } from '../../../shared/services/user.service';
import { LeaveTypeService } from '../../../shared/services/leave_type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveapplicationService } from '../../../shared/services/leaveapplication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { NgOption } from '@ng-select/ng-select';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-leaveapplication',
    templateUrl: './leave-application.component.html',
    styleUrls: ['./leave-application.component.scss']
})
export class LeaveApplicationComponent implements OnInit {
    public invoiceForm: FormGroup;
    modalRef: BsModalRef;
    leavetype;
    leavetypeedit;
    sub;
    emp_id;
    id;
    IMAGE_URL;
    leaveapplication: any = {};
    allUsers: any = [];
    leaveOpt: any = [];
    selectedEmpLeaves: any = [];
    halfDayError = false;
    count = 0;
    msg = '';
    @ViewChild('agesSelect') agesSelect: ElementRef;
    // @ViewChild('empSelect') empSelect: ElementRef;

    public Allleave: NgOption[];
    public employee: NgOption[];
    selectdLeave: any;

    constructor(
        public userservice: UserService,
        public spinner: NgxSpinnerService,
        public router: Router, private route: ActivatedRoute,
        public leavetypeservice: LeaveTypeService,
        public leaveapplicationservice: LeaveapplicationService,
        private flashMessageService: FlashMessageService, private modalService: BsModalService,
        private renderer2: Renderer2,
        private datePipe: DatePipe) {

    }

    ngOnInit() {
        this.invoiceForm = new FormGroup({
            'user_id': new FormControl(null, Validators.required),
            'leave_date': new FormControl(null, Validators.required),
            'leave_type': new FormControl('', Validators.required),
            'half_day': new FormControl(null),
            'reason': new FormControl(null, Validators.required),
        });

        this.renderer2.addClass(this.agesSelect['element']['children'][0], 'custom-emp-dropdown');
        // this.renderer2.addClass(this.empSelect['element']['children'][0], 'custom-emp-dropdown');
        const array = [];
        const leavearray = [];

        this.userservice.getAllUsersWithFinalLeaves().subscribe(
            (res) => {
                this.allUsers = res;
                for (const data of res) {
                    array.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
                }
                this.employee = array;
            }
        );

        // this.userservice.getAllUsers().subscribe(res => {
        //     this.allUsers = res;
        //     for (const data of res.data) {
        //         array.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
        //     }
        //     this.employee = array;
        // });

        this.leavetypeservice.getAllLeaveTypes().subscribe(res => {
            this.leavetype = res;
            for (const row of this.leavetype) {
                this.leaveOpt.push({
                    'id': +row.id,
                    'label': row.leavetype
                });
            }
            // for (const data of this.leavetype) {
            //     leavearray.push({ 'label': data.leavetype, 'value': data.id });
            // }
            // this.Allleave = leavearray;
        });
    }

    onEmpSelect = () => {
        const empid = this.invoiceForm.get('user_id').value;
        Object.keys(this.allUsers).forEach(index => {
            if (+this.allUsers[index].id === +empid) {
                this.selectedEmpLeaves = this.allUsers[index][0];
                this.setLeaves(this.allUsers[index][0]);
                this.invoiceForm.get('leave_type').setValue('');
            }
        });
    }

    onHalfDay = (value = '') => {
        const halfDayStatus = this.invoiceForm.get('half_day').value;
        const leave_id = this.invoiceForm.get('leave_type').value;
        let leavetype = '';
        let leavecount: number;

        for (const row of this.leavetype) {
            if (+row.id === +leave_id) {
                leavetype = row.leavetype.toLowerCase();
                if (leavetype !== 'upl') {
                    leavecount = this.selectedEmpLeaves[leavetype];
                }
            }
        }
        if (this.invoiceForm.get('leave_type').value) {
            if (leavetype === 'upl') {
                this.halfDayError = false;
            } else {
                if (halfDayStatus) {
                    this.halfDayError = false;
                } else {
                    if (leavecount < 1.00) {
                        this.halfDayError = true;
                    } else {
                        this.halfDayError = false;
                    }
                }
            }
            if (this.halfDayError) {
                this.invoiceForm.get('leave_type').setErrors({ 'not_allowed': true });
            } else {
                this.invoiceForm.get('leave_type').setErrors(null);
            }
        }
    }

    setLeaves = (leaveData) => {
        const leavearray = [];
        this.Allleave = [];
        this.leaveOpt = [];

        for (const row of this.leavetype) {
            if (row.leavetype === 'UPL') {
                this.leaveOpt.push({
                    'id': +row.id,
                    'label': row.leavetype,
                    'available': ''
                });
            } else {
                // if (this.count < 3) {
                if (+leaveData[row.leavetype.toLowerCase()] > 0) {
                    this.leaveOpt.push({
                        'id': +row.id,
                        'label': row.leavetype,
                        'available': leaveData[row.leavetype.toLowerCase()]
                    });
                }
                // }
            }
        }
        // this.Allleave = leavearray;
    }

    cancel = () => {
        this.router.navigate(['/leave/final-leaves']);
    }

    leaveApplication = () => {
        if (this.invoiceForm.valid) {
            this.leaveapplication = this.invoiceForm.value;
            if (this.leaveapplication['half_day']) {
                this.leaveapplication['leave_count'] = 0.5;
            } else {
                this.leaveapplication['leave_count'] = 1;
            }
            for (const row of this.leavetype) {
                if (+row['id'] === +this.leaveapplication['leave_type']) {
                    this.leaveapplication['leave_type'] = row;
                }
            }
            this.leaveapplication['leave_date'] = this.datePipe.transform(moment(this.leaveapplication['leave_date']).format(), 'dd-MM-yyyy');
            this.leaveapplicationservice.saveFinalLeave(this.leaveapplication).subscribe(res => {
                if (res === 'success') {
                    this.router.navigate(['/leave/final-leaves']);
                    this.flashMessageService.pop('success', 'Leave Add SuccesFully', 'Add Leave');
                }
            });
        }
    }
}
