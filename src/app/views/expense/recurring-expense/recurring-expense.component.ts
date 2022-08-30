import { OnInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContactService } from '../../../shared/services/contact.service';
import { ExpenseService } from '../../../shared/services/expense.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { AppConstants } from '../../../constants/app.constants';
@Component({
    selector: 'app-recurring-expense',
    templateUrl: './recurring-expense.component.html',
    styleUrls: ['./recurring-expense.component.scss']
})
export class RecurringExpenseComponent implements OnInit {
    modalRef: BsModalRef;
    expenseForm: FormGroup;
    expense;
    expense_edit;
    re_expensedetail;
    search;
    allcheck_id;
    re_expense_data: any = [];
    allcheck_id_count: any = 0;
    employee_image = '../../../../assets/img/avatars/profile_image.jpg';
    IMAGE_URL = AppConstants.IMAGE_URL;
    constructor(public router: Router,
        private spinner: NgxSpinnerService,
        private contactservice: ContactService,
        private expenseservice: ExpenseService,
        private flashMessageService: FlashMessageService,
        private modalService: BsModalService) {

    }
    ngOnInit() {
        this.expenseForm = new FormGroup({
            'title': new FormControl(),
            'category': new FormControl(),
            'amount': new FormControl(),
            'bill_date': new FormControl(),
        });
        this.getAllExpense();
    }

    getAllExpense = () => {
        this.spinner.show();
        this.expenseservice.getAllRecExpense().subscribe(res => {
            this.re_expense_data = res.data;
            for (let i = 0; i < this.re_expense_data.length; i++) {
                this.re_expense_data[i]['category_name'] = this.re_expense_data[i]['category_id']['name'];
            }
            this.spinner.hide();
        });
    }

    checkboxHeader = (evt: Event) => {
        this.allcheck_id_count = 0;
        if (this.allcheck_id !== true) {
            for (let i = 0; i < this.re_expense_data.length; i++) {
                this.re_expense_data[i]['isSelected'] = true;
                this.allcheck_id_count++;
            }
        } else {
            for (let i = 0; i < this.re_expense_data.length; i++) {
                this.re_expense_data[i]['isSelected'] = false;
            }
        }
        // console.log(this.dept);
    }

    checkone = (id) => {
        this.allcheck_id = false;
        let selectId = '';
        this.allcheck_id_count = 0;
        this.re_expensedetail = [];
        setTimeout(() => {
            for (let i = 0; i < this.re_expense_data.length; i++) {
                if (this.re_expense_data[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selectId = this.re_expense_data[i];
                }
            }
            if (this.allcheck_id_count === 1) {
                this.getExpenseById(selectId);
            }
        }, 100);
    }

    getExpenseById = (expense) => {
        this.re_expensedetail = expense;
    }

    EditContact = () => {
        this.expense_edit = [];
        this.expense_edit = this.re_expense_data;
        for (let i = 0; i < this.expense_edit.length; i++) {
            if (this.expense_edit[i]['isSelected']) {
                this.router.navigate(['/expense/recurring-expense/edit/' + this.expense_edit[i].id]);
            }
        }
    }
    SaveExpense = () => {
        this.expense = this.expenseForm.value;
        this.expenseservice.saveExpense(this.expense).subscribe(res => {
            if (res === 'Expense Add succesfully') {
                this.closeModel();
                this.flashMessageService.pop('success', 'Expense Add SuccesFully', 'Expense Add');
            }
        });
    }
    deleteExpense = () => {
        this.expense_edit = [];
        this.expense_edit = this.re_expense_data;
        this.expenseservice.deleteExpense(this.expense_edit).subscribe((responseData: any) => {
            if (responseData.response === 'success') {
                this.closeModel();
                this.allcheck_id_count = 0;
                this.flashMessageService.pop('error', 'Expense Deleted', 'Deleted Succesfully');
                this.getAllExpense();
            }

        });

    }
    openModel = (template) => {
        this.modalRef = this.modalService.show(template);
    }


    closeModel = () => {
        this.modalRef.hide();
    }
}
