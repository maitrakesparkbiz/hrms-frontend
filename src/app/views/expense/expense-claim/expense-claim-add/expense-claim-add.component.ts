import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Renderer, Renderer2 } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FlashMessageService } from '../../../../shared/services/flash-message.service';
import { AppConstants } from '../../../../constants/app.constants';
import { ContactService } from '../../../../shared/services/contact.service';
import { ExpenseService } from '../../../../shared/services/expense.service';
import { FileUploadService } from '../../../../shared/services/file-upload.service';
import { UserService } from '../../../../shared/services/user.service';
import { ExpensecategoryService } from '../../../../shared/services/expensecategory.service';
import { HttpClient } from '@angular/common/http';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';


@Component({
  selector: 'app-expense-claim',
  templateUrl: './expense-claim-add.component.html',
  styleUrls: ['./expense-claim-add.component.scss']
})
export class ExpenseClaimAddComponent implements OnInit {
  expenseForm: FormGroup;
  expense: any;
  employee;
  expense_edit = [];
  file_response;
  sub;
  id;
  catList;
  files;
  planModel: any = { start_time: new Date() };
  DOWNLOAD_IMAGE_URL: any;
  IMAGE_URL: any;
  resume_select: any = false;
  urlParams: any = [];
  selfUrl = '';
  UserData: any = [];
  emp_data;
  @ViewChild('emp_opts') emp_opts: ElementRef;
  constructor(
    public router: Router,
    private spinner: NgxSpinnerService,
    private contactservice: ContactService,
    private route: ActivatedRoute,
    private flashMessageService: FlashMessageService, private modalService: BsModalService,
    private fileuploadservice: FileUploadService,
    private userservice: UserService,
    private expenseservice: ExpenseService,
    private expense_cat_service: ExpensecategoryService,
    private httpClient: HttpClient,
    private renderer2: Renderer2) {
  }
  ngOnInit() {
    const urlStr = this.router.url.substring(1, this.router.url.length);
    this.urlParams = urlStr.split('/');
    if (this.urlParams[0] === 'self') {
      this.selfUrl = 'self';
    }

    this.IMAGE_URL = AppConstants.FILE_URL;
    this.DOWNLOAD_IMAGE_URL = AppConstants.DOWNLOAD_FILE_URL;
    const array = [];
    this.expenseForm = new FormGroup({
      'id': new FormControl(),
      'actioned_by': new FormControl(),
      'title': new FormControl(null, Validators.required),
      'category_id': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'amount': new FormControl(null, Validators.required),
      'bill_date': new FormControl(null, Validators.required),
      'payment_method': new FormControl(null, Validators.required),
      'merchant': new FormControl(null, Validators.required),
      'emp_id': new FormControl(null, Validators.required),
      'receipt_image': new FormControl(null)
    });

    this.emp_data = JSON.parse(StorageManagerService.getUser());
    if (this.selfUrl) {
      this.expenseForm.controls['emp_id'].setValue(this.emp_data['id']);
    } else {
      this.UserData = this.userservice.all_users;
      if (this.UserData.length === 0) {
        this.getSetAllUsers();
      } else {
        const arr = [];
        for (const data of this.UserData) {
          arr.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
        }
        this.employee = arr;
        requestAnimationFrame(() => {
          this.renderer2.addClass(this.emp_opts['element']['children'][0], 'custom-emp-dropdown');
        });
      }
      // this.userservice.getAllUsers().subscribe(res => {
      //   for (const data of res.data) {
      //     array.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
      //   }
      //   this.employee = array;
      //   this.renderer2.addClass(this.emp_opts['element']['children'][0], 'custom-emp-dropdown');
      // });

    }

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
    this.getExpenseCategory();
    if (this.id) {
      this.spinner.show();
      this.expenseservice.getExpenseById(this.id).subscribe(response => {
        const a = [];
        this.expense_edit = response;
        this.expenseForm.controls['id'].setValue(this.expense_edit['id']);
        this.expenseForm.controls['emp_id'].setValue(this.expense_edit['emp_id']['id']);
        this.expenseForm.controls['title'].setValue(this.expense_edit['title']);
        this.expenseForm.controls['category_id'].setValue(this.expense_edit['category_id']['id']);
        this.expenseForm.controls['description'].setValue(this.expense_edit['description']);
        this.expenseForm.controls['amount'].setValue(this.expense_edit['amount']);
        this.expenseForm.controls['payment_method'].setValue(this.expense_edit['payment_method']);
        this.expenseForm.controls['merchant'].setValue(this.expense_edit['merchant']);
        this.expenseForm.controls['bill_date'].setValue(moment(this.expense_edit['bill_date'].date).format());
        this.expenseForm.controls['actioned_by'].setValue(this.emp_data.id);
      });
      this.spinner.hide();
    }
  }
  getSetAllUsers = async () => {
    const arr = [];
    this.UserData = await this.userservice.getSetAllUsers().toPromise();
    for (const data of this.UserData) {
      arr.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
    }
    this.employee = arr;
    requestAnimationFrame(() => {
      this.renderer2.addClass(this.emp_opts['element']['children'][0], 'custom-emp-dropdown');
    });
  }
  getExpenseCategory = () => {
    this.expense_cat_service.getExpenseCategory().subscribe(
      res => {
        this.catList = res.data;
      }
    );
  }
  Saveexpense = async () => {
    this.expense = this.expenseForm.value;
    this.expense['is_claim'] = 1;
    if (!this.id) {
      this.expense['status'] = 'pending';
    }
    // if (this.file_response) {
    //     this.expense['receipt_image'] = this.file_response.filename;
    // }
    if (this.expenseForm.valid) {
      if (this.files) {
        const fData: FormData = new FormData;
        for (let i = 0; i < this.files.length; i++) {
          fData.append('file', this.files[i]);
        }
        this.file_response = await this.httpClient.post<any>(AppConstants.API_URL + 'upload/uploadFile', fData).toPromise();
        this.expense['receipt_image'] = this.file_response.filename;
      } else {
        if (this.id) {
          this.expense['receipt_image'] = this.expense_edit['receipt_image'];
        }
      }

      if (this.selfUrl) {
        this.expense['emp_id'] = this.emp_data['id'];
      }
      // if (this.file_response) {
      this.expenseservice.saveExpense(this.expense).subscribe(res => {
        if (res === 'Expense Add succesfully') {
          if (this.selfUrl) {
            this.router.navigate(['/self/expense/my-claims']);
          } else {
            this.router.navigate(['/expense/expense-claims']);
          }
          this.flashMessageService.pop('success', 'Expense Add SuccesFully', 'Expense Add');
        }
        if (res === 'Expense Update succesfully') {
          if (this.selfUrl) {
            this.router.navigate(['/self/expense/my-claims']);
          } else {
            this.router.navigate(['/expense/expense-claims']);
          }
          this.flashMessageService.pop('success', 'Expense Upadate SuccesFully', 'Expense Update');
        }
      });
      // }
    }
  }

  uploadFile = (event: any) => {
    this.files = event.target.files;
    if (this.files.length > 0) {
      this.expense_edit['receipt_image'] = this.files[0].name;
      this.resume_select = true;
    }
  }

  removeImage = (file_name) => {
    this.expense_edit[file_name] = '';
    this.resume_select = false;
  }


  cancel = () => {
    if (this.selfUrl) {
      this.router.navigate(['/self/expense/my-claims']);
    } else {
      this.router.navigate(['/expense/expense-claims']);
    }
  }

}
