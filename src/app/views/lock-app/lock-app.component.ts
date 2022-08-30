import { Component, OnInit } from '@angular/core';
import { StorageManagerService } from '../../shared/services/storage-manager.service';
import { ApiService } from '../../shared/services/api.service';
import { FlashMessageService } from '../../shared/services/flash-message.service';
import { PermissionService } from '../../shared/services/permission.service';
import { Router } from '@angular/router';
import { AppConstants } from '../../constants/app.constants';

@Component({
  selector: 'app-lock-app',
  templateUrl: './lock-app.component.html',
  styleUrls: ['./lock-app.component.scss']
})
export class LockAppComponent implements OnInit {

  userPassword = '';
  user: any = [];
  IMAGE_URL = AppConstants.IMAGE_URL;
  employee_image = '../../../assets/img/avatars/profile_image.jpg';
  constructor(private flashMessageService: FlashMessageService,
    private router: Router,
    private permissionService: PermissionService,
    private apiService: ApiService) {
  }

  ngOnInit() {
    this.user = JSON.parse(StorageManagerService.getUser());
    if (StorageManagerService.getLockStatus() === null) {
      if (this.permissionService.hasPermission('DASHBOARD.VIEW')) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/self/dashboard']);
      }
    }
  }

  getUserName = () => {
    return this.user.firstname;
  }

  attemptUnlockApp = () => {
    this.apiService.unlock(this.userPassword).subscribe(
      (responseData: any) => {
        if (responseData.response === 'success') {
          StorageManagerService.unlockApp();
          if (StorageManagerService.getLockStatus() === null) {
            if (this.permissionService.hasPermission('DASHBOARD.VIEW')) {
              this.router.navigate(['/']);
            } else {
              this.router.navigate(['/self/dashboard']);
            }
          }
        } else {
          this.flashMessageService.pop('error', 'Failed to unlock', responseData.data.message);
        }
      },
      (errorData: any) => {
        this.flashMessageService.pop('error', 'Failed to unlock', 'Invalid password');
      }
    );
  }

}
