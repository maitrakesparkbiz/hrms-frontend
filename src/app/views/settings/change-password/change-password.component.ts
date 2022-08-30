import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { ApiService } from '../../../shared/services/api.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { ConfirmPasswordValidation } from '../../../validators/confirm-password.validator';
import { Router } from '@angular/router';
import { PermissionService } from '../../../shared/services/permission.service';

@Component({
    selector: 'app-changepassword',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

    changePasswordForm: FormGroup;
    user: any = {};
    AuthUser = JSON.parse(StorageManagerService.getUser());
    editAllowed = true;

    constructor(public apiservice: ApiService,
        public flashMessageService: FlashMessageService,
        public fb: FormBuilder, public router: Router,
        private perService: PermissionService) {

    }

    ngOnInit() {
        this.editAllowed = this.perService.hasPermission('CHANGE-PASSWORD.EDIT');
        this.user.id = this.AuthUser.id;
        this.changePasswordForm = this.fb.group(
            {
                'id': [''],
                'password': ['', [Validators.required]],
                'new_password': ['', [Validators.required]],
                'confirm_new_password': ['', [Validators.required]]
            },
            {
                validator: ConfirmPasswordValidation.MatchPassword
            });
        if (!this.editAllowed) {
            Object.keys(this.changePasswordForm.controls).forEach((index) => {
                this.changePasswordForm.controls[index].disable();
            });
        }
    }

    cancel = () => {
        this.changePasswordForm.reset();
        this.router.navigate(['/settings/change-password']);
    }

    SavePassword_update = () => {
        if (this.editAllowed) {
            this.apiservice.updateUserPassword(this.user).subscribe(response => {
                this.user = {};
                this.flashMessageService.pop('Success', ' Password Updated Succesfully', 'Password  Updated');
            }, error => {
                this.flashMessageService.pop('error', 'Previous Password is Wrong', 'Password Not Updated');
            });
        }
    }
}
