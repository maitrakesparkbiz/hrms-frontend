import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AppConstants } from '../../../constants/app.constants';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../../shared/services/datatable.service';
import { ProjectCommentsService } from '../../../shared/services/project-comments.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { ConfirmPasswordValidation } from '../../../validators/confirm-password.validator';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ProjectSalesService } from '../../../shared/services/project-sales.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { Router } from '@angular/router';
import { PusherService } from '../../../shared/services/pusher.sevice';

@Component({
    selector: 'app-project-sales',
    templateUrl: 'project-sales.component.html',
    styleUrls: ['./project-sales.component.scss']
})

export class ProjectSalesComponent implements OnInit, AfterViewInit, OnDestroy {
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
    constructor(private datatableService: DatatableService,
        private projectCmtService: ProjectCommentsService,
        private projectSalesService: ProjectSalesService,
        private _fb: FormBuilder,
        private modalService: BsModalService,
        private msgService: FlashMessageService,
        private router: Router,
        private pusherService: PusherService) {
    }

    ngOnInit() {
        const userData = JSON.parse(StorageManagerService.getUser());
        this.userId = userData.id;
        this.commentForm = this._fb.group({
            'u_id': [this.userId],
            'project_id': [],
            'conv_id': [],
            'msg_text': ['', Validators.required],
            'project_ba_id': []
            // 'msg_text': ['', [Validators.pattern(/?!(^\s)|(\s$)/)]]
        });
        // this.pusherService.commentChannel.bind('App\\Events\\CommentEvent', data => {
        //     this.msgService.pop('success', 'Comment Update', 'Comment Update From Ba');
        //     if (!('Notification' in window)) {
        //         alert('Web Notification is not supported');
        //         return;
        //     }
        //     Notification
        //         .requestPermission()
        //         .then(() => {
        //             const _notify = new Notification('Comment',
        //                 { body: 'Comment Update From Ba', icon: 'https://pusher.com/static_logos/320x320.png' }
        //             );
        //             setTimeout(() => {
        //                 _notify.close();
        //             }, 3000);
        //         });
        // });
        this.getAllProjects();
    }

    openModel(template) {
        this.modalRef = this.modalService.show(template);
    }

    closeModel() {
        this.modalRef.hide();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    doComment() {
        if (this.commentForm.valid) {
            const postData = this.commentForm.value;
            this.projectCmtService.doCommentSr(postData).subscribe(
                (res) => {
                    if (res.status === 'success') {
                        this.allComments.push(res.data.comment);
                        this.commentForm.get('msg_text').setValue(null);
                        this.sendNotifications(res.data.data);
                        this.rerender();
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllProjectsDataTable').subscribe(resp => {
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


    // getProjectComments(id) {
    //     this.projectCmtService.getProjectComments(id).subscribe(
    //         (res) => {
    //             this.allComments = res;
    //             this.commentForm.get('conv_id').setValue(this.projectDetails.conv_id);
    //         }
    //     );
    // }

    getSrProjectComments(data) {
        this.projectCmtService.getSrProjectComments(data).subscribe(
            (res) => {
                if (res !== 'no_data') {
                    this.allComments = res.data;
                    this.commentForm.get('conv_id').setValue(res.conv_id);
                }
            }
        );
    }

    checkone(id) {
        let selectId: any = '';
        this.allcheck_id_count = 0;
        this.projectDetails = [];
        this.allComments = [];
        this.commentForm.get('msg_text').setValue(null);
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
            this.commentForm.get('project_id').setValue(id);
            this.commentForm.get('project_ba_id').setValue(this.projectDetails.project_ba_id);
            this.getSrProjectComments({ project_id: id, project_ba_id: this.projectDetails.project_ba_id });
            // this.getProjectComments(this.projectDetails.conv_id);
        }
    }

    approveProject() {
        this.closeModel();
        this.isDisabled = true;
        this.projectSalesService.saveFinalApproveProject(this.projectDetails).subscribe(
            (res) => {
                this.isDisabled = false;
                if (res.status && res.status === 'success') {
                    this.projectDetails['final_approved'] = 1;
                    this.msgService.pop('success', 'Project Approved', 'Project Approved Successfully');
                    this.sendNotifications(res.data.data);
                    this.router.navigate(['/self/sales/approved-projects/update-project/' + res.data.id]);
                } else {
                    this.msgService.pop('danger', 'Error Occured', 'Error Occured');
                }
            }
        );
    }
}
