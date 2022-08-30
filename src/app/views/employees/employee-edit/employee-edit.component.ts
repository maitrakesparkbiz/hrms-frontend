import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OptionService } from '../../../shared/services/option.service';
import { AwardService } from '../../../shared/services/award.service';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../shared/services/company.service';
import { AppConstants } from '../../../constants/app.constants';
import { LocationService } from '../../../shared/services/location.service';
import { DesignationService } from '../../../shared/services/designation.service';
import { DepartmentService } from '../../../shared/services/department.service';
import * as moment from 'moment';
import { ConfirmPasswordValidation } from '../../../validators/confirm-password.validator';
import { UserService } from '../../../shared/services/user.service';
import { RoleService } from '../../../shared/services/role.service';
import { FileUploadService } from '../../../shared/services/file-upload.service';
import { current } from 'codelyzer/util/syntaxKind';
import { toDate } from '@angular/common/src/i18n/format_date';
import { NgxSpinnerService } from 'ngx-spinner';
import { UniqueemailValidator } from '../../../validators/uniqueemail.validator';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { isThisQuarter } from 'date-fns';
import { DateParseTokenFn } from 'ngx-bootstrap/chronos/types';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employees-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})

export class EmployeeEditComponent implements OnInit {
  API_URL = 'http://snaphrms.com/api/';
  EmployeeeEditForm: FormGroup;
  qualification: any = {};
  company: any = {};
  pbankaccount: any = {};
  accounttype: any = {};
  report_user: any = {};
  roles: any = {};
  employee_account: any = {};
  employee_qualification: any = {};
  employee_work: any = {};
  IMAGE_URL;
  DOWNLOAD_URL;
  DOWNLOAD_IMAGE_URL;
  id;
  departments: any = [];
  designations: any = [];
  locations: any = {};
  employee_image;
  profile_image;
  employee: any = {};
  file_response;
  FILE_URL;
  quali_images: any = [];
  work_exp_images: any = [];
  tempDes: any = [];

