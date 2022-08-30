import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { OptionService } from '../../../../shared/services/option.service';
import { LeaveTypeService } from '../../../../shared/services/leave_type.service';
import { FlashMessageService } from '../../../../shared/services/flash-message.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
    templateUrl: 'leave_types_edit.component.html',
    styleUrls: ['./leave_types_edit.component.scss']

})
export class LeaveTypesEditComponent implements OnInit {

    LeaveTypeForm: FormGroup;
    leave_type: any = {};
    sub;
    id;
    allstatus;
    modalRef: BsModalRef;
    constructor(
        public router: Router, private modalService: BsModalService, private route: ActivatedRoute, sanitizer: DomSanitizer,
        public optionservice: OptionService, public leave_typeservice: LeaveTypeService,
        public flashMessageService: FlashMessageService,
        private spinner: NgxSpinnerService
    ) {
    }


    ngOnInit() {
        // let addsub = new FormArray([]);

        this.LeaveTypeForm = new FormGroup({
            'leavetype': new FormControl(),
            'gender': new FormControl(),
            'status': new FormControl(),
            'count_type': new FormControl(),
            'count': new FormControl(),
            'max_leave_month': new FormControl(),
            'max_consecutive_leave_month': new FormControl(),
            'probation': new FormControl(),
            'half_day': new FormControl(),
            'intervening_holiday': new FormControl(),
            'over_utilization': new FormControl(),
            'unused_leave': new FormControl(),


        });


        this.leave_type = {};
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number
        });
        if (this.id) {
            this.spinner.show();
            this.optionservice.getSelectOption(6).subscribe(response => {
                this.allstatus = response.data;
                this.leave_typeservice.getLeave_typeById(this.id).subscribe((res: any) => {
                    this.leave_type = res[0];
                    if (this.leave_type.status) {
                        this.leave_type.status = this.leave_type.status.id;
                    }
                    if (this.leave_type.gender) {
                        this.leave_type.gender = this.leave_type.gender.id;
                    }
                    if (this.leave_type.over_utilization) {
                        this.leave_type.over_utilization = this.leave_type.over_utilization.id;
                    }
                    if (+this.leave_type.unused_leave === 0) {
                        this.leave_type.unused_leave = 0;
                    }
                    if (+this.leave_type.unused_leave === 1) {
                        this.leave_type.unused_leave = 1;
                    }
                    if (+this.leave_type.unused_leave === 2) {
                        this.leave_type.unused_leave = 2;
                    }
                    this.spinner.hide();
                });
            });
        } else {

            this.optionservice.getSelectOption(6).subscribe(response => {
                this.allstatus = response.data;
                this.leave_type.status = 21;
                this.leave_type.gender = 25;


            });
        }
    }

    onsubmit = () => {
        this.leave_typeservice.saveLeaveType(this.leave_type).subscribe((responseData: any) => {
            if (this.leave_type['id']) {
                if (responseData.response === 'success') {
                    this.flashMessageService.pop('success', 'Leave Type updated Succesfully', 'updated Succesfully');
                    this.router.navigate(['/settings/leave-types']);
                }
            } else {
                if (responseData.response === 'success') {
                    this.flashMessageService.pop('success', 'Leave Type added Succesfully', 'add Succesfully');
                    this.router.navigate(['/settings/leave-types']);
                }
            }
        });
    }
    cancel = () => {
        this.router.navigate(['/settings/leave-types']);
    }

}



