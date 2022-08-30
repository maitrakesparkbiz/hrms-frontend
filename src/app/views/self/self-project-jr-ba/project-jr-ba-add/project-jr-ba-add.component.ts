import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppConstants } from '../../../../constants/app.constants';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectJrBaService } from '../../../../shared/services/project-jr-ba.service';
import { FlashMessageService } from '../../../../shared/services/flash-message.service';
import { PusherService } from '../../../../shared/services/pusher.sevice';


@Component({
    selector: 'app-project-jr-ba-add',
    templateUrl: './project-jr-ba-add.component.html',
    styleUrls: ['./project-jr-ba-add.component.scss']
})

export class ProjectJrBaAddComponent implements OnInit {
    projectForm: FormGroup;
    FILE_URL = AppConstants.FILE_URL;
    project_id = '';
    projectData: any = [];
    old_est_time = 0;
    constructor(private _fb: FormBuilder,
        private router: Router,
        private projectJrBaService: ProjectJrBaService,
        private activatedRoute: ActivatedRoute,
        private msgService: FlashMessageService,
        private pusherService: PusherService) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(
            (res) => {
                this.project_id = res.id;
            }
        );
        this.projectForm = this._fb.group({
            'id': [this.project_id],
            'ba_project_id': [],
            'est_time': ['', Validators.required]
        });
        this.projectJrBaService.getBaProjectById(this.project_id).subscribe(
            (res) => {
                this.projectData = res;
                if (this.projectData.project_doc) {
                    this.projectData.project_doc = this.projectData.project_doc.split(',');
                } else {
                    this.projectData.project_doc = [];
                }
                if (this.projectData.est_time > 0) {
                    this.projectForm.get('est_time').setValue(this.projectData.est_time);
                    this.old_est_time = this.projectData.est_time;
                }
                this.projectForm.get('ba_project_id').setValue(this.projectData.ba_project_id);
            }
        );
    }

    saveProject() {
        if (this.projectForm.valid) {
            const postData = this.projectForm.value;
            if (+this.old_est_time !== +postData['est_time']) {
                postData['est_time_changed'] = true;
            } else {
                postData['est_time_changed'] = false;
            }
            this.projectJrBaService.saveBaProject(postData).subscribe(
                (res) => {
                    if (res.status === 'updated') {
                        if (res.data) {
                            this.sendNotification(res.data);
                        }
                        this.msgService.pop('success', 'Project Updated', 'Project Updated Successfully');
                    } else {
                        this.msgService.pop('danger', 'Error Occured', 'Error Occured');
                    }
                    this.onBack();
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

    onBack() {
        this.router.navigate(['self/jr-ba/projects-jr-ba']);
    }
}
