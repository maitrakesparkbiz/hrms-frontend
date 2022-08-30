import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { StorageManagerService } from '../../shared/services/storage-manager.service';
import { FlashMessageService } from '../../shared/services/flash-message.service';
import { CaptchaComponent } from 'angular-captcha';
import { Observable, forkJoin, of } from 'rxjs';
import { DepartmentService } from '../../shared/services/department.service';
import { DesignationService } from '../../shared/services/designation.service';
import { catchError, retry } from 'rxjs/operators';
import { LocationService } from '../../shared/services/location.service';
import { UserService } from '../../shared/services/user.service';
import { RoleService } from '../../shared/services/role.service';
import { OptionService } from '../../shared/services/option.service';
import { CompanyService } from '../../shared/services/company.service';
import { PermissionService } from '../../shared/services/permission.service';
import { NavService } from '../../shared/services/nav.service';
import { PusherService } from '../../shared/services/pusher.sevice';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  public status = true;
  public captchadetail;
  public captchastatus = true;
  public btnstatus = true;
  public count = 0;
  @ViewChild(CaptchaComponent) captchaComponent: CaptchaComponent;
  constructor(private apiService: ApiService,
    private route: Router,
    private injector: Injector,
    private flashMessageService: FlashMessageService,
    private permissionService: PermissionService,
    private navService: NavService,
    private pusherService: PusherService) {
  }

  ngOnInit() {
    this.initForm();
    this.flashMessageService.showToast();
  }

  initForm = () => {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, Validators.required),
    });
  }
  resolved(captchaResponse: string) {
    // console.log(`Resolved captcha with response ${captchaResponse}:`);
    this.captchadetail = captchaResponse;
    this.btnstatus = true;
    // this.onLoginFormSubmit();

  }

  onLoginFormSubmit = () => {
    //  this.captchadetail=grecaptcha.getResponse();
    // console.log(this.captchadetail);
    const credentials = this.loginForm.value;
    this.apiService.login(credentials).subscribe(
      (responseData: any) => {
        if (responseData.response === 'success') {
          this.navService.saveMainNav();
          StorageManagerService.storeToken(responseData.data.token);
          StorageManagerService.storeUser(responseData.data.user);
          this.pusherService.subscribeChannel();
          if (responseData.data.user.permission) {
            this.permissionService.permissions = responseData.data.user.permission;
          }
          this.flashMessageService.setData('success',
            'Login Successful',
            'Welcome back' + ' ' + responseData.data.user.firstname);
          if (responseData.data.user.role) {
            if (responseData.data.user.permission.includes('DASHBOARD.VIEW')) {
              this.getAllRequireData();
              this.route.navigate(['/']);
            } else {
              if (responseData.data.user.permission.includes('SELF-DASHBOARD.VIEW')) {
                this.getSelfRequireData();
                this.route.navigate(['/self/dashboard']);
              } else {
                this.route.navigate(['/self']);
              }
            }
          }


        }
        else {
          // this.count++;
          // if (this.count === 2) {
          //   this.status = false;
          //   this.btnstatus = false;
          // }
          this.flashMessageService.pop('error', 'Login Failed', 'Invalid Login or password');
        }
      },
      errorData => {
        // console.log(errorData);
      });
  }

  getSelfRequireData = () => {
    const companyService = this.injector.get(CompanyService);
    const locationservice = this.injector.get(LocationService);
    const optionservice = this.injector.get(OptionService);

    // const locations: Observable<any[]> = locationservice.getLocation();
    const logoPath: Observable<any> = companyService.getLogoPaths();
    const allOptData: Observable<any> = optionservice.getSelectOption(12);
    const dateFormat: Observable<any> = companyService.getDateTimeFormat();

    let isAllResponse: Boolean = false;
    forkJoin([logoPath, allOptData, dateFormat])
      .pipe(catchError(error => of(error)), retry(3))
      .subscribe(results => {
        isAllResponse = true;
        // StorageManagerService.storeLocation(results[0]['data']);
        StorageManagerService.storeLogoPath(results[0]);
        StorageManagerService.storeQualifications(results[1]['data']);
        StorageManagerService.storeDateTimeFormat(results[2]);
        // results[3] === undefined ? '' : S
        // results[8] == undefined ? '' : StorageManagerService.storeLogoPath(results[8]);
      });
  }

  getAllRequireData = () => {
    const companyService = this.injector.get(CompanyService);
    const departmentservice = this.injector.get(DepartmentService);
    const designationservice = this.injector.get(DesignationService);
    const locationservice = this.injector.get(LocationService);
    const roleservice = this.injector.get(RoleService);
    const userseervice = this.injector.get(UserService);
    const optionservice = this.injector.get(OptionService);

    const departments: Observable<any[]> = departmentservice.getDepartments();
    const designations: Observable<any[]> = designationservice.getDesignation();
    const locations: Observable<any[]> = locationservice.getLocation();
    const manageruser: Observable<any[]> = userseervice.getManagerUser();
    const role_detail: Observable<any> = roleservice.getRolewithoutEmployee();
    // const role_detail: Observable<any> = roleservice.getRole();
    const allOptData: Observable<any> = optionservice.getMultipleSelectOptions([10, 11, 12]);
    const logoPath: Observable<any> = companyService.getLogoPaths();
    const dateFormat: Observable<any> = companyService.getDateTimeFormat();

    // const bank_account: Observable<any> = optionservice.getSelectOption(10);
    // const account_type: Observable<any> = optionservice.getSelectOption(11);
    // const qualifications: Observable<any> = optionservice.getSelectOption(12);

    let isAllResponse: Boolean = false;
    forkJoin([departments, designations, locations, manageruser, role_detail, allOptData, logoPath, dateFormat])
      .pipe(catchError(error => of(error)), retry(3))
      .subscribe(results => {
        isAllResponse = true;
        StorageManagerService.storeDepartment(results[0]['data']);
        StorageManagerService.storeDesignation(results[1]['data']);
        StorageManagerService.storeLocation(results[2]['data']);
        StorageManagerService.storeManageUser(results[3]['data']);
        StorageManagerService.storeRoles(results[4]['data']);
        if (results[5]['data'][10]) {
          StorageManagerService.storeBankAccount(results[5]['data'][10]);
        }
        if (results[5]['data'][11]) {
          StorageManagerService.storeAccountTypes(results[5]['data'][11]);
        }
        if (results[5]['data'][12]) {
          StorageManagerService.storeQualifications(results[5]['data'][12]);
        }
        StorageManagerService.storeLogoPath(results[6]);
        StorageManagerService.storeDateTimeFormat(results[7]);
        // results[8] == undefined ? '' : StorageManagerService.storeLogoPath(results[8]);
      });
  }

}
