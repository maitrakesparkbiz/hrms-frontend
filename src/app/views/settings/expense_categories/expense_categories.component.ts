import { Component, OnInit, TemplateRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { ExpensecategoryService } from '../../../shared/services/expensecategory.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../../shared/services/datatable.service';
@Component({
    templateUrl: 'expense_categories.component.html',
    styleUrls: ['./expense_categories.component.scss']
})
export class ExpenseCategoriesComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    public invoiceForm: FormGroup;
    editForm: FormGroup;
    public btnstatus = false;
    allcheck_id;
    allcheck_id_count = 0;
    dept_edit;
    @ViewChild('primaryModel') public primaryModel: ModalDirective;
    department: any = {};
    data: any = [];
    public dept;
    modalRef: BsModalRef;
    public addsub = new FormArray([]);
    public editdept = new FormArray([]);

    constructor(
        public router: Router, private modalService: BsModalService, public expensecategoryservice: ExpensecategoryService,
        public flashMessageService: FlashMessageService, private spinner: NgxSpinnerService, private datatableService: DatatableService
    ) {
    }


    ngOnInit() {
        // let addsub = new FormArray([]);
        this.invoiceForm = new FormGroup({
            'name': new FormControl(null, Validators.required),
            'description': new FormControl(null, Validators.required),
            'addsub': this.addsub
        });
        this.editForm = new FormGroup({
            'editdept': this.editdept
        });
        this.getExpenseCategories();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    // getExpenseCategories() {
    //     this.spinner.show();
    //     this.expensecategoryservice.getExpenseCategory().subscribe(res => {
    //         this.dept = res.data;
    //         this.spinner.hide();
    //     });
    // }

    getExpenseCategories = () => {
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
            // search: { search: this.leaveForm.get('status').value },
            ajax: (dataTablesParameters: any, callback) => {
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllCatDatatable').subscribe(resp => {
                    this.allcheck_id = false;
                    this.allcheck_id_count = 0;
                    this.dept = resp.data;
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
            { name: 'name' },
            { name: 'description' }]
        };
    }

    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    AddDepartment = () => {
        this.btnstatus = false;
        (<FormArray>this.invoiceForm.get('addsub')).push(
            new FormGroup({
                'name': new FormControl(null, Validators.required),
                'description': new FormControl(null, Validators.required),
            })
        );
    }

    deleteSubRow = (index: number) => {

        const control = <FormArray>this.invoiceForm.controls['addsub'];
        control.removeAt(index);

    }

    SaveExpenseCategory = () => {
        this.allcheck_id_count = 0;
        this.data = this.invoiceForm.value;
        const name = this.data['name'];
        const description = this.data['description'];
        this.data['addsub'].push({ 'name': name, 'description': description });
        this.department = this.data['addsub'];
        this.expensecategoryservice.saveExpenseCategory(this.department).subscribe((responseData: any) => {
            if (responseData.response === 'success') {
                this.closeModel();
                this.allcheck_id_count = 0;
                this.flashMessageService.pop('success', 'Expense Category Added Succesfully', 'Add Succesfully');
                this.rerender();
            }

        });

    }
    editexpensecategory = () => {
        this.allcheck_id_count = 0;
        this.department = this.editForm.value;
        this.expensecategoryservice.saveExpenseCategory(this.department['editdept']).subscribe((responseData: any) => {
            if (responseData.response === 'success') {
                this.closeModel();
                this.flashMessageService.pop('success', 'Expense Category Updated Succesfully', 'Update Succesfully');
                this.rerender();
            }
        });
    }
    deletedesignation = () => {
        this.allcheck_id_count = 0;
        this.dept_edit = this.dept;
        this.expensecategoryservice.deleteExpenseCategory(this.dept_edit).subscribe((responseData: any) => {
            if (responseData.response === 'success') {
                this.closeModel();
                this.flashMessageService.pop('error', 'Expense Category Deleted Succesfully', 'Deleted Succesfully');
                this.rerender();
            }

        });

    }

    checkboxHeader = (evt: Event) => {

        this.allcheck_id_count = 0;
        if (this.allcheck_id !== true) {
            for (let i = 0; i < this.dept.length; i++) {
                this.dept[i]['isSelected'] = true;
                this.allcheck_id_count++;
            }
        } else {
            for (let i = 0; i < this.dept.length; i++) {
                this.dept[i]['isSelected'] = false;

            }
        }
        // console.log(this.dept);
    }

    checkone = (id) => {
        this.allcheck_id = false;
        let selectId = '';
        let selected = [];
        this.allcheck_id_count = 0;
        let tempCount = 0;
        // setTimeout(() => {
        for (let i = 0; i < this.dept.length; i++) {
            if (+id === +this.dept[i]['id']) {
                this.dept[i]['isSelected'] = !this.dept[i]['isSelected'];
                if (this.dept[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selected = this.dept[i];
                }
            } else {
                if (this.dept[i]['isSelected']) {
                    selected = this.dept[i];
                    this.allcheck_id_count++;
                }
            }
            if (this.dept[i]['isSelected']) {
                tempCount++;
            }
        }
        if (tempCount === this.dept.length) {
            this.allcheck_id = true;
        }

        // }, 100);
    }

    // checkone(id) {
    //     this.allcheck_id = false;
    //     for (let i = 0; i < this.dept.length; i++) {
    //         if (this.dept[i]['id'] === id) {
    //             if (!this.dept[i]['isSelected']) {
    //                 this.allcheck_id_count++;
    //             } else {
    //                 this.allcheck_id_count--;
    //             }
    //
    //         }
    //     }
    // }

    openModal = (template: TemplateRef<any>) => {
        this.modalRef = this.modalService.show(template);
        this.btnstatus = true;
    }


    closeModel = () => {
        this.modalRef.hide();
        this.invoiceForm.reset();
        while (this.addsub.length !== 0) {
            this.addsub.removeAt(0);
        }


    }
    deleteModel = (template) => {
        this.modalRef = this.modalService.show(template);
    }
    EditDepartment = (template) => {
        this.editForm.reset();
        while (this.editdept.length !== 0) {
            this.editdept.removeAt(0);
        }

        this.dept_edit = [];
        this.dept_edit = this.dept;
        for (let i = 0; i < this.dept_edit.length; i++) {
            if (this.dept_edit[i]['isSelected']) {
                (<FormArray>this.editForm.get('editdept')).push(
                    new FormGroup({
                        'id': new FormControl(this.dept_edit[i]['id']),
                        'name': new FormControl(this.dept_edit[i]['name']),
                        'description': new FormControl(this.dept_edit[i]['description']),
                    })
                );
            }
        }
        this.modalRef = this.modalService.show(template);

    }
}



