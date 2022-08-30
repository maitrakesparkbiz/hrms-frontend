import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ProjectSalesService } from '../../../../shared/services/project-sales.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AppConstants } from '../../../../constants/app.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DatatableService } from '../../../../shared/services/datatable.service';
import { FlashMessageService } from '../../../../shared/services/flash-message.service';
import { Router } from '@angular/router';
import { ProjectCommentsService } from '../../../../shared/services/project-comments.service';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';
import { PusherService } from '../../../../shared/services/pusher.sevice';
@Component({
    selector: 'app-project-sales-approved',
    templateUrl: './project-sales-approved.component.html',
    styleUrls: ['./project-sales-approved.component.scss']
})

export class ProjectSalesApprovedComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    allcheck_id_count = 0;
    allProjects: any = [];
    projectDetails: any = [];
    IMAGE_URL = AppConstants.IMAGE_URL;
    FILE_URL = AppConstants.FILE_URL;
    employee_image = '../../../../assets/img/avatars/profile_image.jpg';
    commentForm: FormGroup;
    userId: any = [];
    allComments: any = [];
    modalRef: BsModalRef;
    isDisabled: Boolean = false;
    isDisabledStart: Boolean = false;
    constructor(private datatableService: DatatableService,
        private projectSalesService: ProjectSalesService,
        private _fb: FormBuilder,
        private modalService: BsModalService,
        private msgService: FlashMessageService,
        private pusherService: PusherService,
        private projectCmtService: ProjectCommentsService) {

    }
    ngOnInit() {
        const user = JSON.parse(StorageManagerService.getUser());
        this.userId = user.id;
        this.commentForm = this._fb.group({
            'conv_id': [],
            'u_id': [],
            'project_id': [],
            'project_flag_id': [],
            'msg_text': ['', Validators.required]
        });
        this.getAllProjects();
    }

    doComment() {
        this.isDisabled = true;
        if (this.commentForm.valid) {
            const postData = this.commentForm.value;
            this.projectCmtService.doApprovedCommentSr(postData).subscribe(
                (res) => {
                    if (res.status === 'success') {
                        this.isDisabled = false;
                        this.allComments.push(res.data.comment);
                        this.commentForm.get('msg_text').setValue(null);
                        this.sendNotifications(res.data.data);
                        this.rerender();
                    } else {
                        this.msgService.pop('danger', 'Error Occured', 'Error Occured while sending comment');
                    }
                }
            );
        }
    }

    sendNotifications(data) {
        this.pusherService.sendNotifications(data).subscribe((res) => {
            if (res !== 'success') {
                this.msgService.pop('danger', 'Error', 'Error Occured While Sending Notification');
            }
        });
    }

    getApprovedProjectComments(data) {
        this.projectCmtService.getApprovedProjectComments(data).subscribe(
            (res) => {
                if (res !== 'no_data') {
                    this.allComments = res.data;
                    this.commentForm.get('conv_id').setValue(res.conv_id);
                }
            }
        );
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    getAllProjects() {
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
            // search: { search: this.leaveForm.get('status').value },
            ajax: (dataTablesParameters: any, callback) => {
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllApprovedProjectsDataTable').subscribe(resp => {
                    this.allcheck_id_count = 0;
                    this.allProjects = resp.data;
                    this.allProjects.forEach(row => {
                        if (row['project_doc']) {
                            row['project_doc'] = row['project_doc'].split(',');
                        } else {
                            row['project_doc'] = [];
                        }
                    });
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
            { name: 'project_name' },
            { name: 'client_name' },
            { name: 'firstname' },
            { name: 'created_at' },
            { name: 'status', orderable: false }]
        };
    }

    checkone(id) {
        let selectId: any = '';
        this.allcheck_id_count = 0;
        this.projectDetails = [];
        this.allComments = [];
        // this.commentForm.get('msg_text').setValue(null);
        for (let i = 0; i < this.allProjects.length; i++) {
            if (+this.allProjects[i]['id'] === +id) {
                this.allProjects[i]['isSelected'] = !this.allProjects[i]['isSelected'];
                if (this.allProjects[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selectId = this.allProjects[i];
                }
            } else {
                this.allProjects[i]['isSelected'] = false;
            }
        }
        if (this.allcheck_id_count === 1) {
            this.projectDetails = selectId;
            this.commentForm.get('u_id').setValue(this.userId);
            this.commentForm.get('project_id').setValue(this.projectDetails.id);
            this.commentForm.get('project_flag_id').setValue(this.projectDetails.project_flag_id);
            this.getApprovedProjectComments({ project_id: id, user1: this.userId, user2: this.projectDetails.emp_id });
        }
    }

    openModel(template) {
        this.modalRef = this.modalService.show(template);
    }

    closeModel() {
        this.modalRef.hide();
    }

    startProject() {
        this.closeModel();
        this.isDisabledStart = true;
        const data = { 'id': this.projectDetails['id'], 'project_flag_id': this.projectDetails['project_flag_id'] };
        this.projectSalesService.startApprovedProject(data).subscribe(
            (res) => {
                if (res.status === 'updated') {
                    this.sendNotifications(res.data);
                    this.rerender();
                }
            }
        );
    }
}
