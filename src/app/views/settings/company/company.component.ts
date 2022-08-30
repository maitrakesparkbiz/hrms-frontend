import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../shared/services/company.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { OptionService } from '../../../shared/services/option.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppConstants } from '../../../constants/app.constants';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { PermissionService } from '../../../shared/services/permission.service';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

    IMAGE_URL;
    CompanyForm: FormGroup;
    company: any = {};
    countrys = [];
    file_response;
    img_name = '';
    editAllowed = true;
    // defaultConfig: DropzoneConfigInterface = {
    //     url: this.API_URL + 'uploadlogo',
    //     maxFilesize: 1,
    //     maxFiles: 1,
    //     acceptedFiles: '.jpg, .jpeg, .png, .svg',
    //     addRemoveLinks: true,
    // };

    logoConfig: DropzoneConfigInterface;

    constructor(public companyservice: CompanyService, public optionservice: OptionService,
        private flashMessageService: FlashMessageService,
        private spinner: NgxSpinnerService,
        private perService: PermissionService) {
    }

    ngOnInit() {
        this.editAllowed = this.perService.hasPermission('GENERAL-ADMIN.EDIT');
        this.IMAGE_URL = AppConstants.IMAGE_URL;
        this.CompanyForm = new FormGroup({
            'name': new FormControl(),
            'logo': new FormControl(),
            'country': new FormControl(),
            'website': new FormControl(),
            'contact_email': new FormControl(null, [Validators.required, Validators.email]),
            'contact_person': new FormControl(),
            'contact_number': new FormControl(),
            'contact_address': new FormControl(),
        });
        this.spinner.show();
        if (!this.editAllowed) {
            Object.keys(this.CompanyForm.controls).forEach(index => {
                this.CompanyForm.controls[index].disable();
            });
        }
        this.optionservice.getSelectOption('1').subscribe((response: any) => {
            this.countrys = response.data;

        });

        this.companyservice.getCompanyById('1').subscribe(response => {
            this.company = response[0];
            delete this.company.leave_start_month;
            if (this.company.country) {
                this.company.country = this.company.country.id;
            }
            if (this.company.timezone) {
                this.company.timezone = this.company.timezone.id;
            }
            if (this.company.currency) {
                this.company.currency = this.company.currency.id;
            }
            if (this.company.financial_year_start_month) {
                this.company.financial_year_start_month = this.company.financial_year_start_month.id;
            }
            if (this.company.datetimeformat) {
                this.company.datetimeformat = this.company.datetimeformat.id;
            }
            this.spinner.hide();
        }, error => {

            // console.log(error);
        });
    }

    SaveCompany = () => {
        //  this.company['logo'] = this.img_name;
        if (this.editAllowed) {
            this.companyservice.saveCompany(this.company).subscribe((responseData: any) => {
                if (responseData.response === 'success') {
                    this.companyservice.company_subject.next({ logo_path: this.company['logo'] });
                    if (this.file_response) {
                        StorageManagerService.storeLogoPath(this.file_response.filename);
                    }
                    this.flashMessageService.pop('success', 'Company', 'Update SuccesFully');
                }
            });
        }
    }

    uploadImage = (event: any) => {
        const file_name = event.target.id;
        const files = event.target.files;
        const fData: FormData = new FormData;
        for (let i = 0; i < files.length; i++) {
            fData.append('file', files[i]);
        }
        this.companyservice.uploadImage(fData).subscribe(
            response => {
                this.file_response = response;
                this.company['logo'] = this.file_response.filename;
            },
            error => {
                // console.log(error);
            }
        );
    }
    RemoveImages = (file_name) => {
        this.company[file_name] = '';
    }
    onUploadError = (error: any) => {
        // console.log(error);
    }

    onUploadSuccess = (success: any) => {
        // console.log(success);
        this.img_name = success[1]['filename'];
    }
}
