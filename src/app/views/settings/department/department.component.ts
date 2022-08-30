import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { DepartmentService } from '../../../shared/services/department.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../../shared/services/datatable.service';
@Component({
    templateUrl: 'department.component.html',
    styleUrls: ['./department.component.scss']

})
export class DepartmentComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    public invoiceForm: FormGroup;
    editForm: FormGroup;
    search;
    public btnstatus = false;
    allcheck_id;
    allcheck_id_count = 0;
    selected;
    dept_edit;
    delete_allowed = false;
    @ViewChild('primaryModel') public primaryModel: ModalDirective;
    department: any = {};
    data: any = [];
    public dept;
    public deletedep;
    modalRef: BsModalRef;
    public addsub = new FormArray([]);
    public editdept = new FormArray([]);

    constructor(
        public router: Router, private modalService: BsModalService, public departmentservice: DepartmentService,
        public flashMessageService: FlashMessageService, private spinner: NgxSpinnerService, private datatableService: DatatableService
    ) {
    }


    ngOnInit() {
        // let addsub = new FormArray([]);
        this.invoiceForm = new FormGroup({
            'dep_name': new FormControl(null, Validators.required),
            'addsub': this.addsub
        });
        this.editForm = new FormGroup({
            'editdept': this.editdept
        });
        // this.getDepartments();
        this.SetDeptToStorage();
        this.getSetDeptToStorage();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    // getDepartments() {
    //     this.spinner.show();
    //     this.dept = StorageManagerService.getDepartment();
    //     if (this.dept == null) {
    //         this.getSetDeptToStorage();
    //     }
    //     this.spinner.hide();
    // }

    // getSetDeptToStorage() {
    //     this.spinner.show();
    //     this.departmentservice.getDepartments().subscribe(res => {
    //         this.dept = res.data;
    //         StorageManagerService.storeDepartment(this.dept);
    //         this.spinner.hide();
    //     });
    // }

    SetDeptToStorage = () => {
        this.departmentservice.getDepartments().subscribe(res => {
            StorageManagerService.storeDepartment(res.data);
        });
    }

    getSetDeptToStorage = () => {
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllDeptDatatable').subscribe(resp => {
                    this.allcheck_id = false;
                    this.allcheck_id_count = 0;
                    this.dept = resp.data;
                    this.SetDeptToStorage();
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
            { name: 'employees' }]
        };
    }


    rerender = (): void => {
        this.SetDeptToStorage();
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
            })
        );
    }

    deleteSubRow = (index: number) => {
        const control = <FormArray>this.invoiceForm.controls['addsub'];
        control.removeAt(index);
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
        this.selected = [];
        this.allcheck_id_count = 0;
        let tempCount = 0;
        // setTimeout(() => {
        for (let i = 0; i < this.dept.length; i++) {
            if (+id === +this.dept[i]['id']) {
                this.dept[i]['isSelected'] = !this.dept[i]['isSelected'];
                if (this.dept[i]['isSelected']) {
                    this.allcheck_id_count++;
                    this.selected = this.dept[i];
                }
            }else {
                if (this.dept[i]['isSelected']) {
                    this.selected = this.dept[i];
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
        if (this.allcheck_id_count === 1) {
            if (+this.selected['employees'] === 0) {
                this.delete_allowed = true;
            } else {
                this.delete_allowed = false;
            }
        }
        // }, 100);
    }

    // checkone(id) {
    //     this.allcheck_id = false;
    //     this.allcheck_id_count = 0;
    //     this.selected = [];
    //     setTimeout(() => {
    //         for (let i = 0; i < this.dept.length; i++) {
    //             // if (this.dept[i]['id'] === id) {
    //             if (this.dept[i]['isSelected']) {
    //                 this.allcheck_id_count++;
    //                 this.selected = this.dept[i];
    //             }
    //             // }
    //         }
    //
    //         if (this.allcheck_id_count === 1) {
    //             if (+this.selected['employees'] === 0) {
    //                 this.delete_allowed = true;
    //             } else {
    //                 this.delete_allowed = false;
    //             }
    //         }
    //     }, 10);
    // }

    openModal = (template: TemplateRef<any>) =>{
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
    SaveDepartment = () => {
        this.allcheck_id_count = 0;
        this.data = this.invoiceForm.value;
        const dep_name = this.data['dep_name'];
        this.data['addsub'].push({ 'name': dep_name });
        this.department = this.data['addsub'];
        this.closeModel();
        this.departmentservice.saveDepartment(this.department).subscribe((responseData: any) => {
            if (responseData.response === 'success') {
                this.allcheck_id_count = 0;
                this.flashMessageService.pop('success', 'Department', 'Added Succesfully');
                this.rerender();
            }
        });
    }

    deletedepartment = () => {
        this.allcheck_id_count = 0;
        this.dept_edit = this.dept;
        this.closeModel();
        this.departmentservice.deletedepartment(this.dept_edit).subscribe((responseData: any) => {
            if (responseData.response === 'success') {
                this.allcheck_id_count = 0;
                this.flashMessageService.pop('error', 'Department', 'Deleted Succesfully');
                this.rerender();
            }
        });
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
                        'name': new FormControl(this.dept_edit[i]['name'])
                    })
                );
            }
        }
        this.modalRef = this.modalService.show(template);

    }
    editdepartment = () => {
        this.department = this.editForm.value;
        this.closeModel();
        this.departmentservice.saveDepartment(this.department['editdept']).subscribe((responseData: any) => {
            if (responseData.response === 'success') {
                this.flashMessageService.pop('success', 'Department', 'Updated Succesfully');
                this.allcheck_id_count = 0;
                this.rerender();
            }
        });
    }
}



