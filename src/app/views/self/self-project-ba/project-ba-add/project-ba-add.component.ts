import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../shared/services/user.service';
import { AppConstants } from '../../../../constants/app.constants';
import { ProjectBaService } from '../../../../shared/services/project-ba.service';
import { FlashMessageService } from '../../../../shared/services/flash-message.service';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';
import { ProjectCommentsService } from '../../../../shared/services/project-comments.service';
import { NgOption } from '@ng-select/ng-select';
import { ProjectJrBaService } from '../../../../shared/services/project-jr-ba.service';
import { PusherService } from '../../../../shared/services/pusher.sevice';

@Component({
    selector: 'app-project-ba-add',
    templateUrl: 'project-ba-add.component.html',
    styleUrls: ['./project-ba-add.component.scss']
})

export class ProjectBaAddComponent implements OnInit {
    projectForm: FormGroup;
    employee: any = [];
    FILE_URL = AppConstants.FILE_URL;
    project_id = '';
    projectData: any = [];
    commentFormSales: FormGroup;
    commentFormJrBa: FormGroup;
    userId;
    dropdownList: any = [];
    jba_list: any = [];
    dropdownSettings: any = [];
    selectedItems: any = [];
    old_est_hours = 0;

    constructor(private _fb: FormBuilder,
        private router: Router,
        private userService: UserService,
        private projectBaService: ProjectBaService,
        private activatedRoute: ActivatedRoute,
        private msgService: FlashMessageService,
        private projectCmtService: ProjectCommentsService,
        private pusherService: PusherService) {
    }

    ngOnInit() {
        const userData = JSON.parse(StorageManagerService.getUser());
        this.initCmtJrBa();
        this.userId = userData.id;
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
        };
        this.activatedRoute.params.subscribe(
            (res) => {
                this.project_id = res.id;
            }
        );
        this.projectForm = this._fb.group({
            'id': [this.project_id],
            'proj_id': [],
            'est_time': [],
            'jr_ba': []
        });


        // this.userService.getAllUsersSelf().subscribe(
        //     (res: any) => {
        //         const arr = [];
        //         for (const data of res) {
        //             arr.push({
        //                 item_text: data.firstname + ' ' + data.lastname, item_id: data.id
        //             });
        //         }
        //         this.dropdownList = arr;
        //     }
        // );
        this.projectBaService.getAllJBaSelfBA().subscribe(
            (res: any) => {
                const arr = [];
                for (const data of res) {
                    arr.push({
                        item_text: data.firstname + ' ' + data.lastname, item_id: data.id
                    });
                }
                this.jba_list = arr;
            }
        );

        this.projectBaService.getBaProjectById(this.project_id).subscribe(
            (res) => {
                this.projectData = res;
                if (this.projectData.project_doc) {
                    this.projectData.project_doc = this.projectData.project_doc.split(',');
                } else {
                    this.projectData.project_doc = [];
                }

                if (this.projectData.est_time > 0) {
                    this.projectForm.get('est_time').setValue(this.projectData.est_time);
                    this.old_est_hours = this.projectData.est_time;
                }
                if (this.projectData.jr_ba) {
                    const selected = [];
                    for (const jr of this.projectData.jr_ba) {
                        selected.push({
                            item_id: jr.id,
                            item_text: jr.firstname + '' + jr.lastname
                        });
                    }
                    this.selectedItems = selected;
                }
                this.projectForm.get('proj_id').setValue(this.projectData.project_id);
                this.initCmtSales();
                const fbArray = <FormArray>this.commentFormJrBa.controls['comments'];
                for (const jrComments of this.projectData.jrConvs) {
                    fbArray.push(this.commentArray({
                        'conv_id': jrComments['conv_id'],
                        'project_jr_ba_id': jrComments['project_jr_ba_id']
                    }));
                }
            }
        );
    }

    initCmtSales() {
        this.commentFormSales = this._fb.group({
            'u_id': [this.userId],
            'project_id': [this.projectData.project_id],
            'conv_id': [this.projectData.srConvs.conv_id],
            'msg_text': ['', Validators.required],
            'project_ba_id': [this.projectData.id],
            'sr_ba': [true]
        });
    }

    initCmtJrBa() {
        this.commentFormJrBa = this._fb.group({
            'comments': this._fb.array([])
        });
    }

    commentArray(data) {
        return this._fb.group({
            'u_id': [this.userId],
            'conv_id': [data.conv_id],
            'msg_text': ['', Validators.required],
            'project_ba_id': [this.projectData.id],
            'project_jr_ba_id': [data.project_jr_ba_id]
        });
    }

    saveProject() {
        const postData = this.projectForm.value;

        if (postData['jr_ba'].length > 0) {
            const temp = [];
            for (const data of postData['jr_ba']) {
                temp.push(data.item_id);
            }
            postData['jr_ba'] = temp;
        }

        if (+this.old_est_hours !== +postData['est_time']) {
            postData['est_time_changed'] = true;
        } else {
            postData['est_time_changed'] = false;
        }

        this.projectBaService.saveBaProject(postData).subscribe(
            (res) => {
                if (res.status === 'updated') {
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



    onBack() {
        this.router.navigate(['self/ba/projects-ba']);
    }

    doCommentSr() {
        if (this.commentFormSales.valid) {
            const postData = this.commentFormSales.value;
            this.projectCmtService.doCommentSr(postData).subscribe(
                (res) => {
                    if (res.status === 'success') {
                        this.projectData.srConvs.comments.push(res.data.comment);
                        this.sendNotifications(res.data.data);
                        this.commentFormSales.get('msg_text').setValue(null);
                    }
                }
            );
        }
    }

    doCommentJr(AC: AbstractControl, index) {
        const postData = AC.value;
        this.projectCmtService.doCommentJr(postData).subscribe(
            (res) => {
                if (res.status === 'success') {
                    this.projectData.jrConvs[index].comments.push(res.data.comment);
                    this.sendNotifications(res.data.data);
                    AC.get('msg_text').setValue(null);
                }
            }
        );
    }

    sendNotifications(data) {
        this.pusherService.sendNotifications(data).subscribe((res) => {
            if (res !== 'success') {
                this.msgService.pop('danger', 'Error', 'Error Occured While Sending Notification');
            }
        });
    }

    BAName(index) {
        return this.projectData.jr_ba[index].firstname + ' ' + this.projectData.jr_ba[index].lastname;
    }


    onSubmit(){}

    onEnter(){
        // console.log('in');
    }
}
