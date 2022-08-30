import { Component, OnInit, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FileUploadService } from '../../../../../shared/services/file-upload.service';
import { UserService } from '../../../../../shared/services/user.service';
import { ProjectSalesService } from '../../../../../shared/services/project-sales.service';
import { FlashMessageService } from '../../../../../shared/services/flash-message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageManagerService } from '../../../../../shared/services/storage-manager.service';

@Component({
    selector: 'app-project-sales-approved-add',
    templateUrl: './project-sales-approved-add.component.html',
    styleUrls: ['./project-sales-approved-add.component.scss']
})

export class ProjectSalesApprovedAddComponent implements OnInit, AfterViewInit {
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
    old_assigned_ba: any;
    @ViewChild('empSelect') empSelect: ElementRef;

    constructor(private _fb: FormBuilder,
        private fileuploadservice: FileUploadService,
        private renderer2: Renderer2,
        private userService: UserService,
        private projectSalesService: ProjectSalesService,
        private msgService: FlashMessageService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {
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
            'client_email': ['', Validators.required],
            'skype_contact': ['', Validators.required],
            'project_description': ['', Validators.required],
            'assigned_ba': ['', Validators.required],
            'est_time': [],
            'approved_est_time': ['', Validators.required],
            'approved_extra_hours': [''],
            'approved_extra_hours_reason': [''],
        });
        // console.log(this.projectData);

        this.userService.getAllUsersSelf().subscribe(
            (res: any) => {
                const arr = [];
                for (const data of res) {
                    arr.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
                }
                this.employee = arr;
            }
        );
        this.projectSalesService.getFinalApproveProjectById(this.id).subscribe(
            (res) => {
                this.projectData = res;
                // if (+this.projectData.approved_est_time > 0) {
                //     this.projectForm.controls['approved_extra_hours'].setValidators([Validators.required]);
                //     this.projectForm.controls['approved_extra_hours_reason'].setValidators([Validators.required]);
                // }
                if (this.projectData.project_doc) {
                    this.docArr = this.projectData.project_doc.split(',');
                }
                this.old_assigned_ba = this.projectData.assigned_ba;
                Object.keys(this.projectForm.controls).forEach((index) => {
                    if (index !== 'project_doc') {
                        this.projectForm.get(index).setValue(this.projectData[index]);
                    }
                });
            }
        );
    }

    ngAfterViewInit() {
        if (!this.id) {
            this.renderer2.addClass(this.empSelect['element']['children'][0], 'custom-emp-dropdown');
        }
    }

    checkExtraHoursValidation(val) {
        if (+val > 0 && this.projectForm.get('approved_extra_hours_reason').value == '') {
            this.projectForm.get('approved_extra_hours_reason').setErrors({ required: true });
        } else {
            this.projectForm.get('approved_extra_hours_reason').setErrors(null);
        }
    }

    async saveProject() {
        if (this.id && this.projectForm.valid) {
            const postData = this.projectForm.value;
            postData['project_doc'] = [];
            postData['created_by'] = this.userData.id;
            if (+postData['assigned_ba'] !== +this.old_assigned_ba) {
                postData['ba_changed'] = true;
                postData['old_ba'] = this.old_assigned_ba;
            } else {
                postData['ba_changed'] = false;
            }

            // multiple docs
            const fData: FormData = new FormData;
            if (this.filesArr.length > 0) {
                for (const file of this.filesArr) {
                    fData.append('files[]', file);
                }
                await this.fileuploadservice.multipleFileUpload(fData).toPromise();
            }
            postData['project_doc'] = this.docArr.join();
            this.projectSalesService.updateFinalApproveProject(postData).subscribe(
                (res) => {
                    if (res.status === 'updated') {
                        this.msgService.pop('success', 'Project Updated', 'Project Updated Successfully');
                    } else {
                        this.msgService.pop('danger', 'Error Occured', 'Error Occured');
                    }
                    this.onBack();
                }
            );
        }
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

    onBack() {
        this.router.navigate(['/self/sales/approved-projects']);
    }
}
