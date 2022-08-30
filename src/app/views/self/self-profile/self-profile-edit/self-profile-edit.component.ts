import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { AwardService } from '../../../../shared/services/award.service';
import { FileUploadService } from '../../../../shared/services/file-upload.service';
import { OptionService } from '../../../../shared/services/option.service';
import { FlashMessageService } from '../../../../shared/services/flash-message.service';
import { DepartmentService } from '../../../../shared/services/department.service';
import { DesignationService } from '../../../../shared/services/designation.service';
import { LocationService } from '../../../../shared/services/location.service';
import { CompanyService } from '../../../../shared/services/company.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RoleService } from '../../../../shared/services/role.service';
import { UserService } from '../../../../shared/services/user.service';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';
import { AppConstants } from '../../../../constants/app.constants';
import * as moment from 'moment';

@Component({
    selector: 'app-self-profile-edit',
    templateUrl: 'self-profile-edit.component.html',
    styleUrls: ['./self-profile-edit.component.scss']
})

export class SelfProfileEditComponent implements OnInit {
    API_URL = 'http://snaphrms.com/api/';
    EmployeeeEditForm: FormGroup;
    qualification: any = {};
    employee_qualification: any = {};
    employee_work: any = {};
    IMAGE_URL;
    DOWNLOAD_URL;
    DOWNLOAD_IMAGE_URL;
    id;
    employee_image;
    profile_image;
    employee: any = {};
    file_response;
    quali_images: any = [];
    work_exp_images: any = [];
    constructor(public router: Router, private modalService: BsModalService, private route: ActivatedRoute,
        private fb: FormBuilder, public fileuploadservice: FileUploadService,
        public optionservice: OptionService, public awardservice: AwardService,
        public flashMessageService: FlashMessageService,
        public departmentservice: DepartmentService, public designationservice: DesignationService,
        public locationservice: LocationService,
        public companyservice: CompanyService,
        private spinner: NgxSpinnerService,
        public roleservice: RoleService,
        public usersevice: UserService) {
    }

    async ngOnInit() {
        const emp_data = JSON.parse(StorageManagerService.getUser());
        this.id = emp_data['id'];
        this.EmployeeeEditForm = this.fb.group({
            'firstname': new FormControl(),
            'lastname': new FormControl(),
            'email': new FormControl(),
            'gender': new FormControl(),
            'employee': new FormControl(),
            'date_of_birth': new FormControl(),
            'marrital_status': new FormControl(),
            'marriage_anniversary_date': new FormControl(),
            'address': new FormControl(),
            'per_address': new FormControl(),
            'contact_no': new FormControl(),
            'profile_image': new FormControl(),
            'emergency_contact_no': new FormControl(),
            'emergency_contact_person': new FormControl(),
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
            'user_qualification': new FormArray([]),
            'user_work_experience': new FormArray([]),
            'certifications_courses': new FormControl(),
            'other_work_experirnce': new FormControl(),
        });

        await this.getAllRequiredData();
        if (this.id) {
            this.IMAGE_URL = AppConstants.IMAGE_URL;
            this.DOWNLOAD_URL = AppConstants.DOWNLOAD_FILE_URL;
            this.DOWNLOAD_IMAGE_URL = AppConstants.DOWNLOAD_IMAGE_URL;
            this.profile_image = '../../../../assets/img/avatars/profile_image.jpg';
            this.employee_image = '../../../../assets/img/avatars/profile_image.jpg';

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

            // for (let i = 0; i < 3; i++) {
            //     (<FormArray>this.EmployeeeEditForm.get('user_qualification')).push(
            //         new FormGroup({
            //             'id': new FormControl(),
            //             'education_type': new FormControl(),
            //             'university_name': new FormControl(),
            //             'start_date': new FormControl(),
            //             'end_date': new FormControl(),
            //             'details': new FormControl(),
            //         })
            //     );
            // }

            this.spinner.show();
            this.usersevice.getEmployeeByIdSelf(this.id).subscribe(response => {
                this.employee = response;
                if (this.employee.gender) {
                    this.employee.gender = this.employee.gender.id;
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
        this.qualification = StorageManagerService.getQualifications();
        if (this.qualification === null) {
            this.optionservice.getSelectOption(12).subscribe((res: any) => {
                this.qualification = res.data;
                StorageManagerService.storeQualifications(this.qualification);
            });
        }
        this.spinner.hide();
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
                console.log(error);
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
                console.log(error);
            }
        );
    }

    RemoveFile = (file_name) => {
        this.employee[file_name] = '';
    }

    updateEmployee = () => {
        for (let i = 0; i < this.qualification; i++) {
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
            this.employee.user_qualification = this.EmployeeeEditForm.value['user_qualification'];
            this.employee.user_work = this.EmployeeeEditForm.value['user_work_experience'];
            delete this.employee.joining_date;
            delete this.employee.probation_end_date;
            delete this.employee.password;
            delete this.employee.increment_date;
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
                    this.router.navigate(['/self/profile']);
                    this.flashMessageService.pop('success', 'Profile Updated', 'Your Profile Updated Successfully');
                }
            });
        }
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
                console.log(error);
            }
        );
    }

    RemoveDoc(index) {
        this.quali_images[index]['image'] = '';
        // console.log(this.EmployeeeEditForm);
        // this.employee_qualification[index][file_name] = '';
    }

    uploadEmpDoc(controlName: any, event: any, index: any) {
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
                console.log(error);
            }
        );
    }

    RemoveEmpDoc(controlName: any, index) {
        this.work_exp_images[index][controlName] = '';
        // this.employee_qualification[index][file_name] = '';
    }

    cancel = () => {
        this.router.navigate(['/self/profile']);
    }
}
