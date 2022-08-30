import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppConstants} from "../../../../constants/app.constants";
import {FlashMessageService} from "../../../../shared/services/flash-message.service";
import {CompanyPolicyService} from "../../../../shared/services/company-policy.service";
import {FileUploadService} from "../../../../shared/services/file-upload.service";
import {EmailTemplateService} from "../../../../shared/services/email-template.service";
import {OptionService} from "../../../../shared/services/option.service";

@Component({
    templateUrl: './letter-template-create.component.html',
    styleUrls: ['./letter-template-create.component.scss']
})

export class LetterTemplateCreateComponent implements OnInit {
    edit_id: any;
    policyForm: FormGroup;
    FILE_URL = AppConstants.FILE_URL;
    policyData: any = [];
    empVariables;
    policyDoc = '';
    file: any = [];
    constructor(private _fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private msgService: FlashMessageService,
                private cpService: CompanyPolicyService,
                private optionService: OptionService,
                private emailTemplateService : EmailTemplateService,
                private fileUploadservice: FileUploadService
    ) {

    }

    ngOnInit() {
        this.policyForm = this._fb.group({
            'id': [],
            'template_name': ['', Validators.required],
            'content': ['']
        });
        this.route.params.subscribe(
            (res) => {
                if (res.id) {
                    this.edit_id = res.id;
                }
            }
        )
        if (this.edit_id) {
            this.getTemplateById();

        }
        this.getEmpVariables();
    }
    getEmpVariables = () => {
        this.optionService.getSelectOption(15).subscribe(
            (res : any) => {
                // console.log(res);
                this.empVariables = res['data'][0]['value_text'];
            }
        );
    }

    getTemplateById = () => {
        this.emailTemplateService.getTemplateById(+this.edit_id).subscribe(
            (data) => {
                if (data) {

                    this.policyData = data;
                    // console.log(data);
                    this.policyForm.get('id').setValue(this.policyData['id']);
                    this.policyForm.get('template_name').setValue(this.policyData['template_name']);
                    this.policyForm.get('content').setValue(this.policyData['content']);

                }
            }
        )
    }

    savePolicy = () => {
        if (this.policyForm.valid) {
            const postData = this.policyForm.value;
            // console.log(postData);
            this.emailTemplateService.saveTemplate(postData).subscribe(
                (res) => {
                    if (res == "created") {
                        this.msgService.pop('success', 'Template Created', 'Template Created Successfully');
                        this.onBack();
                    } else if (res == "updated") {
                        this.msgService.pop('success', 'Template Updated', 'Template Updated Successfully');
                        this.onBack();
                    } else {
                        this.msgService.pop('error', 'Error Occured', 'Error Occured');
                    }
                }
            )
        }
    }
    onBack = () => {
        this.router.navigate(['/letters/template']);
    }
}