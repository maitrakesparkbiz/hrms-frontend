import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { FileUploadService } from "../../../../shared/services/file-upload.service";
import { UserService } from "../../../../shared/services/user.service";
import { FlashMessageService } from "../../../../shared/services/flash-message.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PusherService } from "../../../../shared/services/pusher.sevice";
import { StorageManagerService } from "../../../../shared/services/storage-manager.service";
import * as moment from 'moment';
import { CompanyProjectService } from "../../../../shared/services/company-project.service";
import { DataTableDirective } from "angular-datatables";
import { fromEvent, Subject } from "rxjs";
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { debounceTime } from "rxjs/operators";

@Component({
    selector: 'app-ba-tl-create-project',
    templateUrl: 'ba-tl-create-project.component.html',
    styleUrls: ['./ba-tl-create-project.component.scss']
})

export class BaTlCreateProjectComponent implements OnInit {
    @ViewChild('projName') projName: TemplateRef<any>;
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    empTimingRecord: any = [];
    empTimingRecordTime: any = [];
    disable = false;

    @ViewChild('searchFilter') searchFilter: ElementRef;
    public searchTxt: any;

    public isCollapsed = false;
    projectForm: FormGroup;
    commentForm: FormGroup;
    userData: any = [];
    projectData: any = [];
    file_response: any;
    files: any;
    filesArr: any = [];
    docArr: any = [];
    project_doc = '';
    employee: any = [];
    ba_list: any = [];
    old_assigned_to: any;
    hold_comment;
    project_id = '';
    all_users: any = [];
    baList: any = [];
    timing_date = moment().format('YYYY-MM-DD');
    dropdownSettings: any = [];
    selectedItems: any = [];
    modalRef: BsModalRef;
    userId: any = '';
    oldHoldFlag: any = false;
    fromTl = false;
    isCreator = false;
    ba_dis = false;
    // is_project_hours = true;

    constructor(private _fb: FormBuilder,
                private fileuploadservice: FileUploadService,
                private spinner: NgxSpinnerService,
                private userService: UserService,
                private modalService: BsModalService,
                private companyProjectService: CompanyProjectService,
                private msgService: FlashMessageService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private pusherService: PusherService,
                private location: Location) {
    }

    ngOnInit() {
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
        };
        const user = JSON.parse(StorageManagerService.getUser());
        this.userId = user.id;
        // this.renderer2.addClass(this.agesSelect['element']['children'][0], 'custom-emp-dropdown');
        this.activatedRoute.params.subscribe(
            (res) => {
                this.project_id = res.id;
            }
        );

        this.activatedRoute.data.subscribe(
            (res) => {
                if (res.fromTl) {
                    this.fromTl = res.fromTl;
                }
            }
        );

        fromEvent(this.searchFilter.nativeElement, 'keyup')
            .pipe(
                debounceTime(200)
            ).subscribe(
            (res: any) => {
                const search = res.target.value;
                if (search) {
                    const proj_id = +this.project_id;
                    this.checkProjectName(search, proj_id);
                }

            }
        )

        this.userData = JSON.parse(StorageManagerService.getUser());
        this.projectForm = this._fb.group({
            'id': [''],
            'assigned_ba': [[]],
            'client_name': ['', Validators.required],
            'project_name': ['', Validators.required],
            'project_doc': [''],
            'est_time': [''],
            'extra_hours': [''],
            'extra_hours_comment': [''],
            'deadline': [''],
            'threshold_limit1': [''],
            'threshold_limit2': [''],
            'project_description': [''],
            'on_hold': [''],
            'searchTxt': [''],
            'hold_comment': [''],
            'created_by': [this.userData.id],
            'record_timing': this._fb.array([]),
            'from_tl': [this.fromTl]
        });

