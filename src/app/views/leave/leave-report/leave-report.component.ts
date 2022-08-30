import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { LeaveapplicationService } from '../../../shared/services/leaveapplication.service';
import * as moment from 'moment';
import { AppConstants } from '../../../constants/app.constants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../../shared/services/datatable.service';

@Component({
    selector: 'app-leave-report',
    templateUrl: 'leave-report.component.html',
    styleUrls: ['./leave-report.component.scss']
})

export class LeaveReportComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    modalRef: BsModalRef;
    AllLeaves: any = [];
    selectedResult: any = [];
    search;
    allcheck_id;
    leavedetail: any = {};
    leave_edit;
    Leave_status;
    allcheck_id_count: any = 0;
    IMAGE_URL = AppConstants.IMAGE_URL;
    finalApprove = false;
    edit_id;
    apiErrors = {};
    rejectForm: FormGroup;
    employee_image = '../../../../assets/img/avatars/profile_image.jpg';
    leaveForm: FormGroup;
    constructor(private leaveService: LeaveapplicationService,
        private spinner: NgxSpinnerService,
        private modalService: BsModalService,
        private flashMessageService: FlashMessageService,
        private datePipe: DatePipe,
        private datatableService: DatatableService) {
    }

    ngOnInit() {
        this.rejectForm = new FormGroup({
            'reject_reason': new FormControl('', [Validators.required])
        });
        this.leaveForm = new FormGroup({
            'duration': new FormControl('today'),
        });
        this.getLeaves();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    getLeaves = () => {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 50,
            lengthMenu: [5, 10, 25, 50],
            serverSide: true,
            processing: true,
            language: {
                searchPlaceholder: 'Search...',
                search: ''
            },
            // search: { search: this.leaveForm.get('status').value },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.columns[2].search.value = this.leaveForm.get('duration').value;
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getFirstApprovedApplications').subscribe(resp => {
                    this.allcheck_id = false;
                    this.allcheck_id_count = 0;
                    this.AllLeaves = resp.data;
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
            { name: 'firstname' },
            { name: 'leave_date' },
            { name: 'reason' },
            { name: 'status', orderable: false }]
        };
    }

    checkboxHeader = (evt: Event) => {
        this.allcheck_id_count = 0;
        if (this.allcheck_id !== true) {
            for (let i = 0; i < this.AllLeaves.length; i++) {
                this.AllLeaves[i]['isSelected'] = true;
                this.allcheck_id_count++;
            }
        } else {
            for (let i = 0; i < this.AllLeaves.length; i++) {
                this.AllLeaves[i]['isSelected'] = false;
            }
        }
        // console.log(this.dept);
    }

    checkone = (id) => {
        this.allcheck_id = false;
        let selectId = '';
        this.allcheck_id_count = 0;
        for (let i = 0; i < this.AllLeaves.length; i++) {
            if (+this.AllLeaves[i]['id'] === +id) {
                this.AllLeaves[i]['isSelected'] = !this.AllLeaves[i]['isSelected'];
                if (this.AllLeaves[i]['isSelected']) {
                    this.Leave_status = this.AllLeaves[i]['status'];
                    this.allcheck_id_count++;
                    selectId = this.AllLeaves[i];
                }
            } else {
                this.AllLeaves[i]['isSelected'] = false;
            }
        }
        if (this.allcheck_id_count === 1) {
            this.getLeaveDetail(selectId);
        }
    }

    getLeaveDetail = (leavedetail) => {
        this.leavedetail = leavedetail;
        if (this.leavedetail['final_approve']) {
            this.finalApprove = false;
        } else {
            this.finalApprove = true;
        }
        //  console.log(this.leavedetail);
    }

    getSelectedData = () => {
        this.rerender();
    }

    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    openModel = (template, id) => {
        this.rejectForm.reset();
        this.edit_id = id;
        this.modalRef = this.modalService.show(template);
    }

    closeModel = () => {
        this.modalRef.hide();
    }

    ApproveLeave = () => {
        this.leave_edit = [];
        this.leave_edit = this.AllLeaves;
        this.closeModel();
        for (let i = 0; i < this.AllLeaves.length; i++) {
            if (this.edit_id === this.leave_edit[i]['id']) {
                // this.leave_edit[i]['leave_date']['date'] =
                //     this.datePipe.transform(this.leave_edit[i]['leave_date']['date'], 'dd-MM-yyyy');
                // console.log(this.leave_edit[i]);
                // console.log(this.edit_id, this.leave_edit[i]['id']);
                this.leaveService.finalApproveLeave(this.leave_edit[i]).subscribe(
                    (res) => {
                        if (res === 'success') {
                            this.rerender();
                            this.allcheck_id_count = 0;
                            this.flashMessageService.pop('success', 'Approved', 'Leave Approved successfully');
                        }
                    },
                    error => {
                        if (error['error']) {
                            this.apiErrors = error['error'];
                        }
                        this.flashMessageService.pop('error', this.apiErrors['error'], 'Leave Insufficient');
                    }
                );
            }
        }
    }

    RejectLeave = () => {
        if (this.rejectForm.valid) {
            this.leave_edit = [];
            this.closeModel();
            this.leave_edit['reject_reason'] = this.rejectForm.get('reject_reason').value;
            this.leave_edit['id'] = this.edit_id;
            this.leaveService.updateRejectStatus(this.leave_edit).subscribe(res => {
                if (res === 'Updated Successfully') {
                    this.rerender();
                    this.allcheck_id_count = 0;
                    this.flashMessageService.pop('error', 'Leave Rejected', 'Reject Leave');
                }
            });
        }
    }
}

