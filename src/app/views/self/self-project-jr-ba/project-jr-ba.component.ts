import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AppConstants } from '../../../constants/app.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatatableService } from '../../../shared/services/datatable.service';
import { ProjectCommentsService } from '../../../shared/services/project-comments.service';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { PusherService } from '../../../shared/services/pusher.sevice';
import { FlashMessageService } from '../../../shared/services/flash-message.service';

@Component({
    selector: 'app-project-jr-ba',
    templateUrl: './project-jr-ba.component.html',
    styleUrls: ['./project-jr-ba.component.scss']
})

export class ProjectJrBaComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    allcheck_id_count = 0;
    allProjects: any = [];
    projectDetails: any = [];
    FILE_URL = AppConstants.FILE_URL;
    employee_image = '../../../../assets/img/avatars/profile_image.jpg';
    commentForm: FormGroup;
    userId: any = [];
    allComments: any = [];
    IMAGE_URL = AppConstants.IMAGE_URL;
    constructor(private datatableService: DatatableService,
        private _fb: FormBuilder,
        private projectCmtService: ProjectCommentsService,
        private msgService: FlashMessageService,
        private pusherService: PusherService) {

    }

    ngOnInit() {
        const userData = JSON.parse(StorageManagerService.getUser());
        this.userId = userData.id;
        this.commentForm = this._fb.group({
            'u_id': [this.userId],
            'conv_id': [],
            'msg_text': ['', Validators.required],
            'project_ba_id': [],
            'project_jr_ba_id': [],
            'jr_ba': [true]
        });


        this.getAllProjects();
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
            this.projectCmtService.doCommentJr(postData).subscribe(
                (res) => {
                    if (res.status === 'success') {
                        this.allComments.push(res.data.comment);
                        this.sendNotification(res.data.data);
                        this.commentForm.get('msg_text').setValue(null);
                        this.rerender();
                    }
                }
            );
        }
    }

    sendNotification(data) {
        this.pusherService.sendNotifications(data).subscribe((res) => {
            if (res !== 'success') {
                this.msgService.pop('danger', 'Error', 'Error Occured While Sending Notification');
            }
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllProjectsJrBaDataTable').subscribe(resp => {
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
            { name: 'created_at' },
            { name: 'est_time' },
            { name: 'falg', orderable: false }]
        };
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }
    getJrProjectComments(data) {
        this.projectCmtService.getJrProjectComments(data).subscribe(
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
            this.commentForm.get('project_ba_id').setValue(this.projectDetails.project_ba_id);
            this.commentForm.get('project_jr_ba_id').setValue(this.projectDetails.project_jr_ba_id);
            this.getJrProjectComments({
                project_id: id,
                project_ba_id: this.projectDetails.project_ba_id,
                project_jr_ba_id: this.projectDetails.project_jr_ba_id
            });
        }
    }

}

