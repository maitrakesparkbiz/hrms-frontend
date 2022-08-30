import { OnInit, Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContactService } from '../../../../shared/services/contact.service';
import { FlashMessageService } from '../../../../shared/services/flash-message.service';
import { BsModalService } from 'ngx-bootstrap';
import { FileUploadService } from '../../../../shared/services/file-upload.service';
import { ExpenseService } from '../../../../shared/services/expense.service';
import { ExpensecategoryService } from '../../../../shared/services/expensecategory.service';
import * as moment from 'moment';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';
import { OptionService } from '../../../../shared/services/option.service';
@Component({
    selector: 'app-recurring-expense-add',
    templateUrl: './recurring-expense-add.component.html',
    styleUrls: ['./recurring-expense-add.component.scss']
})

export class RecurringExpenseAddComponent implements OnInit {
    expenseForm: FormGroup;
    expense: any;
    expense_edit;
    file_response;
    sub;
    id;
    catList;
    validateForm = false;
    UserData: any = [];
    rotations: any = [];
    constructor(
        public router: Router,
        private spinner: NgxSpinnerService,
        private route: ActivatedRoute,
        private flashMessageService: FlashMessageService,
        private expenseservice: ExpenseService,
        private expense_cat_service: ExpensecategoryService,
        private optionService: OptionService) {
    }

    ngOnInit() {
        this.expenseForm = new FormGroup({
            'id': new FormControl(),
            'emp_id': new FormControl(),
            'actioned_by': new FormControl(),
            'title': new FormControl(null, [Validators.required]),
            'rotation': new FormControl('', [Validators.required]),
            'category_id': new FormControl(null, [Validators.required]),
            'description': new FormControl(null, [Validators.required]),
            'amount': new FormControl(null, [Validators.required]),
            'day_of_month': new FormControl(null),
            'payment_method': new FormControl(null, [Validators.required]),
            'merchant': new FormControl(null, [Validators.required])
        });
        this.UserData = JSON.parse(StorageManagerService.getUser());
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number
        });
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id']; // (+) converts string 'id' to a number
        });
        this.getExpenseRotations();
        this.getExpenseCategory();
        if (this.id) {
            this.spinner.show();
            this.expenseservice.getExpenseById(this.id).subscribe(response => {
                const a = [];
                this.expense_edit = response;
                this.onSelectRotation(this.expense_edit['rotation']['id']);
                this.expenseForm.controls['id'].setValue(this.expense_edit['id']);
                this.expenseForm.controls['title'].setValue(this.expense_edit['title']);
                this.expenseForm.controls['category_id'].setValue(this.expense_edit['category_id']['id']);
                this.expenseForm.controls['rotation'].setValue(this.expense_edit['rotation']['id']);
                this.expenseForm.controls['description'].setValue(this.expense_edit['description']);
                this.expenseForm.controls['amount'].setValue(this.expense_edit['amount']);
                this.expenseForm.controls['payment_method'].setValue(this.expense_edit['payment_method']);
                this.expenseForm.controls['merchant'].setValue(this.expense_edit['merchant']);
                this.expenseForm.controls['day_of_month'].setValue(this.expense_edit['day_of_month']);
                this.expenseForm.controls['actioned_by'].setValue(this.UserData.id);
            });
            this.spinner.hide();
        } else {
            this.expenseForm.controls['emp_id'].setValue(this.UserData.id);
        }
    }

    getExpenseCategory = () => {
        this.expense_cat_service.getExpenseCategory().subscribe(
            res => {
                this.catList = res.data;
            }
        );
    }

    getExpenseRotations = () => {
        this.optionService.getSelectOption(13).subscribe(
            (res) => {
                this.rotations = res.data;
            }
        );
    }

    Saveexpense = () => {
        if (this.expenseForm.valid) {
            this.validateForm = true;
            this.expense = this.expenseForm.value;
            this.expense['is_recurring_exp'] = 1;
            this.expenseservice.saveExpense(this.expense).subscribe(res => {
                if (res === 'Expense Add succesfully') {
                    this.router.navigate(['/expense/recurring-expense']);
                    this.flashMessageService.pop('success', 'Expense Add SuccesFully', 'Expense Add');
                }
                if (res === 'Expense Update succesfully') {
                    this.router.navigate(['/expense/recurring-expense']);
                    this.flashMessageService.pop('success', 'Expense Upadate SuccesFully', 'Expense Update');
                }
            });
        }
    }

    cancel = () => {
        this.router.navigate(['/expense/recurring-expense']);
    }

    onSelectRotation = (id) => {
        if (+id === 58) {
            this.expenseForm.get('day_of_month').reset();
            this.expenseForm.get('day_of_month').setErrors(null);
            this.expense_edit['day_of_month'] = '';
        } else {
            this.expenseForm.get('day_of_month').setValue(null);
            this.expenseForm.get('day_of_month').setValidators([Validators.required]);
        }
    }
}
