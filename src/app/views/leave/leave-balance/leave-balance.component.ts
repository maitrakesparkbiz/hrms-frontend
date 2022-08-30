import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { FormControl, FormGroup } from "@angular/forms";
import { AppConstants } from "../../../constants/app.constants";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ContactService } from "../../../shared/services/contact.service";
import { ExpenseService } from "../../../shared/services/expense.service";
import { FlashMessageService } from "../../../shared/services/flash-message.service";
import { DatatableService } from "../../../shared/services/datatable.service";

@Component({
  selector: 'app-leave-balance',
  templateUrl: './leave-balance.component.html',
  styleUrls: ['./leave-balance.component.scss']
})
export class LeaveBalanceComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  modalRef: BsModalRef;
  expenseForm: FormGroup;
  expense;
  expense_edit;
  leave_balance_details;
  search;
  allcheck_id;
  leave_balance_data: any = [];
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
    this.getAllUserLeaves();
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
  //         this.leave_balance_data = res.data;
  //         for (let i = 0; i < this.leave_balance_data.length; i++) {
  //             this.leave_balance_data[i]['category_name'] = this.leave_balance_data[i]['category_id']['name'];
  //             this.leave_balance_data[i].bill_date = moment(this.leave_balance_data[i].bill_date.date).format('MMM D Y');
  //         }
  //         this.spinner.hide();
  //     });
  // }

  getAllUserLeaves = () => {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      serverSide: true,
      processing: true,
      language: {
        searchPlaceholder: 'Search...',
        search: ''
      },

      ajax: (dataTablesParameters: any, callback) => {
        this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllUserLeaves').subscribe(resp => {
          this.allcheck_id = false;
          this.leave_balance_data = resp.data;
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
      { name: 'firstname' },
      { name: 'balance' }]
    };
  }


  checkboxHeader = (evt: Event) => {
    this.allcheck_id_count = 0;
    if (this.allcheck_id !== true) {
      for (let i = 0; i < this.leave_balance_data.length; i++) {
        this.leave_balance_data[i]['isSelected'] = true;
        this.allcheck_id_count++;
      }
    } else {
      for (let i = 0; i < this.leave_balance_data.length; i++) {
        this.leave_balance_data[i]['isSelected'] = false;
      }
    }
    // console.log(this.dept);
  }

  checkone = (id) => {
    this.allcheck_id = false;
    let selectId = '';
    this.allcheck_id_count = 0;
    this.leave_balance_details = [];
    let tempCount = 0;
    // setTimeout(() => {
    for (let i = 0; i < this.leave_balance_data.length; i++) {
      if (+id === +this.leave_balance_data[i]['id']) {
        this.leave_balance_data[i]['isSelected'] = !this.leave_balance_data[i]['isSelected'];
        if (this.leave_balance_data[i]['isSelected']) {
          this.allcheck_id_count++;
          selectId = this.leave_balance_data[i];
        }
      } else {
        this.leave_balance_data[i]['isSelected'] = false;
        // if (this.leave_balance_data[i]['isSelected']) {
        //   selectId = this.leave_balance_data[i];
        //   this.allcheck_id_count++;
        // }
      }
      if (this.leave_balance_data[i]['isSelected']) {
        tempCount++;
      }
    }
    if (tempCount === this.leave_balance_data.length) {
      this.allcheck_id = true;
    }
    if (this.allcheck_id_count === 1) {
      this.getExpenseById(selectId);
    }
    // }, 100);
  }

  getExpenseById = (expense) => {
    this.leave_balance_details = expense;
  }

  EditContact = () => {
    this.expense_edit = [];
    this.expense_edit = this.leave_balance_data;
    for (let i = 0; i < this.expense_edit.length; i++) {
      if (this.expense_edit[i]['isSelected']) {
        this.router.navigate(['leave/leave-balance/edit/' + this.expense_edit[i].id]);
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
    this.expense_edit = this.leave_balance_data;
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
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
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
