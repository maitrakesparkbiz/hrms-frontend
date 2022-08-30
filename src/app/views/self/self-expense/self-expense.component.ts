import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { AppConstants } from '../../../constants/app.constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExpenseService } from '../../../shared/services/expense.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { HttpClient } from '@angular/common/http';
import { DatatableService } from '../../../shared/services/datatable.service';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
    selector: 'app-self-expense',
    templateUrl: 'self-expense.component.html',
    styleUrls: ['./self-expense.component.scss']
})

export class SelfExpenseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    modalRef: BsModalRef;
    expense;
    expense_status;
    expense_edit;
    expensedetail;
    allcheck_id;
    expense_data: any = [];
    allcheck_id_count: any = 0;
    employee_image = '../../../../assets/img/avatars/profile_image.jpg';
    IMAGE_URL = AppConstants.IMAGE_URL;
    FILE_URL = AppConstants.FILE_URL;
    userData: any = [];
    filterForm: FormGroup;

    constructor(
        public router: Router,
        private spinner: NgxSpinnerService,
        private expenseservice: ExpenseService,
        private flashMessageService: FlashMessageService,
        private modalService: BsModalService,
        private httpclient: HttpClient,
        private datatableService: DatatableService) {
    }

    ngOnInit() {
        this.userData = JSON.parse(StorageManagerService.getUser());
        this.filterForm = new FormGroup({
            'status': new FormControl('all')
        });
        this.getSelfExpense();
    }

    getSelfExpense = () => {
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
                dataTablesParameters.columns[5].search.value = this.filterForm.get('status').value;
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getSelfExpense').subscribe(resp => {
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
            { name: 'bill_date' },
            { name: 'status', orderable: false, searchable: false }]
        };
    }

    getSelectedData = () => {
        this.rerender();
    }

    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
        });
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
        // let tempCount = 0;
        for (let i = 0; i < this.expense_data.length; i++) {
            if (+id === +this.expense_data[i]['id']) {
                this.expense_data[i]['isSelected'] = !this.expense_data[i]['isSelected'];
                if (this.expense_data[i]['isSelected']) {
                    this.expense_status = this.expense_data[i]['status'];
                    this.allcheck_id_count++;
                    selectId = this.expense_data[i];
                }
            } else {
                this.expense_data[i]['isSelected'] = false;
                // if (this.allTeams[i]['isSelected']) {
                //     selectId = this.allTeams[i];
                //     this.allcheck_id_count++;
                // }
            }
            // if (this.allTeams[i]['isSelected']) {
            //     tempCount++;
            // }
        }
        // if (tempCount === this.allTeams.length) {
        //     this.allcheck_id = true;
        // }
        if (this.allcheck_id_count === 1) {
            this.getExpenseById(selectId);
        }
    }

    // checkone(id) {
    //     this.allcheck_id = false;
    //     let selectId: any = '';
    //     this.allcheck_id_count = 0;
    //     this.expensedetail = [];
    //     setTimeout(() => {
    //         for (let i = 0; i < this.expense_data.length; i++) {
    //             if (+this.expense_data[i]['id'] === +id) {
    //                 if (this.expense_data[i]['isSelected']) {
    //                     this.expense_status = this.expense_data[i]['status'];
    //                     this.allcheck_id_count++;
    //                     selectId = this.expense_data[i];
    //                 }
    //             } else {
    //                 this.expense_data[i]['isSelected'] = false;
    //             }
    //         }
    //         if (this.allcheck_id_count === 1) {
    //             this.getExpenseById(selectId);
    //         }
    //     }, 100);
    // }

    getExpenseById = (expense) => {
        this.expensedetail = expense;
    }

    EditContact = () => {
        this.expense_edit = [];
        this.expense_edit = this.expense_data;
        for (let i = 0; i < this.expense_edit.length; i++) {
            if (this.expense_edit[i]['isSelected']) {
                this.router.navigate(['/self/expense/edit/' + this.expense_edit[i].id]);
            }
        }
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    deleteExpense = () => {
        this.expense_edit = [];
        this.expense_edit = this.expense_data;
        this.closeModel();
        this.expenseservice.deleteExpense(this.expense_edit).subscribe((responseData: any) => {
            if (responseData.response === 'success') {
                this.allcheck_id_count = 0;
                this.flashMessageService.pop('error', 'Expense Claim Deleted', 'Deleted Succesfully');
                this.rerender();
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
