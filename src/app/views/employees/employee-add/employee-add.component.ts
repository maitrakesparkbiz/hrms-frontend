import { Component, OnInit } from '@angular/core';
import { OptionService } from '../../../shared/services/option.service';
import { AwardService } from '../../../shared/services/award.service';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { AsyncValidator, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../../shared/services/department.service';
import { DesignationService } from '../../../shared/services/designation.service';
import { LocationService } from '../../../shared/services/location.service';
import { CompanyService } from '../../../shared/services/company.service';
import { AppConstants } from '../../../constants/app.constants';
import { UserService } from '../../../shared/services/user.service';
import { ConfirmPasswordValidation } from '../../../validators/confirm-password.validator';
import { UniqueemailValidator } from '../../../validators/uniqueemail.validator';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employees-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent implements OnInit {


  EmployeeeForm: FormGroup;
  employee: any = {};
  IMAGE_URL;
  emailTaken;
  defaultdepartment;
  employee_image;
  file_response;
  departments = [];
  designations = [];
  locations = [];
  users = [];
  tempDes: any = [];


  constructor(public router: Router, private modalService: BsModalService, private route: ActivatedRoute, public fb: FormBuilder,
    public optionservice: OptionService, public awardservice: AwardService,
    public flashMessageService: FlashMessageService,
    public departmentservice: DepartmentService,
    public designationservice: DesignationService,
    public locationservice: LocationService,
    public companyservice: CompanyService,
    public userservice: UserService,
    public datepipe: DatePipe) {

    this.EmployeeeForm = fb.group({
      'firstname': ['', [Validators.required]],
      'lastname': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'gender': [''],
      'profile_image': [''],
      'employee_id': ['', [Validators.required]],
      'allowed_login': [],
      'password': [''],
      'date_of_birth': ['', [Validators.required]],
      'department': [''],
      'designation': [''],
      'location': ['', [Validators.required]],
      'report_to': [''],
      'probation_end_date': ['', [Validators.required]],
      'joining_date': ['', [Validators.required]],
      'increment_date': ['', [Validators.required]],
    },
      {
        validator: [ConfirmPasswordValidation.CheckAlloweLogin],
      }
    );
    this.EmployeeeForm.get('employee_id').setAsyncValidators(UniqueemailValidator.createValidator(this.userservice));
  }

  ngOnInit() {
    this.IMAGE_URL = AppConstants.IMAGE_URL;
    this.employee_image = '../../../assets/img/avatars/profile_image.jpg';
    this.departments = StorageManagerService.getDepartment();
    if (this.departments == null) {
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
    if (this.locations == null) {
      this.locationservice.getLocation().subscribe(res => {
        this.locations = res.data;
        StorageManagerService.storeLocation(this.locations);
      });
    }
    this.users = StorageManagerService.getManageUser();
    if (this.users == null) {
      this.userservice.getManagerUser().subscribe(res => {
        this.users = res.data;
        StorageManagerService.storeManageUser(this.users);
      });
    }
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
        this.employee['profile_image'] = this.file_response.filename;
        this.employee_image = this.IMAGE_URL + this.file_response.filename;
      },
      error => {

      }
    );
  }

  SaveEmployee = () => {
    if (this.EmployeeeForm.valid) {
      this.employee = this.EmployeeeForm.value;
      this.employee['joining_date'] = this.datepipe.transform(this.employee['joining_date'], 'dd-MM-yyyy');
      this.employee['probation_end_date'] = this.datepipe.transform(this.employee['probation_end_date'], 'dd-MM-yyyy');
      this.employee['increment_date'] = this.datepipe.transform(this.employee['increment_date'], 'dd-MM-yyyy');
      this.userservice.saveEmployee(this.employee).subscribe((res: any) => {
        if (res === 'Employee Added SuccesFully') {
          this.getSetAllUsers();
          this.flashMessageService.pop('success', 'Employee Added SuccessFully', 'Add SuccesFully');
          this.router.navigate(['/employee']);
        } else {
          this.flashMessageService.pop('danger', 'Error', 'Error occured while creating employee');
        }
      });
    }
  }

  getSetAllUsers = () => {
    this.userservice.getAllUsers().subscribe(
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
