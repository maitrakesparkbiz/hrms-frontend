import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EmailSettingsService } from '../../../shared/services/email-settings.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PermissionService } from '../../../shared/services/permission.service';


@Component({
    templateUrl: 'email-settings.component.html',
    styleUrls: ['./email-settings.component.scss']
})

export class EmailSettingsComponent implements OnInit {
    emailForm: FormGroup;
    emailData: any = [];
    editAllowed = true;

    constructor(private _fb: FormBuilder,
        private emailService: EmailSettingsService,
        private msgService: FlashMessageService,
        private spinner: NgxSpinnerService,
        private perService: PermissionService) {

        this.emailForm = this._fb.group({
            'id': [],
            'admin_emails': [],
            'hr_emails': [],
            'cto_emails': [],
            'hr_contact_number': [],
            'hr_name': [],
            'company_site': [],
            'company_address': []
        });
    }

    ngOnInit() {
        this.editAllowed = this.perService.hasPermission('EMAIL-SETTINGS.EDIT');
        this.spinner.show();
        this.emailService.getEmailSettings().subscribe(
            (res) => {
                if (res !== null) {
                    this.emailData = res;
                    Object.keys(this.emailForm.controls).forEach((index) => {
                        if (index === 'company_site' || index === 'company_address' || index === 'id') {
                            this.emailForm.get(index).setValue(this.emailData[index]);
                        } else {
                            this.emailForm.get(index).setValue(this.generateArray(this.emailData[index]));
                        }
                    });
                }
                this.spinner.hide();
            }
        );
        if (!this.editAllowed) {
            if (!this.editAllowed) {
                Object.keys(this.emailForm.controls).forEach((index) => {
                    this.emailForm.controls[index].disable();
                });
            }
        }
    }

    saveEmailSetting = () => {
        if (this.editAllowed) {
            this.spinner.show();
            const data = this.emailForm.value;
            data.admin_emails = this.generateCommaSeparatedString(data.admin_emails);
            data.hr_emails = this.generateCommaSeparatedString(data.hr_emails);
            data.cto_emails = this.generateCommaSeparatedString(data.cto_emails);
            data.hr_contact_number = this.generateCommaSeparatedString(data.hr_contact_number);
            data.hr_name = this.generateCommaSeparatedString(data.hr_name);
            this.emailService.saveEmailSettings(data).subscribe(
                (res) => {
                    if (res === 'success') {
                        this.spinner.hide();
                        this.msgService.pop('success', 'Updated', 'Email settings updated');
                    }
                }
            );
        }
    }

    generateCommaSeparatedString = (emails) => {
        let allEmails = '';
        if (emails.length > 0) {
            for (const email of emails) {
                allEmails += email.display + ',';
            }
            allEmails = allEmails.slice(0, -1);
        }
        return allEmails;
    }

    generateArray = (emailString) => {
        const newArr = [];
        if (emailString) {
            const tempArr = emailString.split(',');
            for (const item of tempArr) {
                newArr.push({
                    'display': item,
                    'value': item
                });
            }
        }
        return newArr;
    }
}
