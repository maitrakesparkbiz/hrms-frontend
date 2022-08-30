import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessageService } from '../../shared/services/flash-message.service';
import { UserService } from '../../shared/services/user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AppConstants } from '../../constants/app.constants';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { StorageManagerService } from '../../shared/services/storage-manager.service';
import { OptionService } from '../../shared/services/option.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../shared/services/datatable.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AttandanceService } from '../../shared/services/attandance.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})

export class EmployeesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  objectKeys = Object.keys;
  employee: any = [];
  allcheck_id;
  search;
  employee_edit;
  employee_image;
  employeedetail: any = {};
  user_account = [];
  user_qualification = [];
  qualification: any = [];
  u_qua: any = [];
  user_experience = [];
  IMAGE_URL;
  example;
  DOWNLOAD_URL;
  DOWNLOAD_IMAGE_URL;
  modalRef: BsModalRef;
  allcheck_id_count: any = 0;
  isFirstOpen = true;
  productiveOpen: boolean;
  durationForm: FormGroup;
  selectedEmpId: any = 0;
  prod_arr: any = [];
  @ViewChild('acc') acc: ElementRef;
  @ViewChild('info') infoaccordian: ElementRef;
  constructor(
    public router: Router,
    public flashMessageService: FlashMessageService,
    public userservice: UserService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private optionservice: OptionService,
    private datatableService: DatatableService,
    private attendanceService: AttandanceService
  ) {
  }

  ngOnInit() {
    this.IMAGE_URL = AppConstants.IMAGE_URL;
    this.DOWNLOAD_URL = AppConstants.DOWNLOAD_FILE_URL;
    this.DOWNLOAD_IMAGE_URL = AppConstants.DOWNLOAD_IMAGE_URL;
    this.employee_image = '../../../assets/img/avatars/profile_image.jpg';

    this.qualification = StorageManagerService.getQualifications();
    if (this.qualification === null) {
      this.optionservice.getSelectOption(12).subscribe((res: any) => {
        this.qualification = res.data;
        StorageManagerService.storeQualifications(this.qualification);
      });
    }
    this.durationForm = new FormGroup({
      'duration': new FormControl('all'),
      'status': new FormControl('all')
    });
    // this.employee=[
    //     {'id':1,'employee_id':'14DEV089','name':'Mansi shah'},
    //     {'id':2,'employee_id':'14DEV019','name':'Payal patel'}
    //     ]
    this.get_all_employee();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  onAccordianOpen = (ref: TemplateRef<any>) => {
    this.productiveOpen = true;
    if (ref['isOpen']) {
      if (this.prod_arr.length === 0) {
        this.attendanceService.getEmpProductivityRatio(this.selectedEmpId).subscribe(
          (res) => {
            this.prod_arr = res;
          }
        );
      }
    }
  }

  get_all_employee = () => {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      lengthMenu: [5, 10, 25, 50],
      serverSide: true,
      processing: true,
      language: {
        searchPlaceholder: 'Search...',
        search: ''
      },
      // search: { search: this.leaveForm.get('status').value },
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.columns[4].search.value = this.durationForm.get('duration').value;
        dataTablesParameters.columns[0].search.value = this.durationForm.get('status').value;
        this.datatableService.getTableData(dataTablesParameters, 'datatable/getDatatableUsers').subscribe(resp => {
          this.allcheck_id = false;
          this.allcheck_id_count = 0;
          this.employee = resp.data;
          Object.keys(this.employee).forEach((index) => {
            if (this.employee[index]['joining_date']) {
              this.employee[index]['duration'] = this.getDuration(this.employee[index].joining_date.date);
            }
          });
          // this.spinner.hide();
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      order: [],
      columns: [{ name: 'id', orderable: false },
      { name: 'employee_id' },
      { name: 'firstname' },
      { name: 'name' },
      { name: 'joining_date' },
      { name: 'leaves', orderable: false }]
    };
  }

  rerender = (): void => {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  deleteModel = (template) => {
    this.modalRef = this.modalService.show(template);
  }
  closeModel = () => {
    this.modalRef.hide();
  }
  checkboxHeader = (evt: Event) => {

    this.allcheck_id_count = 0;
    if (this.allcheck_id !== true) {
      for (let i = 0; i < this.employee.length; i++) {
        this.employee[i]['isSelected'] = true;
        this.allcheck_id_count++;
      }
    } else {
      for (let i = 0; i < this.employee.length; i++) {
        this.employee[i]['isSelected'] = false;

      }
    }
  }

  checkone = (id) => {
    this.allcheck_id = false;
    let selectId = '';
    this.allcheck_id_count = 0;
    this.employeedetail = [];
    for (let i = 0; i < this.employee.length; i++) {
      if (+id === +this.employee[i]['id']) {
        this.employee[i]['isSelected'] = !this.employee[i]['isSelected'];
        if (this.employee[i]['isSelected']) {
          this.allcheck_id_count++;
          selectId = this.employee[i]['id'];
        }
      } else {
        this.employee[i]['isSelected'] = false;
      }
    }
    if (this.allcheck_id_count === 1) {
      this.selectedEmpId = selectId;
      this.getEmployeeById(selectId);
    }
  }

  getEmployeeById = (id) => {
    this.productiveOpen = false;
    this.spinner.show();
    this.prod_arr = [];
    this.userservice.getEmployeeById(id).subscribe(res => {
      this.spinner.hide();
      this.employeedetail = res;
      if (this.employeedetail['user_leaves'].length > 0) {
        this.employeedetail.remaining_leaves = +(this.employeedetail.user_leaves[0]['cl']) +
          +(this.employeedetail.user_leaves[0]['pl']) +
          +(this.employeedetail.user_leaves[0]['sl']);
      } else {
        this.employeedetail.remaining_leaves = 0;
      }
      if (this.employeedetail['gender']) {
        this.employeedetail.gender = this.employeedetail.gender['key_text'];
      }
      if (this.employeedetail['department']) {
        this.employeedetail.department = this.employeedetail.department['name'];
      }
      if (this.employeedetail['designation']) {
        this.employeedetail.designation = this.employeedetail.designation['name'];
      }
      if (this.employeedetail['location']) {
        this.employeedetail.location = this.employeedetail.location['name'];
      }
      if (this.employeedetail['report_to']) {
        this.employeedetail.report_to = this.employeedetail.report_to['firstname'] +
          ' ' + this.employeedetail.report_to['lastname'];
      }
      if (this.employeedetail['is_manager'] === true) {
        this.employeedetail.is_manager = 'Yes';
      }
      if (this.employeedetail['is_manager'] === false) {
        this.employeedetail.is_manager = 'No';
      }
      if (this.employeedetail['primary_account']) {
        this.employeedetail.primary_account = this.employeedetail.primary_account['key_text'];
      }

      if (this.employeedetail['user_account']) {
        this.user_account = this.employeedetail.user_account;
        for (let i = 0; i < this.user_account.length; i++) {
          if (this.user_account[i]['account_type']) {
            this.user_account[i].account_type = this.user_account[i].account_type['key_text'];
          }
        }
      }

      if (this.employeedetail['user_qualification']) {
        this.user_qualification = this.employeedetail.user_qualification;

        for (let i = 0; i < this.qualification.length; i++) {
          for (let j = 0; j < this.user_qualification.length; j++) {
            if (this.qualification[i].id === this.user_qualification[j].education_type.id) {
              if (this.user_qualification[j]['education_type']) {
                this.user_qualification[j].education_type = this.user_qualification[j].education_type['key_text'];
              }
              this.u_qua.push(this.user_qualification[j]);
            }
          }
        }
      }
      if (this.employeedetail['user_work']) {
        this.user_experience = this.employeedetail.user_work;
      }
      if (this.employeedetail.joining_date) {
        this.employeedetail.duration = this.getDuration(this.employeedetail.joining_date.date);
      }
      const arr = ['profile_image',
        'joining__date',
        'probation_end_date',
        'exit_date', 'passport_issue_date',
        'passport_expiry_date',
        'visa_issue_date', 'visa_expiry_date'
      ];
      Object.keys(this.employeedetail).forEach(element => {
        if (this.employeedetail[element] === null || this.employeedetail[element] === '') {
          if (arr.indexOf(element) < 0) {
            this.employeedetail[element] = '-';
          }
        }
      });
    });
  }

  getDuration = (joinDate) => {
    const b = moment(joinDate);
    const a = moment();

    const intervals: any = ['years', 'months', 'days'];
    const out: any = [];

    for (let i = 0; i < intervals.length; i++) {
      const diff = a.diff(b, intervals[i]);
      b.add(diff, intervals[i]);
      if (+diff > 0) {
        if (+diff > 1) {
          out.push(diff + ' ' + intervals[i]);
        } else {
          out.push(diff + ' ' + intervals[i].slice(0, -1));
        }
      }
    }
    if (out.length > 0) {
      return out.join(', ') + ' ago';
    }
    return '';
  }

  EditEmployee = () => {
    this.employee_edit = [];
    this.employee_edit = this.employee;
    for (let i = 0; i < this.employee.length; i++) {
      if (this.employee_edit[i]['isSelected']) {
        this.router.navigate(['/employee/update/' + this.employee_edit[i].id]);
      }
    }
  }
  DeleteEmployee = () => {
    this.employee_edit = [];
    this.employee_edit = this.employee;
    this.userservice.deleteUser(this.employee_edit).subscribe(res => {
      this.closeModel();
      this.allcheck_id_count = 0;
      this.get_all_employee();
    });
  }

  openProfile = (id) => {
    this.router.navigate(['/employee/employee-profile/' + id]);
  }
}