  constructor(public router: Router, private modalService: BsModalService, private route: ActivatedRoute,
    private fb: FormBuilder, public fileuploadservice: FileUploadService,
    public optionservice: OptionService, public awardservice: AwardService,
    public flashMessageService: FlashMessageService,
    public departmentservice: DepartmentService, public designationservice: DesignationService,
    public locationservice: LocationService,
    public companyservice: CompanyService,
    private spinner: NgxSpinnerService,
    public roleservice: RoleService,
    public usersevice: UserService,
    public datepipe: DatePipe) {
    // this.route.params.subscribe(params => {
    //     this.id = +params['id']; // (+) converts string 'id' to a number
    // });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
    this.EmployeeeEditForm = this.fb.group({
      'firstname': new FormControl(),
      'lastname': new FormControl(),
      'email': new FormControl(),
      'company_email': new FormControl(),
      'gender': new FormControl(),
      'employee_id': new FormControl([UniqueemailValidator.checkUpdateEmployeeId(this.usersevice, this.id)]),
      'allowed_login': new FormControl(),
      // 'on_training': new FormControl(),
      'password': new FormControl(),
      'date_of_birth': new FormControl(),
      'department': new FormControl(),
      'designation': new FormControl(),
      'location': new FormControl(),
      'report_to': new FormControl(),
      'is_manager': new FormControl(),
      'marrital_status': new FormControl(),
      'marriage_anniversary_date': new FormControl(),
      'role': [''],
      'probation_end_date': new FormControl(),
      'joining_date': new FormControl(),
      'increment_date': new FormControl(),
      'user_exit_status': new FormControl(),
      'exit_date': new FormControl(),
      'address': new FormControl(),
      'per_address': new FormControl(),
      'contact_no': new FormControl(),
      'profile_image': new FormControl(),
      'emergency_contact_no': new FormControl(),
      'emergency_contact_person': new FormControl(),
      'driving_license_number': new FormControl(),
      'pan_number': new FormControl(),
      'aadhar_number': new FormControl(),
      'voter_id_number': new FormControl(),
      'uan_number': new FormControl(),
      'pf_number': new FormControl(),
      'esic_number': new FormControl(),
      'driving_license_image': new FormControl(),
      'pan_id_image': new FormControl(),
      'aadhar_id_image': new FormControl(),
      'voter_id_image': new FormControl(),
      'lc': new FormControl(),
      'marksheet': new FormControl(),
      'offer_later_file': new FormControl(),
      'joining_letter_file': new FormControl(),
      'contract_file': new FormControl(),
      'resume_file': new FormControl(),
      'appointment_letter': new FormControl(),
      'increment_letter': new FormControl(),
      'promotion_letter': new FormControl(),
      'relieving_letter': new FormControl(),
      'exp_letter': new FormControl(),
      'appreciation_letter': new FormControl(),
      'document_returns_letter': new FormControl(),
      'no_due_certificate': new FormControl(),
      'acknowledgement_letter': new FormControl(),
      'warning_letter': new FormControl(),
      'linkdin_username': new FormControl(),
      'twitter_username': new FormControl(),
      'facebook_username': new FormControl(),
      'slack_username': new FormControl(),
      'visa_image': new FormControl(),
      'visa_expiry_date': new FormControl(),
      'visa_issue_date': new FormControl(),
      'visa_number': new FormControl(),
      'passport_image': new FormControl(),
      'passport_issue_date': new FormControl(),
      'passport_expiry_date': new FormControl(),
      'passport_number': new FormControl(),
      'primary_account': new FormControl(),
      'user_account': new FormArray([]),
      'user_qualification': new FormArray([]),
      'user_work_experience': new FormArray([]),
      'certifications_courses': new FormControl(),
      'other_work_experirnce': new FormControl(),
    }, {
        // validator: [ConfirmPasswordValidation.checkRoleStatus, ConfirmPasswordValidation.CheckAlloweLogin],
        validator: [ConfirmPasswordValidation.checkRoleStatus],
      });
    // this.EmployeeeEditForm.get('employee_id').setAsyncValidators(UniqueemailValidator.
    // checkUpdateEmployeeId(this.usersevice, this.id));

    this.getAllRequiredData();
    if (this.id) {
      this.FILE_URL = AppConstants.FILE_URL;
      this.IMAGE_URL = AppConstants.IMAGE_URL;
      this.DOWNLOAD_URL = AppConstants.DOWNLOAD_FILE_URL;
      this.DOWNLOAD_IMAGE_URL = AppConstants.DOWNLOAD_IMAGE_URL;
      this.profile_image = '../../../assets/img/avatars/profile_image.jpg';
      this.employee_image = '../../../assets/img/avatars/profile_image.jpg';

      for (let i = 0; i < 2; i++) {
        (<FormArray>this.EmployeeeEditForm.get('user_account')).push(
          new FormGroup({
            'id': new FormControl(),
            'account_type': new FormControl(),
            'account_holder_name': new FormControl(),
            'account_name': new FormControl(),
            'account_number': new FormControl(),
            'bank_code': new FormControl(),
            'bank_branch': new FormControl(),
            'bank_name': new FormControl(),
            'crn_number': new FormControl()
          })
        );
      }

      for (let i = 0; i < 3; i++) {
        this.work_exp_images.push({ relieving_letter: '', exp_letter: '', salary_slip: '' });
        (<FormArray>this.EmployeeeEditForm.get('user_work_experience')).push(
          new FormGroup({
            'id': new FormControl(),
            'company_name': new FormControl(),
            'designation': new FormControl(),
            'from_date': new FormControl(),
            'to_date': new FormControl(),
            'details': new FormControl(),
            'relieving_letter': new FormControl(),
            'exp_letter': new FormControl(),
            'salary_slip': new FormControl()
          })
        );
      }

      // this.optionservice.getSelectOption('12').subscribe(res => {
      //     this.qualification = res.data;
      // });

      for (let i = 0; i < 5; i++) {
        this.quali_images.push({ image: '', index: i });
        (<FormArray>this.EmployeeeEditForm.get('user_qualification')).push(
          new FormGroup({
            'id': new FormControl(),
            'education_type': new FormControl(),
            'university_name': new FormControl(),
            'start_date': new FormControl(),
            'end_date': new FormControl(),
            'degree': new FormControl(),
            'doc_copy': new FormControl(),
            'details': new FormControl(),
          })
        );
      }

      this.spinner.show();
      this.usersevice.getEmployeeById(this.id).subscribe(response => {
        this.employee = response;
        this.employee['password'] = '';

        // if (this.employee.on_training !== null) {
        //     if (this.employee.on_training) {
        //         this.employee.on_training = 1;
        //     } else {
        //         this.employee.on_training = 0;
        //     }
        // }

        if (this.employee.roles) {
          this.employee.role = this.employee.roles[0].id;
        }
        if (this.employee.gender) {
          this.employee.gender = this.employee.gender.id;
        }
        if (this.employee.department) {
          this.employee.department = this.employee.department.id;
          this.onDepSelect(this.employee.department);
        }
        if (this.employee.designation) {
          this.employee.designation = this.employee.designation.id;
        }
        if (this.employee.location) {
          this.employee.location = this.employee.location.id;
        }
        if (this.employee.report_to) {
          this.employee.report_to = this.employee.report_to.id;
        }
        if (this.employee.primary_account) {
          this.employee.primary_account = this.employee.primary_account.id;
        }
        if (this.employee.probation_end_date) {
          this.employee.probation_end_date = new Date(moment(this.employee.probation_end_date.date).format());
        }
        if (this.employee.joining_date) {
          this.employee.joining_date = new Date(moment(this.employee.joining_date.date).format());
        }
        if (this.employee.increment_date) {
          this.employee.increment_date = new Date(moment(this.employee.increment_date.date).format());
        }
        if (this.employee.exit_date) {
          this.employee.exit_date = new Date(moment(this.employee.exit_date.date).format());
        }
        if (this.employee.date_of_birth) {
          this.employee.date_of_birth = new Date(moment(this.employee.date_of_birth.date).format());
        }
        if (this.employee.marriage_anniversary_date) {
          this.employee.marriage_anniversary_date = new Date(moment(this.employee.marriage_anniversary_date.date).format());
        }
        if (this.employee.passport_issue_date) {
          this.employee.passport_issue_date = new Date(moment(this.employee.passport_issue_date.date).format());
        }
        if (this.employee.passport_expiry_date) {
          this.employee.passport_expiry_date = new Date(moment(this.employee.passport_expiry_date.date).format());
        }
        if (this.employee.visa_issue_date) {
          this.employee.visa_issue_date = new Date(moment(this.employee.visa_issue_date.date).format());
        }
        if (this.employee.visa_expiry_date) {
          this.employee.visa_expiry_date = new Date(moment(this.employee.visa_expiry_date.date).format());
        }
        if (this.employee.increment_date) {
          this.employee.increment_date = new Date(moment(this.employee.increment_date.date).format());
        }
        if (this.employee.user_account.length > 0) {
          this.employee_account = this.employee.user_account;
          for (let i = 0; i < this.employee_account.length; i++) {
            const controlArray = <FormArray>this.EmployeeeEditForm.get('user_account');
            controlArray.controls[i].get('id').setValue(this.employee_account[i].id);
            if (this.employee_account[i].account_type) {
              controlArray.controls[i].get('account_type').setValue(this.employee_account[i].account_type.id);
            }
            controlArray.controls[i].get('account_holder_name').setValue(this.employee_account[i].account_holder_name);
            controlArray.controls[i].get('account_name').setValue(this.employee_account[i].account_name);
            controlArray.controls[i].get('bank_code').setValue(this.employee_account[i].bank_code);
            controlArray.controls[i].get('bank_name').setValue(this.employee_account[i].bank_name);
            controlArray.controls[i].get('bank_branch').setValue(this.employee_account[i].bank_branch);
            controlArray.controls[i].get('crn_number').setValue(this.employee_account[i].crn_number);
            controlArray.controls[i].get('account_number').setValue(this.employee_account[i].account_number);
          }
        } else {
          this.employee_account = [{ account_type: '' }];
        }
        if (this.employee.user_qualification.length > 0) {
          this.employee_qualification = this.employee.user_qualification;
          for (let i = 0; i < this.qualification.length; i++) {
            for (let j = 0; j < this.employee_qualification.length; j++) {
              if (this.qualification[i].id === this.employee_qualification[j].education_type.id) {
                if (this.employee_qualification[j].start_date) {
                  this.employee_qualification[j].start_date =
                    new Date(moment(this.employee_qualification[j].start_date.date).format());
                }
                if (this.employee_qualification[j].end_date) {
                  this.employee_qualification[j].end_date =
                    new Date(moment(this.employee_qualification[j].end_date.date).format());
                }
                this.quali_images[i]['image'] = this.employee_qualification[j].doc_copy;
                const controlArray = <FormArray>this.EmployeeeEditForm.get('user_qualification');
                controlArray.controls[i].get('id').setValue(this.employee_qualification[j].id);
                controlArray.controls[i].get('education_type').
                  setValue(this.employee_qualification[j].education_type.id);
                controlArray.controls[i].get('university_name').
                  setValue(this.employee_qualification[j].university_name);
                controlArray.controls[i].get('start_date').setValue(this.employee_qualification[j].start_date);
                controlArray.controls[i].get('end_date').setValue(this.employee_qualification[j].end_date);
                controlArray.controls[i].get('details').setValue(this.employee_qualification[j].details);
                controlArray.controls[i].get('degree').setValue(this.employee_qualification[j].degree);
              }
            }
          }
        }
        if (this.employee.user_work.length > 0) {
          this.employee_work = this.employee.user_work;
          for (let i = 0; i < this.employee_work.length; i++) {
            this.work_exp_images[i]['relieving_letter'] = this.employee_work[i].relieving_letter;
            this.work_exp_images[i]['exp_letter'] = this.employee_work[i].exp_letter;
            this.work_exp_images[i]['salary_slip'] = this.employee_work[i].salary_slip;
            if (this.employee_work[i].from_date) {
              this.employee_work[i].from_date = new Date(moment(this.employee_work[i].from_date.date).format());
            }
            if (this.employee_work[i].to_date) {
              this.employee_work[i].to_date = new Date(moment(this.employee_work[i].to_date.date).format());
            }
            const controlArray = <FormArray>this.EmployeeeEditForm.get('user_work_experience');
            controlArray.controls[i].get('id').setValue(this.employee_work[i].id);
            controlArray.controls[i].get('company_name').setValue(this.employee_work[i].company_name);
            controlArray.controls[i].get('designation').setValue(this.employee_work[i].designation);
            controlArray.controls[i].get('from_date').setValue(this.employee_work[i].from_date);
            controlArray.controls[i].get('to_date').setValue(this.employee_work[i].to_date);
            controlArray.controls[i].get('details').setValue(this.employee_work[i].details);
          }
        }
        this.spinner.hide();
      });

    }
  }

