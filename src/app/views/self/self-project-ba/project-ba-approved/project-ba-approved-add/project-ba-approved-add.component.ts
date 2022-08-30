import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AppConstants } from '../../../../../constants/app.constants';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../../shared/services/user.service';
import { FlashMessageService } from '../../../../../shared/services/flash-message.service';
import { ProjectCommentsService } from '../../../../../shared/services/project-comments.service';
import { StorageManagerService } from '../../../../../shared/services/storage-manager.service';
import { ProjectSalesService } from '../../../../../shared/services/project-sales.service';
import * as moment from 'moment';
import { FileUploadService } from '../../../../../shared/services/file-upload.service';
import { PusherService } from '../../../../../shared/services/pusher.sevice';
import { ProjectBaService } from "../../../../../shared/services/project-ba.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { DatatableService } from "../../../../../shared/services/datatable.service";
@Component({
    selector: 'app-project-ba-approved-add',
    templateUrl: './project-ba-approved-add.component.html',
    styleUrls: ['./project-ba-approved-add.component.scss']
})

export class ProjectBaApprovedAddComponent implements OnInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    empTimingRecord: any = [];
    empTimingRecordTime: any = [];
    public searchTxt: any;


    projectForm: FormGroup;
    employee: any = [];
    all_users: any = [];
    jba_list: any = [];
    FILE_URL = AppConstants.FILE_URL;
    project_id = '';
    projectData: any = [];
    commentFormSales: FormGroup;
    commentFormJrBa: FormGroup;
    userId;
    old_assigned_ba: any;
    filesArr: any = [];
    docArr: any = [];
    disableUpdate = false;
    hold_comment;
    timing_date = moment().format('YYYY-MM-DD');
    constructor(private _fb: FormBuilder,
        private router: Router,
        private userService: UserService,
        private projectSalesService: ProjectSalesService,
        private activatedRoute: ActivatedRoute,
        private msgService: FlashMessageService,
        private projectBaService: ProjectBaService,
        private projectCmtService: ProjectCommentsService,
        private fileuploadservice: FileUploadService,
        private datatableService: DatatableService,
        private pusherService: PusherService) { }

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
            'assigned_jr_ba': [],
            'assigned_ba': [this.userId],
            'deadline': [],
            'project_doc': [],
            'threshold_limit1': [],
            'threshold_limit2': [],
            'searchTxt': [],
            'ba_project_hours': [],
            'on_hold': [],
            'hold_comment': [],
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
        })
        this.getAllEmpTimingRecords();


        // this.userService.getAllUsersSelf().subscribe(
        //     (res: any) => {
        //         const arr = [];
        //         for (const data of res) {
        //             arr.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
        //         }
        //         this.employee = arr;
        //     }
        // );
        this.projectBaService.getAllJBaSelfBA().subscribe(
            (res: any) => {
                const arr = [];
                for (const data of res) {
                    arr.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
                }
                this.jba_list = arr;
            }
        );
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
        this.projectSalesService.getFinalApproveProjectById(this.project_id, false, true).subscribe(
            (res) => {
                this.projectData = res;

                if (this.projectData.project_doc) {
                    this.docArr = this.projectData.project_doc.split(',');
                }
                this.old_assigned_ba = this.projectData.assigned_jr_ba;
                if (this.projectData.deadline) {
                    this.projectForm.get('deadline').setValue(moment(this.projectData.deadline.date));
                }
                Object.keys(this.projectForm.controls).forEach((index) => {
                    if (index !== 'project_doc' && index !== 'deadline' && index !== 'record_timing') {
                        this.projectForm.get(index).setValue(this.projectData[index]);
                    }
                });

                if (this.projectData.on_hold) {
                    this.on_Hold(true);

                    }

                this.initCmtSales();
                this.initCmtJrBa();
            }
        );
    }

    initCmtSales() {
        this.commentFormSales = this._fb.group({
            'conv_id': [this.projectData.sr_conv_id],
            'u_id': [this.userId],
            'project_id': [this.project_id],
            'project_flag_id': [this.projectData.flag_id],
            'msg_text': ['', Validators.required],
            'sr_ba': [true]
        });
    }

    initCmtJrBa() {
        this.commentFormJrBa = this._fb.group({
            'conv_id': [this.projectData.jr_conv_id],
            'u_id': [this.userId],
            'project_id': [this.project_id],
            'project_flag_id': [this.projectData.flag_id],
            'msg_text': ['', Validators.required]
        });
    }


    async saveProject() {
        if (this.projectForm.valid) {
            this.disableUpdate = true;
            const postData = this.projectForm.value;
            postData.created_by = this.projectData['created_by'];
            postData.flag_id = this.projectData['flag_id'];
            if (+this.old_assigned_ba !== +postData.assigned_jr_ba) {
                postData.jr_ba_changed = true;
                postData.old_jr_ba = this.old_assigned_ba;
            } else {
                postData.jr_ba_changed = false;
            }

            if (postData['deadline']) {
                postData['deadline'] = moment(postData['deadline']).format();
            }

            if (this.projectForm.get('deadline').dirty && this.projectForm.get('deadline').touched) {
                postData['deadline_changed'] = true;
            }

            if (this.projectForm.get('threshold_limit1').dirty && this.projectForm.get('threshold_limit1').touched) {
                postData['thlimit1_changed'] = true;
            }

            if (this.projectForm.get('threshold_limit2').dirty && this.projectForm.get('threshold_limit2').touched) {
                postData['thlimit2_changed'] = true;
            }

            // multiple docs
            if (this.filesArr.length > 0) {
                const fData: FormData = new FormData;
                for (const file of this.filesArr) {
                    fData.append('files[]', file);
                }
                await this.fileuploadservice.multipleFileUpload(fData).toPromise();
            }
            postData['project_doc'] = this.docArr.join();
            // console.log(postData);
            // console.log(this.projectForm);
            this.projectSalesService.updateFinalApproveProject(postData).subscribe(
                (res) => {
                    this.disableUpdate = false;
                    if (res.status === 'updated') {
                        this.msgService.pop('success', 'Project Updated', 'Project Updated Successfully');
                        if (res.data) {
                            this.sendNotifications(res.data);
                        }
                        this.getFinalApproveProjectById();
                        this.onBack();
                        // this.router.navigate(['/self/ba/approved-projects']);
                    } else {
                        this.msgService.pop('danger', 'Error Occured', 'Error Occured');
                    }
                }
            );
        }

    }
    // checkHoldComment(val) {
    //     // console.log('in')
    //         if(val == '') {
    //             // console.log('if')
    //             if(this.projectData.on_hold) {
    //                 // console.log('inner if');
    //
    //             this.projectForm.get('hold_comment').setErrors({ required: true });
    //
    //         }
    //     } else {
    //             // console.log('else')
    //             this.projectForm.get('hold_comment').setErrors(null);
    //     }
    //     // console.log(this.projectForm);
    // }
    on_Hold(val) {
        // console.log(val);
        this.hold_comment = val;
        if(val){

            this.projectForm.get('hold_comment').setValidators(Validators.required);
            this.projectForm.get('hold_comment').updateValueAndValidity({emitEvent:false, onlySelf:true});
        }else{
            this.projectForm.get('hold_comment').setValue('');
            this.projectForm.get('hold_comment').clearValidators();
            this.projectForm.get('hold_comment').updateValueAndValidity({emitEvent:false, onlySelf:true});
            this.projectForm.updateValueAndValidity({emitEvent:false, onlySelf:true});
        }
        // console.log(this.projectForm);
        // if(val == false) {
        //     if(this.projectData.hold_comment != '') {
        //         this.projectForm.get('hold_comment').setValue('');
        //     }
        // }
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

    doCommentSr() {
        if (this.commentFormSales.valid) {
            const postData = this.commentFormSales.value;
            this.projectCmtService.doApprovedCommentSr(postData).subscribe(
                (res) => {
                    if (res.status === 'success') {
                        this.projectData.sr_comments.push(res.data.comment);
                        this.commentFormSales.get('msg_text').setValue(null);
                        this.sendNotifications(res.data.data);
                    }
                }
            );
        }
    }

    doCommentJr() {
        if (this.commentFormJrBa.valid) {
            const postData = this.commentFormJrBa.value;
            this.projectCmtService.doApprovedCommentJr(postData).subscribe(
                (res) => {
                    if (res.status === 'success') {
                        this.projectData.jr_comments.push(res.data.comment);
                        this.commentFormJrBa.get('msg_text').setValue(null);
                        this.sendNotifications(res.data.data);
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


    addAddress() {
        const control = <FormArray>this.projectForm.controls['record_timing'];
        control.push(this.initAddress());
    }
    removeAddress(i: number) {
        const control = <FormArray>this.projectForm.controls['record_timing'];
        control.removeAt(i);
    }
}
