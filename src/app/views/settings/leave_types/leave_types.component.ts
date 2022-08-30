import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { LeaveTypeService } from '../../../shared/services/leave_type.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    templateUrl: 'leave_types.component.html',
    styleUrls: ['./leave_types.component.scss']

})
export class LeaveTypesComponent implements OnInit {
    public invoiceForm: FormGroup;
    editForm: FormGroup;
    public btnstatus = false;
    allcheck_id;
    allcheck_id_count: any = 0;
    dept_edit;
    leavedetail: any = {};
    department: any = {};
    data: any = [];
    public dept;
    modalRef: BsModalRef;
    public addsub = new FormArray([]);
    public editdept = new FormArray([]);

    constructor(
        public router: Router, private modalService: BsModalService, public leavetypeservice: LeaveTypeService,
        public flashMessageService: FlashMessageService, private spinner: NgxSpinnerService
    ) {
    }


    ngOnInit() {
        // let addsub = new FormArray([]);
        this.invoiceForm = new FormGroup({
            'dep_name': new FormControl(null, Validators.required),
            'addsub': this.addsub
        });
        this.editForm = new FormGroup({
            'editdept': this.editdept
        });
        this.getLeaveType();


    }
    getLeaveType = () => {
        this.spinner.show();
        this.leavetypeservice.getAllLeaveTypes().subscribe((res: any) => {

            this.dept = res;
            this.spinner.hide();
        });
    }

    EditAward = () => {
        this.allcheck_id_count = 0;
        this.dept_edit = [];
        this.dept_edit = this.dept;
        for (let i = 0; i < this.dept.length; i++) {
            if (this.dept_edit[i]['isSelected']) {
                this.router.navigate(['/settings/leave-types/edit-leavetypes/' + this.dept_edit[i].id]);
            }
        }

    }
    deleteleavetype() {
        this.allcheck_id_count = 0;
        this.dept_edit = this.dept;
        this.leavetypeservice.deleteLeaveType(this.dept_edit).subscribe((responseData: any) => {
            if (responseData.response === 'success') {
                this.closeModel();
                this.leavedetail = [];
                this.flashMessageService.pop('error', 'Leave Type Deleted Succesfully', 'Deleted Succesfully');
                this.getLeaveType();
            }

        });
    }

    checkboxHeader = (evt: Event) => {

        this.allcheck_id_count = 0;
        if (this.allcheck_id !== true) {
            for (let i = 0; i < this.dept.length; i++) {
                this.dept[i]['isSelected'] = true;
                this.allcheck_id_count++;
            }
        } else {
            for (let i = 0; i < this.dept.length; i++) {
                this.dept[i]['isSelected'] = false;

            }
        }
        // console.log(this.dept);
    }
    checkone = (id) => {
        this.allcheck_id = false;
        let selectId = '';
        this.allcheck_id_count = 0;
        // let tempCount = 0;
        setTimeout(() => {
        for (let i = 0; i < this.dept.length; i++) {
            if (+id === +this.dept[i]['id']) {
                this.dept[i]['isSelected'] = !this.dept[i]['isSelected'];
                if (this.dept[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selectId = this.dept[i]['id'];
                }
            } else {
                this.dept[i]['isSelected'] = false;
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
            this.getdetail(selectId);
        }
        }, 100);
    }

    // checkone(id) {
    //     this.allcheck_id = false;
    //     let selectId = '';
    //     this.leavedetail = [];
    //     this.allcheck_id_count = 0;
    //     setTimeout(() => {
    //         for (let i = 0; i < this.dept.length; i++) {
    //             if (+this.dept[i]['id'] === +id) {
    //                 if (this.dept[i]['isSelected']) {
    //                     this.allcheck_id_count++;
    //                     selectId = this.dept[i]['id'];
    //                 }
    //             } else {
    //                 this.dept[i]['isSelected'] = false;
    //             }
    //         }
    //         if (this.allcheck_id_count === 1) {
    //             this.getdetail(selectId);
    //         }
    //     }, 100);
    // }

    getdetail = (id) => {
        this.leavetypeservice.getLeave_typeById(id).subscribe(res => {
            this.leavedetail = res[0];
            if (this.leavedetail['gender']) {
                this.leavedetail['gender'] = this.leavedetail['gender']['key_text'];
            }
            if (this.leavedetail['status']) {
                this.leavedetail['status'] = this.leavedetail['status']['key_text'];
            }

            if (this.leavedetail['probation'] === 1) {
                this.leavedetail['probation'] = 'Yes';
            }
            if (this.leavedetail['probation'] === 0) {
                this.leavedetail['probation'] = 'No';
            }
            if (this.leavedetail['intervening_holiday'] === 1) {
                this.leavedetail['intervening_holiday'] = 'Yes';
            }
            if (this.leavedetail['intervening_holiday'] === 0) {
                this.leavedetail['intervening_holiday'] = 'No';
            }
            if (this.leavedetail['unused_leave'] === 1) {
                this.leavedetail['unused_leave'] = 'Lapse';
            }

            if (this.leavedetail['unused_leave'] === 0) {
                this.leavedetail['unused_leave'] = 'Carry Forward';
            }
            if (this.leavedetail['unused_leave'] === 2) {
                this.leavedetail['unused_leave'] = 'Paid';
            }
            if (this.leavedetail['half_day'] === 1) {
                this.leavedetail['half_day'] = 'Yes';
            }
            if (this.leavedetail['half_day'] === 0) {
                this.leavedetail['half_day'] = 'No';
            }
            if (this.leavedetail['over_utilization']) {
                this.leavedetail['over_utilization'] = this.leavedetail['over_utilization']['key_text'];
            }

        });
    }

    closeModel = () =>{
        this.modalRef.hide();
        this.invoiceForm.reset();
        while (this.addsub.length !== 0) {
            this.addsub.removeAt(0);
        }
    }


    deleteModel = (template) =>{
        this.modalRef = this.modalService.show(template);
    }

}



