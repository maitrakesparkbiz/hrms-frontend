import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';
import { FileUploadService } from '../../../../shared/services/file-upload.service';
import { UserService } from '../../../../shared/services/user.service';
import { ProjectSalesService } from '../../../../shared/services/project-sales.service';
import { FlashMessageService } from '../../../../shared/services/flash-message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PusherService } from '../../../../shared/services/pusher.sevice';
import { BsModalRef, BsModalService } from "ngx-bootstrap";

@Component({
    selector: 'app-project-sales-add',
    templateUrl: 'project-sales-add.component.html',
    styleUrls: ['./project-sales-add.component.scss']
})

export class ProjectSalesAddComponent implements OnInit, AfterViewInit {
    projectForm: FormGroup;
    userData: any = [];
    projectData: any = [];
    id;
    file_response: any;
    files: any;
    filesArr: any = [];
    docArr: any = [];
    project_doc = '';
    employee: any = [];
    ba_list: any = [];
    old_assigned_to: any;

    modalRef: BsModalRef;
    @ViewChild('empSelect') agesSelect: ElementRef;
    @ViewChild('updates') updated: TemplateRef<any>;
    constructor(private _fb: FormBuilder,
        private fileuploadservice: FileUploadService,
        private renderer2: Renderer2,
        private modalService: BsModalService,
        private userService: UserService,
        private projectSalesService: ProjectSalesService,
        private msgService: FlashMessageService,
        private route: ActivatedRoute,
        private router: Router,
        private pusherService: PusherService) {
    }

    ngOnInit() {
        // this.renderer2.addClass(this.agesSelect['element']['children'][0], 'custom-emp-dropdown');
        this.route.params.subscribe(
            (res) => {
                if (res.id) {
                    this.id = res.id;
                }
            }
        );

        this.userData = JSON.parse(StorageManagerService.getUser());
        this.projectForm = this._fb.group({
            'id': [''],
            'client_name': ['', Validators.required],
            'project_name': ['', Validators.required],
            'project_doc': [],
            'client_email': [''],
            'skype_contact': [''],
            'project_description': [''],
            'assigned_to': ['', Validators.required],
            'status_flag': [],
            'created_by': [this.userData.id]
        });
        // this.userService.getAllUsersSelf().subscribe(
        //     (res: any) => {
        //         const arr = [];
        //         for (const data of res) {
        //             arr.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
        //         }
        //         this.employee = arr;
        //     }
        // );
        this.projectSalesService.getAllBASelfSales().subscribe(
            (res: any) => {
                const arr = [];
                for (const data of res) {
                    arr.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
                }
                this.ba_list = arr;
            }
        );
        if (this.id) {
            this.projectSalesService.getProjectById(this.id).subscribe(
                (res) => {
                    this.projectData = res;
                    if (this.projectData) {
                        if (this.projectData.project_doc) {
                            this.docArr = this.projectData.project_doc.split(',');
                        }
                        this.old_assigned_to = this.projectData.assigned_to;
                        Object.keys(this.projectForm.controls).forEach(key => {
                            if (key !== 'project_doc') {
                                if (this.projectData[key]) {
                                    this.projectForm.get(key).setValue(this.projectData[key]);
                                }
                            }
                        });

                        // Object.keys(this.projectData).forEach(key => {
                        //     if (key !== 'project_doc') {
                        //         this.projectForm.get(key).setValue(this.projectData[key]);
                        //     }
                        // });
                    }
                }
            );
        } else {
            this.projectForm.get('status_flag').setValue(126);
        }
    }

    ngAfterViewInit() {
        if (!this.id) {
            this.renderer2.addClass(this.agesSelect['element']['children'][0], 'custom-emp-dropdown');
        }
    }

    saveProject() {
        if (this.projectForm.valid) {
            if (this.projectData.est_time > 0) {
                this.modalRef = this.modalService.show(this.updated);
            } else {
                this.submitForm();
            }
        }
    }

    async submitForm(reSubmitted = false) {
        const postData = this.projectForm.value;
        if (+this.old_assigned_to !== +postData.assigned_to) {
            postData.status_flag = 126;
        }
        postData['project_doc'] = [];

        // multiple docs
        const fData: FormData = new FormData;
        if (this.filesArr.length > 0) {
            for (const file of this.filesArr) {
                fData.append('files[]', file);
            }
            await this.fileuploadservice.multipleFileUpload(fData).toPromise();
        }
        postData['project_doc'] = this.docArr.join();

        if (this.id) {
            if (reSubmitted) {
                postData['status_flag'] = 135;
                postData['reSubmitted'] = true;
                // after est sent - restimation
            } else {
                postData['status_flag'] = 134;
                postData['reSubmitted'] = false;
                // before est sent - project updated
            }
        }
        if (this.modalRef) {
            this.closeModel();
        }
        this.projectSalesService.saveProject(postData).subscribe(
            (res) => {
                if (res.status === 'created') {
                    this.msgService.pop('success', 'Project Created', 'Project Created Successfully');
                    this.sendNotifications(res.data);
                } else if (res.status === 'updated') {
                    this.msgService.pop('success', 'Project Updated', 'Project Updated Successfully');
                    if (res.data) {
                        this.sendNotifications(res.data);
                    }
                } else {
                    this.msgService.pop('danger', 'Error Occured', 'Error Occured');
                }
                this.onBack();
            }
        );
    }

    uploadDoc(event: any) {
        const files = event.target.files;
        for (const file of files) {
            let flag = true;
            this.docArr.forEach((value) => {
                if (value === file.name) {
                    flag = false;
                }
            });
            if (flag) {
                this.filesArr.push(file);
                this.docArr.push(file.name);
            }
        }
    }

    removeDoc(doc) {
        for (let i = 0; i < this.filesArr.length; i++) {
            if (this.filesArr[i]['name'] === doc) {
                this.filesArr.splice(i, 1);
            }
        }
        this.docArr.forEach((value, key) => {
            if (value === doc) {
                this.docArr.splice(key, 1);
            }
        });
    }
    sendNotifications(data) {
        this.pusherService.sendNotifications(data).subscribe((res) => {
            if (res !== 'success') {
                this.msgService.pop('danger', 'Error', 'Error Occured While Sending Notification');
            }
        });
    }
    onBack() {
        this.router.navigate(['/self/sales/projects-sales']);
    }
    closeModel() {
        this.modalRef.hide();
    }
}