  getAllRequiredData = () => {
    this.spinner.show();
    this.departments = StorageManagerService.getDepartment();
    if (this.departments === null) {
      this.departmentservice.getDepartments().subscribe(res => {
        this.departments = res.data;
        StorageManagerService.storeDepartment(this.departments);
      });
    }
    this.tempDes = StorageManagerService.getDesignation();
    if (this.tempDes == null) {
      this.designationservice.getDesignation().subscribe(res => {
        this.tempDes = res.data;
        StorageManagerService.storeDesignation(this.tempDes);
      });
    }
    this.locations = StorageManagerService.getLocation();
    if (this.locations === null) {
      this.locationservice.getLocation().subscribe(res => {
        this.locations = res.data;
        StorageManagerService.storeLocation(this.locations);
      });
    }
    this.report_user = StorageManagerService.getManageUser();
    if (this.report_user === null) {
      this.usersevice.getManagerUser().subscribe(res => {
        this.report_user = res.data;
        StorageManagerService.storeManageUser(this.report_user);
      });
    }

    this.roles = StorageManagerService.getRoles();
    if (this.roles === null) {
      this.roleservice.getRolewithoutEmployee().subscribe((res: any) => {
        this.roles = res.data;
        StorageManagerService.storeRoles(this.roles);
      });
    }

    this.pbankaccount = StorageManagerService.getBankAccount();
    if (this.pbankaccount === null) {
      this.optionservice.getSelectOption(10).subscribe((res: any) => {
        this.pbankaccount = res.data;
        StorageManagerService.storeBankAccount(this.pbankaccount);
      });
    }

    this.accounttype = StorageManagerService.getAccountTypes();
    if (this.accounttype === null) {
      this.optionservice.getSelectOption(11).subscribe((res: any) => {
        this.accounttype = res.data;
        StorageManagerService.storeAccountTypes(this.accounttype);
      });
    }

    this.qualification = StorageManagerService.getQualifications();
    if (this.qualification === null) {
      this.optionservice.getSelectOption(12).subscribe((res: any) => {
        this.qualification = res.data;
        StorageManagerService.storeQualifications(this.qualification);
      });
    }
    this.spinner.hide();
  }

