import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FlashMessageService } from "../../../../shared/services/flash-message.service";
import { CompanyPolicyService } from "../../../../shared/services/company-policy.service";
import { AppConstants } from "../../../../constants/app.constants";
import { FileUploadService } from "../../../../shared/services/file-upload.service";

@Component({
    templateUrl: './company-policy-add.component.html',
    styleUrls: ['./company-policy-add.component.scss']
})

export class CompanyPolicyAddComponent implements OnInit {
    edit_id: any;
    policyForm: FormGroup;
    FILE_URL = AppConstants.FILE_URL;
    policyData: any = [];
    policyDoc = '';
    file: any = [];
    constructor(private _fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private msgService: FlashMessageService,
        private cpService: CompanyPolicyService,
        private fileUploadservice: FileUploadService
    ) {

    }

    ngOnInit() {
        this.policyForm = this._fb.group({
            'id': [],
            'title': ['', Validators.required],
            'short_description': ['', Validators.required],
            'long_description': ['', Validators.required],
            'is_published': [false],
            'policy_doc': ['']
        });
        this.route.params.subscribe(
            (res) => {
                if (res.id) {
                    this.edit_id = res.id;
                }
            }
        )
        if (this.edit_id) {
            this.getPolicyById();
        }
    }

    getPolicyById = () => {
        this.cpService.getPolicyById(this.edit_id).subscribe(
            (data) => {
                if (data) {
                    this.policyData = data;
                    this.policyForm.get('id').setValue(this.policyData['id']);
                    this.policyForm.get('title').setValue(this.policyData['title']);
                    this.policyForm.get('is_published').setValue(this.policyData['is_published']);
                    this.policyForm.get('short_description').setValue(this.policyData['short_description']);
                    this.policyForm.get('long_description').setValue(this.policyData['long_description']);
                    if (this.policyData['policy_doc']) {
                        this.policyDoc = this.policyData['policy_doc'];
                    }
                }
            }
        )
    }

    savePolicy = async () => {
        if (this.policyForm.valid) {
            const postData = this.policyForm.value;
            if (this.file.length > 0 && this.policyDoc) {
                const fData: FormData = new FormData;
                fData.append('file', this.file[0]);
                await this.fileUploadservice.uploadFile(fData).toPromise();
            }
            postData['policy_doc'] = this.policyDoc;
            this.cpService.savePolicy(postData).subscribe(
                (res) => {
                    if (res == "created") {
                        this.msgService.pop('success', 'Company Policy Created', 'Company Policy Created Successfully');
                        this.onBack();
                    } else if (res == "updated") {
                        this.msgService.pop('success', 'Company Policy Updated', 'Company Policy Updated Successfully');
                        this.onBack();
                    } else {
                        this.msgService.pop('error', 'Error Occured', 'Error Occured');
                    }
                }
            )
        }
    }

    onBack = () => {
        this.router.navigate(['/settings/company-policy']);
    }

    removeFile = () => {
        this.policyDoc = '';
        this.policyForm.get('policy_doc').setErrors(null);
    }

    uploadFile = (event) => {
        this.file = event.target.files;
        if (this.file.length > 0) {
            const policy = this.file[0].name;
            if (policy) {
                const ext = policy.substr((policy.lastIndexOf('.') + 1), policy.length);
                // console.log(ext);
                if (ext !== 'pdf') {
                    this.policyForm.get('policy_doc').setErrors({ invalid_file: true });
                } else {
                    this.policyForm.get('policy_doc').setErrors(null);
                }
            }
            this.policyDoc = this.file[0].name;
        }
    }
}