        this.getRequiredData();
    }

    getRequiredData = async () => {
        if (this.fromTl) {
            const users: any = await this.userService.getAllJBaSelfBA().toPromise();
            if (!this.project_id) {
                const arr = [];
                for (const data of users) {
                    arr.push({ item_text: data.firstname + ' ' + data.lastname, item_id: data.id });
                }
                this.baList = arr;
            }
        }
        if (this.project_id) {
            this.getProjectById();
        }
    }

    getProjectById = () => {
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

        this.companyProjectService.getProjectById(this.project_id, !this.fromTl).subscribe(
            (res) => {
                this.projectData = res.data;
                this.empTimingRecord = res.timing[0];
                this.empTimingRecordTime = res.timing[1];

                if (+this.projectData.created_by === +this.userData.id) {
                    this.isCreator = true;
                }

                if (this.projectData) {
                    if (this.projectData.project_doc) {
                        this.docArr = this.projectData.project_doc.split(',');
                    }
                    this.old_assigned_to = this.projectData.assigned_to;
                    Object.keys(this.projectForm.controls).forEach(key => {
                        if (key !== 'project_doc' && key !== 'record_timing' && key !== 'deadline') {
                            if (this.projectData[key]) {
                                this.projectForm.get(key).setValue(this.projectData[key]);
                            }
                        }
                    });
                    this.oldHoldFlag = this.projectData.on_hold ? true : false;

                    if (this.projectData.on_hold) {
                        this.disable = true;
                        this.on_Hold(true);
                    }
                    if(this.projectData.created_by !== this.userData.id)
                    {
                        this.ba_dis = true;
                    }

                    if (this.projectData.extra_hours_comment) {
                        this.projectForm.get('extra_hours_comment').setValue('');
                    }
                    if (this.projectData.deadline) {
                        this.projectForm.get('deadline').setValue(moment(this.projectData.deadline.date));
                    }

                    if (this.projectData.convs && this.projectData.convs.length > 0) {
                        this.initCommentForm();
                        const commentArray = <FormArray>this.commentForm.get('comments');
                        for (let conv of this.projectData.convs) {
                            commentArray.push(this.initSingleComment(conv));
                        }
                    }


                    if (this.projectData.BAs && this.projectData.BAs.length > 0) {

                        const selected = [];
                        for (const jr of this.projectData.BAs) {
                            selected.push({
                                item_id: jr.id,
                                item_text: jr.firstname + '' + jr.lastname
                            });
                        }
                        this.selectedItems = selected;
                    }

                    const arr = [];
                    const users: any = this.userService.getAllJBaSelfBA().subscribe(
                        (res: any) => {
                            for (const data of res) {
                                if (this.projectData.created_by != data.id) {
                                    arr.push({ item_text: data.firstname + ' ' + data.lastname, item_id: data.id });
                                }
                            }
                            this.baList = arr;
                        }
                    );
                }
            }
        );
    }

    initCommentForm = () => {
        this.commentForm = this._fb.group({
            comments: this._fb.array([])
        });
    }

    initSingleComment = (data) => {
        return this._fb.group({
            conv_id: [data.conv_id],
            msg_text: ['', Validators.required],
            emp_id: [this.userData.id],
            project_id: [+this.project_id],
            ba_project_id: [data.ba_project_id],
            is_tl: [this.fromTl]
        })
    }

    doComment = (control: FormControl, index) => {
        const postData = control.value;
        if (control.get('msg_text').value.trim()) {
            this.companyProjectService.doComment(postData).subscribe(
                (res: any) => {
                    if (res.status === 'success') {
                        this.projectData.convs[index].comments.push(res.data.comment);
                        this.sendNotifications(res.data.data);
                        control.get('msg_text').setValue(null);
                    }
                }
            )
        }
    }

    onSubmit() {
    }

    initAddress = () => {
        return this._fb.group({
            project_id: [+this.project_id],
            record_date: [null],
            emp_id: ['', Validators.required],
            record_hours: ['', [Validators.max(12), Validators.required]],
            redmark_comment: ['']
        });
    }

    BAName(index) {
        return this.projectData.BAs[index]['firstname'] + ' ' + this.projectData.BAs[index]['lastname'];
    }

    on_Hold = (val) => {
        this.hold_comment = val;
        if (val) {
            this.disable = true;
            this.removeFormArray();
            this.projectForm.get('hold_comment').setValidators(Validators.required);
            this.projectForm.get('hold_comment').updateValueAndValidity({ emitEvent: false, onlySelf: true });
        } else {
            this.disable = false;
            this.projectForm.get('hold_comment').setValue('');
            this.projectForm.get('hold_comment').clearValidators();
            this.projectForm.get('hold_comment').updateValueAndValidity({ emitEvent: false, onlySelf: true });
            this.projectForm.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        }
    }

    removeFormArray = () => {
        const control = <FormArray>this.projectForm.controls['record_timing'];
        while (control.length !== 0) {
            control.removeAt(0)
        }
    }

    saveProject = async () => {
        if (this.projectForm.valid) {
            this.spinner.show();
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

            if (postData['deadline']) {
                postData['deadline'] = moment(postData['deadline']);
            }

            if (postData['assigned_ba'] && postData['assigned_ba'].length > 0) {
                const BAs = [];
                for (const row of postData['assigned_ba']) {
                    BAs.push(row.item_id);
                }
                postData['assigned_ba'] = BAs;
            } else {
                postData['is_own'] = 1;
            }

            if (!postData['id']) {
                postData['is_tl'] = this.fromTl;
            }


            if (this.oldHoldFlag == postData['on_hold']) {
                postData['on_hold_changed'] = false;
            } else {
                postData['on_hold_changed'] = true;
            }


            this.companyProjectService.saveProject(postData).subscribe(
                (res) => {
                    this.spinner.hide();
                    if (res.status === 'created') {
                        this.msgService.pop('success', 'Project Created', 'Project Created Successfully');
                        if (res.data) {
                            this.sendNotifications(res.data);
                        }
                        this.onBack();
                    } else if (res.status === 'updated') {
                        // this.loaderService.display(true);
                        this.removeFormArray();
                        this.getProjectById();
                        this.msgService.pop('success', 'Project Updated', 'Project Updated Successfully');
                        if (res.data) {
                            // this.loaderService.display(false);
                            this.sendNotifications(res.data);
                        }

                    } else {
                        this.msgService.pop('danger', 'Error Occured', 'Error Occured');
                        this.onBack();
                    }

                }
            );
        }
    }

    checkExtraHoursValidation = (val) => {
        if (+val > 0 && this.projectForm.get('extra_hours_comment').value == '') {
            this.projectForm.get('extra_hours_comment').setErrors({ required: true });
        } else {
            this.projectForm.get('extra_hours_comment').setErrors(null);
        }
    }

    uploadDoc = (event: any) => {
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

    removeDoc = (doc) => {
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

    sendNotifications = (data) => {
        this.pusherService.sendNotifications(data).subscribe((res) => {
            if (res !== 'success') {
                this.msgService.pop('danger', 'Error', 'Error Occured While Sending Notification');
            }
        });
    }

    onBack = () => {
        this.location.back();
    }


    addAddress = () => {
        const control = <FormArray>this.projectForm.controls['record_timing'];
        control.push(this.initAddress());
    }

    removeAddress = (i: number) => {
        const control = <FormArray>this.projectForm.controls['record_timing'];
        control.removeAt(i);
    }


    onHoursChange = () => {
        const projectHours = +this.projectForm.get('est_time').value;
        const th1 = +this.projectForm.get('threshold_limit1').value;
        const th2 = +this.projectForm.get('threshold_limit2').value;
        let flag = false;

        if (th1 && th2) {
            if (th1 >= th2) {
                this.projectForm.get('threshold_limit1').setErrors({ required: true });
                flag = true;
            } else {
                this.projectForm.get('threshold_limit1').setErrors(null);
            }
        }
        if (projectHours) {
            if (!flag) {
                if (th1 && projectHours <= th1) {
                    this.projectForm.get('threshold_limit1').setErrors({ required: true });
                } else {
                    this.projectForm.get('threshold_limit1').setErrors(null);
                }
            }
            if (th2 && projectHours <= th2) {
                this.projectForm.get('threshold_limit2').setErrors({ required: true });
            } else {
                this.projectForm.get('threshold_limit2').setErrors(null);
            }
        }
    }

    checkProjectName(projectName, project_id) {
        this.companyProjectService.checkProjectNameExist(projectName, project_id).subscribe(
            (res: any) => {
                if (res === true) {
                    this.openModel(this.projName);
                }
            }
        );
    }

    openModel = (template) => {
        this.modalRef = this.modalService.show(template);
    }


    closeModel = () => {
        this.modalRef.hide();
    }
}
