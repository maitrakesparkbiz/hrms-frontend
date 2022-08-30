import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ExpenseService } from '../../../shared/services/expense.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { AppConstants } from '../../../constants/app.constants';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../../shared/services/datatable.service';
import { DashboardService } from '../../../shared/services/dashboard.service';


class DataTablesResponse {
    data: any[];
    draw: number;
    recordsFiltered: number;
    recordsTotal: number;
}
@Component({
    selector: 'app-expense-claim',
    templateUrl: './expense-claim.component.html',
    styleUrls: ['./expense-claim.component.scss']
})
export class ExpenseClaimComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    modalRef: BsModalRef;
    expenseForm: FormGroup;
    expense;
    expense_status;
    expense_edit;
    expensedetail;
    search;
    allcheck_id;
    expense_data: any = [];
    allcheck_id_count: any = 0;
    pending_count;
    planModel: any = { start_time: new Date() };
    employee_image = '../../../../assets/img/avatars/profile_image.jpg';
    IMAGE_URL = AppConstants.IMAGE_URL;
    FILE_URL = AppConstants.FILE_URL;
    urlParams: any = [];
    selfUrl = '';
    userData: any = [];
    filterForm: FormGroup;
    constructor(
        public router: Router,
        private spinner: NgxSpinnerService,
        private expenseservice: ExpenseService,
        private flashMessageService: FlashMessageService,
        private modalService: BsModalService,
        private datatableService: DatatableService,
        private dashboardService: DashboardService) {
    }

    ngOnInit() {
        const urlStr = this.router.url.substring(1, this.router.url.length);
        this.userData = JSON.parse(StorageManagerService.getUser());
        this.urlParams = urlStr.split('/');
        this.expenseForm = new FormGroup({
            'title': new FormControl(),
            'category': new FormControl(),
            'amount': new FormControl(),
            'bill_date': new FormControl(),
        });

        this.filterForm = new FormGroup({
            'status': new FormControl('all')
        });

        if (this.urlParams[0] === 'self') {
            this.selfUrl = this.urlParams[0];
            this.getSelfExpense();
        } else {
            this.getAllExpense();
        }
    }

    getSelfExpense = () => {
        this.spinner.show();
        const emp_data = JSON.parse(StorageManagerService.getUser());
        this.expenseservice.getClaimsSelf(emp_data.id).subscribe(
            (res) => {
                this.spinner.hide();
                this.expense_data = res;
                for (let i = 0; i < this.expense_data.length; i++) {
                    if (this.expense_data[i]['emp_id']) {
                        this.expense_data[i]['category_name'] = this.expense_data[i]['category_id']['name'];
                        this.expense_data[i]['emp_name'] = this.expense_data[i]['emp_id']['firstname'] + ' '
                            + this.expense_data[i]['emp_id']['lastname'];
                        this.expense_data[i].bill_date = moment(this.expense_data[i].bill_date.date).format('MMM D Y');
                    }
                }
            }
        );
    }

    getAllExpense = () => {
        // this.spinner.show();
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
                dataTablesParameters.columns[5].search.value = this.filterForm.get('status').value;
                this.datatableService.getTableData(dataTablesParameters, 'datatable/get_all_claims').subscribe(resp => {
                    this.allcheck_id = false;
                    this.expense_data = resp.data['data'];
                    this.pending_count = resp.data['count'];
                    this.dashboardService.pendingClaims.next({ 'count': this.pending_count });
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
            { name: 'title' },
            { name: 'name' },
            { name: 'amount' },
            { name: 'status', searchable: false }]
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
    // this.expenseservice.getAllClaimExpense().subscribe(res => {
    //     this.spinner.hide();
    //     this.expense_data = res.data;
    //     for (let i = 0; i < this.expense_data.length; i++) {
    //         if (this.expense_data[i]['emp_id']) {
    //             this.expense_data[i]['category_name'] = this.expense_data[i]['category_id']['name'];
    //             this.expense_data[i]['emp_name'] = this.expense_data[i]['emp_id']['firstname'] + ' '
    //                 + this.expense_data[i]['emp_id']['lastname'];
    //             this.expense_data[i].bill_date = moment(this.expense_data[i].bill_date.date).format('MMM D Y');
    //         }
    //     }
    // });


    openProfile(id) {
        this.router.navigate(['/self/profile/' + id]);
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
        // setTimeout(() => {
        for (let i = 0; i < this.expense_data.length; i++) {
            if (+id === +this.expense_data[i]['id']) {
                this.expense_data[i]['isSelected'] = !this.expense_data[i]['isSelected'];
                if (this.expense_data[i]['isSelected']) {
                    this.expense_status = this.expense_data[i]['status'];
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
        // }, 100);
    }
    // checkone(id) {
    //     this.allcheck_id = false;
    //     let selectId: any = '';
    //     this.allcheck_id_count = 0;
    //     this.expensedetail = [];
    //     setTimeout(() => {
    //         for (let i = 0; i < this.expense_data.length; i++) {
    //             if (this.expense_data[i]['isSelected']) {
    //                 this.expense_status = this.expense_data[i]['status'];
    //                 this.allcheck_id_count++;
    //                 selectId = this.expense_data[i];
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
                if (this.selfUrl) {
                    this.router.navigate(['/self/expense/expense-claims/edit/' + this.expense_edit[i].id]);
                } else {
                    this.router.navigate(['/expense/expense-claims/edit/' + this.expense_edit[i].id]);
                }
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

    SaveExpense = () => {
        this.expense = this.expenseForm.value;
        this.expenseservice.saveExpense(this.expense).subscribe(res => {
            if (res === 'Expense Add succesfully') {
                this.closeModel();
                this.flashMessageService.pop('success', 'Expense Add SuccesFully', 'Expense Add');
            }
        });
    }

    approveclaim = () => {
        this.expense_edit = [];
        this.expense_edit = this.expense_data;
        for (let i = 0; i < this.expense_edit.length; i++) {
            if (this.expense_edit[i]['isSelected']) {
                this.expenseservice.approveclaim(this.expense_edit[i]['id'], this.userData.id).subscribe(res => {
                    if (res = 'Approve Claim succesfully') {
                        this.allcheck_id_count = 0;
                        // this.getAllExpense();
                        this.rerender();
                        this.flashMessageService.pop('success', 'Approved', 'Claim Approved Succesfully');
                    }
                });
            }
        }
    }

    rejectclaim = () => {
        this.expense_edit = [];
        this.expense_edit = this.expense_data;
        for (let i = 0; i < this.expense_edit.length; i++) {
            if (this.expense_edit[i]['isSelected']) {
                this.expenseservice.rejectclaim(this.expense_edit[i]['id'], this.userData.id).subscribe(res => {
                    if (res = 'Reject Claim succesfully') {
                        this.allcheck_id_count = 0;
                        // this.getAllExpense();
                        this.rerender();
                        this.flashMessageService.pop('error', 'Rejected', 'Claim Rejected Succesfully');
                    }
                });
            }
        }
    }

    deleteExpense = () => {
        this.expense_edit = [];
        this.expense_edit = this.expense_data;
        this.expenseservice.deleteExpense(this.expense_edit).subscribe((responseData: any) => {
            if (responseData.response === 'success') {
                this.closeModel();
                this.allcheck_id_count = 0;
                this.flashMessageService.pop('error', 'Expense Claim Deleted', 'Deleted Succesfully');
                this.rerender();
                if (this.selfUrl) {
                    this.getSelfExpense();
                } else {
                    this.getAllExpense();
                }
            }
        });
    }

    openModel = (template) => {
        this.modalRef = this.modalService.show(template, { class: 'center-modal' });
    }

    closeModel = () => {
        this.modalRef.hide();
    }
}
