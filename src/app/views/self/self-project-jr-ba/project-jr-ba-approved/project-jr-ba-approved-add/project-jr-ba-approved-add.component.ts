import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AppConstants } from '../../../../../constants/app.constants';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectSalesService } from '../../../../../shared/services/project-sales.service';
import { FlashMessageService } from '../../../../../shared/services/flash-message.service';
import { FileUploadService } from '../../../../../shared/services/file-upload.service';
import { StorageManagerService } from '../../../../../shared/services/storage-manager.service';
import { UserService } from "../../../../../shared/services/user.service";
import { ProjectBaService } from "../../../../../shared/services/project-ba.service";
import * as moment from 'moment';


@Component({
    selector: 'app-project-jr-ba-approved-add',
    templateUrl: './project-jr-ba-approved-add.component.html',
    styleUrls: ['./project-jr-ba-approved-add.component.scss']
})

export class ProjectJrBaApprovedAddComponent implements OnInit {
    projectForm: FormGroup;
    employee: any = [];
    FILE_URL = AppConstants.FILE_URL;
    project_id = '';
    projectData: any = [];
    filesArr: any = [];
    docArr: any = [];
    userId;

    all_users: any = [];
    public searchTxt: any;
    empTimingRecord: any = [];
    empTimingRecordTime: any = [];
    timing_date = moment().format('YYYY-MM-DD');

    constructor(private _fb: FormBuilder,
        private router: Router,
        private userService: UserService,
        private projectBaService: ProjectBaService,
        private projectSalesService: ProjectSalesService,
        private activatedRoute: ActivatedRoute,
        private msgService: FlashMessageService,
        private fileuploadservice: FileUploadService) { }

    ngOnInit() {
        const userData = JSON.parse(StorageManagerService.getUser());
        this.userId = userData.id;
        this.activatedRoute.params.subscribe(
            (res) => {
                this.project_id = res.id;
            }
        );
        this.projectForm = this._fb.group({
            'id': [this.project_id],
            'project_doc': [],
            'searchTxt': [],
            'threshold_limit1': [],
            'threshold_limit2': [],
            'record_timing': this._fb.array([
                // this.initAddress(),
            ])
        });
        this.userService.getAllUsersExceptHR().subscribe(
            (res: any) => {
                const arr = [];
                for (const data of res) {
                    arr.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
                }
                this.all_users = arr;
            }
        );

        this.projectForm.get('searchTxt').valueChanges.subscribe((val) => {
            this.searchTxt = val;
        });
        this.getAllEmpTimingRecords();
        this.getFinalApproveProjectById();
    }
    getAllEmpTimingRecords() {

        this.projectBaService.getAllEmpTimingRecords(this.project_id).subscribe(resp => {

            this.empTimingRecord = resp['data'];
            this.empTimingRecordTime = resp['extra'];
            // console.log(resp);


        });

    }
    initAddress() {
        return this._fb.group({
            project_id: [+this.project_id],
            record_date: [null],
            emp_id: ['', Validators.required],
            record_hours: ['', Validators.required],
            redmark_comment: ['']
        });
    }

    getFinalApproveProjectById() {
        this.projectSalesService.getFinalApproveProjectById(this.project_id, true).subscribe(
            (res) => {
                this.projectData = res;
                if (this.projectData.project_doc) {
                    this.docArr = this.projectData.project_doc.split(',');
                }
                this.projectForm.get('id').setValue(this.projectData['id']);
                this.projectForm.get('threshold_limit1').setValue(this.projectData['threshold_limit1']);
                this.projectForm.get('threshold_limit2').setValue(this.projectData['threshold_limit2']);
            }
        );
    }

    async saveProject() {
        if (this.project_id && this.projectForm.valid) {
            const postData = this.projectForm.value;
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

            this.projectSalesService.updateFinalApproveProject(postData).subscribe(
                (res) => {
                    // console.log(res);
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
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
    }
    addAddress() {
        const control = <FormArray>this.projectForm.controls['record_timing'];
        control.push(this.initAddress());
    }
    removeAddress(i: number) {
        const control = <FormArray>this.projectForm.controls['record_timing'];
        control.removeAt(i);
    }
}

