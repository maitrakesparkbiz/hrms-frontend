import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { AppConstants } from '../../../constants/app.constants';
import { ContactService } from '../../../shared/services/contact.service';
import { ExpenseService } from '../../../shared/services/expense.service';
import { FileUploadService } from '../../../shared/services/file-upload.service';
import { ExpensecategoryService } from '../../../shared/services/expensecategory.service';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';


@Component({
    selector: 'app-expense-add',
    templateUrl: './expense-add.component.html',
    styleUrls: ['./expense-add.component.scss']
})
export class ExpenseAddComponent implements OnInit {
    expenseForm: FormGroup;
    expense: any;
    expense_edit = [];
    file_response;
    sub;
    id;
    validateForm = false;
    catList;
    planModel: any = { start_time: new Date() };
    DOWNLOAD_IMAGE_URL: any;
    IMAGE_URL: any;
    files: any;
    UserData: any = [];
    constructor(
        public router: Router,
        private spinner: NgxSpinnerService,
        private contactservice: ContactService,
        private route: ActivatedRoute,
        private flashMessageService: FlashMessageService, private modalService: BsModalService,
        private fileuploadservice: FileUploadService,
        private expenseservice: ExpenseService,
        private expense_cat_service: ExpensecategoryService) {
    }
    ngOnInit() {
        this.IMAGE_URL = AppConstants.FILE_URL;
        this.DOWNLOAD_IMAGE_URL = AppConstants.DOWNLOAD_FILE_URL;
        this.expenseForm = new FormGroup({
            'id': new FormControl(),
            'emp_id': new FormControl(),
            'actioned_by': new FormControl(),
            'title': new FormControl(null, [Validators.required]),
            'category_id': new FormControl(null, [Validators.required]),
            'description': new FormControl(null, [Validators.required]),
            'amount': new FormControl(null, [Validators.required]),
            'bill_date': new FormControl(null, [Validators.required]),
            'payment_method': new FormControl(null, [Validators.required]),
            'merchant': new FormControl(null, [Validators.required]),
            'receipt_image': new FormControl()
        });

        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number
        });
        this.UserData = JSON.parse(StorageManagerService.getUser());
        this.getExpCategory();
        if (this.id) {
            this.spinner.show();
            const IMAGE_URL = AppConstants.FILE_URL;
            this.expenseservice.getExpenseById(this.id).subscribe(response => {
                const a = [];
                this.expense_edit = response;
                this.expenseForm.controls['id'].setValue(this.expense_edit['id']);
                this.expenseForm.controls['title'].setValue(this.expense_edit['title']);
                this.expenseForm.controls['category_id'].setValue(this.expense_edit['category_id']['id']);
                this.expenseForm.controls['description'].setValue(this.expense_edit['description']);
                this.expenseForm.controls['amount'].setValue(this.expense_edit['amount']);
                this.expenseForm.controls['payment_method'].setValue(this.expense_edit['payment_method']);
                this.expenseForm.controls['merchant'].setValue(this.expense_edit['merchant']);
                this.expenseForm.controls['bill_date'].setValue(moment(this.expense_edit['bill_date'].date).format());
                this.expenseForm.controls['actioned_by'].setValue(this.UserData.id);
                this.spinner.hide();
            });
        } else {
            this.expenseForm.controls['emp_id'].setValue(this.UserData.id);
        }
    }

    getExpCategory = () => {
        this.expense_cat_service.getExpenseCategory().subscribe(
            (res) => {
                this.catList = res.data;
            }
        );
    }

    Saveexpense = () => {
        if (this.expenseForm.valid) {
            this.validateForm = true;
            this.expense = this.expenseForm.value;
            if (this.file_response) {
                this.expense['receipt_image'] = this.file_response.filename;
            }
            if (this.expense['receipt_image'] === null) {
                this.expense['receipt_image'] = '';
            }
            // this.expense['status'] = 'Approve';
            this.expense['is_expense'] = 1;
            this.expenseservice.saveExpense(this.expense).subscribe(res => {
                if (res === 'Expense Add succesfully') {
                    this.router.navigate(['/expense/view-expense']);
                    this.flashMessageService.pop('success', 'Expense Add SuccesFully', 'Expense Add');
                }
                if (res === 'Expense Update succesfully') {
                    this.router.navigate(['/expense/view-expense']);
                    this.flashMessageService.pop('success', 'Expense Upadate SuccesFully', 'Expense Update');
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
        this.fileuploadservice.uploadFile(fData).subscribe(
            response => {
                this.file_response = response;
                this.expense_edit['receipt_image'] = this.file_response.filename;
            },
            error => {
                // console.log(error);
            }
        );
    }

    // uploadImage(event: any) {
    //     this.files = event.target.files;
    // }

    removeImage = (file_name) => {
        this.expense_edit[file_name] = '';
    }

    cancel = () => {
        this.router.navigate(['/expense/view-expense']);
    }

}
