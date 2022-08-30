import { Component, OnInit, TemplateRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FlashMessageService } from '../../shared/services/flash-message.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup } from '@angular/forms';
import { ContactService } from '../../shared/services/contact.service';
import { ExpenseService } from '../../shared/services/expense.service';
import * as moment from 'moment';
import { AppConstants } from '../../constants/app.constants';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../shared/services/datatable.service';


@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  modalRef: BsModalRef;
  expenseForm: FormGroup;
  expense;
  expense_edit;
  expensedetail;
  search;
  allcheck_id;
  expense_data: any = [];
  allcheck_id_count: any = 0;
  planModel: any = { start_time: new Date() };
  employee_image = '../../../assets/img/avatars/profile_image.jpg';
  IMAGE_URL = AppConstants.IMAGE_URL;
  FILE_URL = AppConstants.FILE_URL;
  constructor(
    public router: Router,
    private spinner: NgxSpinnerService,
    private contactservice: ContactService,
    private expenseservice: ExpenseService,
    private flashMessageService: FlashMessageService,
    private modalService: BsModalService,
    private datatableService: DatatableService) {
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

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  // getAllExpense() {
  //     this.spinner.show();
  //     this.expenseservice.getAllExpense().subscribe(res => {
  //         this.expense_data = res.data;
  //         for (let i = 0; i < this.expense_data.length; i++) {
  //             this.expense_data[i]['category_name'] = this.expense_data[i]['category_id']['name'];
  //             this.expense_data[i].bill_date = moment(this.expense_data[i].bill_date.date).format('MMM D Y');
  //         }
  //         this.spinner.hide();
  //     });
  // }

  getAllExpense = () => {
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

      ajax: (dataTablesParameters: any, callback) => {
        this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllExpense').subscribe(resp => {
          this.allcheck_id = false;
          this.expense_data = resp.data;
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
      { name: 'title' },
      { name: 'name' },
      { name: 'amount' },
      { name: 'bill_date' }]
    };
  }


  checkboxHeader = (evt: Event) => {
    this.allcheck_id_count = 0;
    if (this.allcheck_id !== true) {
      for (let i = 0; i < this.expense_data.length; i++) {
        this.expense_data[i]['isSelected'] = true;
        this.allcheck_id_count++;
      }
    } else {
      for (let i = 0; i < this.expense_data.length; i++) {
        this.expense_data[i]['isSelected'] = false;
      }
    }
  }

  checkone = (id) => {
    this.allcheck_id = false;
    let selectId = '';
    this.allcheck_id_count = 0;
    this.expensedetail = [];
    let tempCount = 0;
    for (let i = 0; i < this.expense_data.length; i++) {
      if (+id === +this.expense_data[i]['id']) {
        this.expense_data[i]['isSelected'] = !this.expense_data[i]['isSelected'];
        if (this.expense_data[i]['isSelected']) {
          this.allcheck_id_count++;
          selectId = this.expense_data[i];
        }
      } else {
        if (this.expense_data[i]['isSelected']) {
          selectId = this.expense_data[i];
          this.allcheck_id_count++;
        }
      }
      if (this.expense_data[i]['isSelected']) {
        tempCount++;
      }
    }
    if (tempCount === this.expense_data.length) {
      this.allcheck_id = true;
    }
    if (this.allcheck_id_count === 1) {
      this.getExpenseById(selectId);
    }
  }

  getExpenseById = (expense) => {
    this.expensedetail = expense;
  }

  EditContact = () => {
    this.expense_edit = [];
    this.expense_edit = this.expense_data;
    for (let i = 0; i < this.expense_edit.length; i++) {
      if (this.expense_edit[i]['isSelected']) {
        this.router.navigate(['/expense/view-expense/update-expense/' + this.expense_edit[i].id]);
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
    this.expense_edit = this.expense_data;
    this.closeModel();
    this.expenseservice.deleteExpense(this.expense_edit).subscribe((responseData: any) => {
      if (responseData.response === 'success') {
        this.allcheck_id_count = 0;
        this.flashMessageService.pop('error', 'Expense Deleted', 'Deleted Succesfully');
        this.rerender();
      }
    });
  }

  rerender = (): void => {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  openModel = (template) => {
    this.modalRef = this.modalService.show(template);
  }


  closeModel = () => {
    this.modalRef.hide();
  }
}