  onDepSelect = (value) => {
    this.designations = [];
    Object.keys(this.tempDes).forEach((index) => {
      if (+this.tempDes[index]['dep_id'] === +value) {
        this.designations.push(this.tempDes[index]);
      }
    });
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
        this.employee[file_name] = this.file_response.filename;
        this.employee_image = this.IMAGE_URL + this.file_response.filename;
      },
      error => {
      }
    );
  }

  RemoveImages = (file_name) => {
    this.employee[file_name] = '';
  }

  uploadFile = (event: any) => {
    const file_name = event.target.id;
    const files = event.target.files;
    const fData: FormData = new FormData;
    for (let i = 0; i < files.length; i++) {
      fData.append('file', files[i]);
    }
    this.fileuploadservice.uploadFile(fData).subscribe(
      response => {
        this.file_response = response;
        this.employee[file_name] = this.file_response.filename;
      },
      error => {
      }
    );
  }

  RemoveFile = (file_name) => {
    this.employee[file_name] = '';
  }

  uploadDoc = (event: any, index: any) => {
    const file_name = event.target.id;
    const files = event.target.files;
    const fData: FormData = new FormData;
    for (let i = 0; i < files.length; i++) {
      fData.append('file', files[i]);
    }
    this.fileuploadservice.uploadFile(fData).subscribe(
      response => {
        this.file_response = response;
        this.quali_images[index]['image'] = this.file_response.filename;
        // this.employee_qualification[index][file_name] = '';
      },
      error => {
      }
    );
  }

  RemoveDoc = (index) => {
    this.quali_images[index]['image'] = '';
  }

  uploadEmpDoc = (controlName: any, event: any, index: any) => {
    const file_name = event.target.id;
    const files = event.target.files;
    const fData: FormData = new FormData;
    for (let i = 0; i < files.length; i++) {
      fData.append('file', files[i]);
    }
    this.fileuploadservice.uploadFile(fData).subscribe(
      response => {
        this.file_response = response;
        this.work_exp_images[index][controlName] = this.file_response.filename;
        // this.employee_qualification[index][file_name] = '';
      },
      error => {
      }
    );
  }

  RemoveEmpDoc = (controlName: any, index) => {
    this.work_exp_images[index][controlName] = '';
    // this.employee_qualification[index][file_name] = '';
  }

  updateEmployee = () => {
    for (let i = 0; i <= 4; i++) {
      if (this.EmployeeeEditForm.value.user_qualification[i]['details'] !== null ||
        this.EmployeeeEditForm.value.user_qualification[i]['end_date'] !== null ||
        this.EmployeeeEditForm.value.user_qualification[i]['start_date'] !== null ||
        this.EmployeeeEditForm.value.user_qualification[i]['university_name'] !== null ||
        this.EmployeeeEditForm.value.user_qualification[i]['degree'] !== null ||
        this.EmployeeeEditForm.value.user_qualification[i]['doc_copy'] !== null) {
        this.EmployeeeEditForm.value.user_qualification[i]['education_type'] = this.qualification[i]['id'];
        this.EmployeeeEditForm.value.user_qualification[i]['doc_copy'] = this.quali_images[i]['image'];
      }
    }

    for (let j = 0; j <= 2; j++) {
      if (this.EmployeeeEditForm.value.user_work_experience[j]['company_name'] !== null ||
        this.EmployeeeEditForm.value.user_work_experience[j]['designation'] !== null ||
        this.EmployeeeEditForm.value.user_work_experience[j]['from_date'] !== null ||
        this.EmployeeeEditForm.value.user_work_experience[j]['to_date'] !== null) {
        this.EmployeeeEditForm.value.user_work_experience[j]['relieving_letter'] = this.work_exp_images[j]['relieving_letter'];
        this.EmployeeeEditForm.value.user_work_experience[j]['exp_letter'] = this.work_exp_images[j]['exp_letter'];
        this.EmployeeeEditForm.value.user_work_experience[j]['salary_slip'] = this.work_exp_images[j]['salary_slip'];
      }
    }
    if (this.EmployeeeEditForm.valid) {
      this.employee.user_account = this.EmployeeeEditForm.value['user_account'];
      this.employee.user_qualification = this.EmployeeeEditForm.value['user_qualification'];
      this.employee.user_work = this.EmployeeeEditForm.value['user_work_experience'];
      if (this.employee['joining_date']) {
        this.employee['joining_date'] = moment(this.employee['joining_date']).format();
      }
      if (this.employee['probation_end_date']) {
        this.employee['probation_end_date'] = moment(this.employee['probation_end_date']).format();
      }
      this.usersevice.updateEmployee(this.employee).subscribe((res: any) => {
        if (res === 'User Updated Successfully') {
          const userData = JSON.parse(StorageManagerService.getUser());
          if (+userData.id === +this.employee.id) {
            userData['profile'] = this.employee.profile_image;
            userData['email'] = this.employee.email;
            userData['firstname'] = this.employee.firstname;
            StorageManagerService.storeUser(userData);
            this.usersevice.profile_subject.next(userData);
          }
          this.usersevice.getManagerUser().subscribe(response => {
            this.report_user = response.data;
            StorageManagerService.storeManageUser(this.report_user);
          });
          this.getSetAllUsers();
          this.router.navigate(['/employee']);
          this.flashMessageService.pop('success', 'Employee Updated Succesfully', 'Updated Succesfully');
        }
      });
    }
  }


  getSetAllUsers = () => {
    this.usersevice.getAllUsers().subscribe(
      (res) => {
        if (res) {
          StorageManagerService.storeAllUsers(res.data);
        }
      }
    );
  }

  cancel = () => {
    this.router.navigate(['/employee']);
  }
}
