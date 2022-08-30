import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { EmailTemplateService } from '../../../shared/services/email-template.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { PermissionService } from '../../../shared/services/permission.service';

@Component({
    templateUrl: 'email-template.component.html',
    styleUrls: ['./email-template.component.scss']
})

export class EmailTemplateComponent implements OnInit {
    emailTemplateForm: FormGroup;
    editEmailTemplate: FormGroup;
    public addsub = new FormArray([]);
    editTemplate = new FormArray([]);
    deleteIds: any = [];
    editAllowed = true;
    constructor(private emailTemplateService: EmailTemplateService,
        private spinner: NgxSpinnerService,
        private msgService: FlashMessageService,
        private perService: PermissionService) {
    }

    ngOnInit() {
        this.editAllowed = this.perService.hasPermission('EMAIL-TEMPLATES.EDIT');
        this.emailTemplateForm = new FormGroup({
            'id': new FormControl(''),
            'template_name': new FormControl(''),
            'content': new FormControl(''),
            'addsub': this.addsub
        });

        this.editEmailTemplate = new FormGroup({
            'editTemplate': this.editTemplate
        });

        this.emailTemplateService.getEmailTemplate().subscribe(
            (res) => {
                if (res !== null) {
                    Object.keys(res).forEach(index => {
                        if (+index === 0) {
                            this.emailTemplateForm.get('id').setValue(res[index]['id']);
                            this.emailTemplateForm.get('template_name').setValue(res[index]['template_name']);
                            this.emailTemplateForm.get('content').setValue(res[index]['content']);
                        } else {
                            (<FormArray>this.emailTemplateForm.get('addsub')).push(
                                new FormGroup({
                                    'id': new FormControl(res[index]['id']),
                                    'template_name': new FormControl(res[index]['template_name']),
                                    'content': new FormControl(res[index]['content'])
                                })
                            );
                        }
                    });
                    if (!this.editAllowed) {
                        (<FormArray>this.emailTemplateForm.get('addsub'))
                            .controls
                            .forEach(control => {
                                control.disable();
                            });
                    }
                }
            }
        );


        if (!this.editAllowed) {
            Object.keys(this.emailTemplateForm.controls).forEach((index) => {
                this.emailTemplateForm.controls[index].disable();
            });
        }
    }

    // get formData() { return this.emailTemplateForm.get('addsub'); }


    saveEmailTemplate = () => {
        if (this.editAllowed) {
            const postData = {};
            const templates = this.emailTemplateForm.get('addsub').value;
            templates.push({
                'id': this.emailTemplateForm.get('id').value !== '' ? this.emailTemplateForm.get('id').value : '',
                'template_name': this.emailTemplateForm.get('template_name').value,
                'content': this.emailTemplateForm.get('content').value
            });
            postData['template'] = templates;
            postData['deleteIds'] = this.deleteIds;
            this.emailTemplateService.saveEmailTemplate(postData).subscribe((res) => {
                if (res === 'success') {
                    this.msgService.pop('success', 'Updated', 'Email templates updated');
                }
            });
        }
    }

    addTemplate = () => {
        (<FormArray>this.emailTemplateForm.get('addsub')).push(
            new FormGroup({
                'id': new FormControl(''),
                'template_name': new FormControl(''),
                'content': new FormControl(''),
            })
        );
    }

    deleteSubRow = (index: number) => {
        const control = <FormArray>this.emailTemplateForm.controls['addsub'];
        if (control.value[index].id) {
            this.deleteIds.push(control.value[index].id);
        }
        control.removeAt(index);
    }
}
