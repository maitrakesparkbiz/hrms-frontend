import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { DesignationService } from '../../../shared/services/designation.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { DepartmentService } from '../../../shared/services/department.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../../shared/services/datatable.service';

@Component({
    templateUrl: 'designation.component.html',
    styleUrls: ['./designation.component.scss']
})

export class DesignationComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    public invoiceForm: FormGroup;
    editForm: FormGroup;
    public btnstatus = false;
    search;
    allcheck_id;
    allcheck_id_count = 0;
    selected;
    delete_allowed;
    dept_edit;
    @ViewChild('primaryModel') public primaryModel: ModalDirective;
    department: any = {};
    data: any = [];
    public dept;
    modalRef: BsModalRef;
    depOpt: any = [];
    errorMsg = '';
    public addsub = new FormArray([]);
    public editdept = new FormArray([]);

    constructor(public departmentservice: DepartmentService,
        public router: Router, private modalService: BsModalService, public designationservice: DesignationService,
        private flashMessageService: FlashMessageService, private spinner: NgxSpinnerService, private datatableService: DatatableService
    ) {
    }

    ngOnInit() {
        // let addsub = new FormArray([]);
        this.invoiceForm = new FormGroup({
            'dep_id': new FormControl(null, Validators.required),
            'dep_name': new FormControl(null, Validators.required),
            'addsub': this.addsub
        });
        this.editForm = new FormGroup({
            'editdept': this.editdept
        });
        this.setDesToStorage();
        this.getSetDeptOpt();
        this.getDesignation();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    getSetDeptOpt = () => {
        const dept = StorageManagerService.getDepartment();
        if (!dept) {
            this.departmentservice.getDepartments().subscribe(res => {
                this.depOpt = res.data;
                StorageManagerService.storeDepartment(this.depOpt);
            });
        } else {
            this.depOpt = dept;
        }
    }

    // getDesignation() {
    //     this.spinner.show();
    //     this.designationservice.getDesignation().subscribe(res => {
    //         this.dept = res.data;
    //         StorageManagerService.storeDesignation(this.dept);
    //         this.spinner.hide();
    //     });
    // }

    setDesToStorage = () => {
        this.designationservice.getDesignation().subscribe(res => {
            StorageManagerService.storeDesignation(res.data);
        });
    }

    getDesignation = () => {
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllDesDatatable').subscribe(resp => {
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
            { name: 'dep_name' },
            { name: 'name' },
            { name: 'employees' }]
        };
    }

    rerender = (): void => {
        this.setDesToStorage();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    getSetDesToStorage = () => {
        this.designationservice.getDesignation().subscribe(res => {
            this.dept = res.data;
            StorageManagerService.storeDesignation(this.dept);
        });
    }

    AddDepartment = () => {
        this.btnstatus = false;
        (<FormArray>this.invoiceForm.get('addsub')).push(
            new FormGroup({
                'dep_id': new FormControl(null, Validators.required),
                'name': new FormControl(null, Validators.required),
            })
        );
    }

    deleteSubRow = (index: number) => {
        const control = <FormArray>this.invoiceForm.controls['addsub'];
        control.removeAt(index);
    }


    deletedesignation = () => {
        this.allcheck_id_count = 0;
        this.dept_edit = this.dept;
        this.closeModel();
        this.designationservice.deleteDesignation(this.dept_edit).subscribe((responseData: any) => {
            if (responseData.response === 'success') {
                this.flashMessageService.pop('error', 'Designation', 'Deleted Succesfully');
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

    // checkone(id) {
    //     this.allcheck_id = false;
    //     for (var i = 0; i < this.dept.length; i++) {
    //         if (this.dept[i]['id'] == id) {
    //             if (!this.dept[i]['isSelected']) {
    //                 this.allcheck_id_count++;
    //             }
    //             else {
    //                 this.allcheck_id_count--;
    //             }

    //         }
    //     }
    // }

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
            } else {
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

    openModal = (template: TemplateRef<any>) => {
        this.modalRef = this.modalService.show(template);
        this.btnstatus = true;
    }

    closeModel = () => {
        this.modalRef.hide();
        this.errorMsg = '';
        while (this.addsub.length !== 0) {
            this.addsub.removeAt(0);
        }
        this.invoiceForm.reset();
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
                        'dep_id': new FormControl(this.dept_edit[i]['dep_id']),
                        'name': new FormControl(this.dept_edit[i]['name']),
                    })
                );
            }
        }
        this.modalRef = this.modalService.show(template);
    }


    SaveDesignation = () => {
        this.allcheck_id_count = 0;
        this.data = {};
        this.data = this.invoiceForm.value;
        const dep_name = this.data['dep_name'];
        // this.data['addsub'].push({ 'dep_id': this.data['dep_id'], 'name': dep_name });
        this.department = [{ 'dep_id': this.data['dep_id'], 'name': dep_name }];
        for (const row of this.data['addsub']) {
            this.department.push(row);
        }

        if (this.checkDuplicate(this.department)) {
            this.errorMsg = 'Input contains duplicate values';
        } else {
            this.errorMsg = '';
            this.closeModel();
            this.designationservice.saveDesignation(this.department).subscribe((responseData: any) => {
                if (responseData.response === 'success') {
                    this.allcheck_id_count = 0;
                    this.flashMessageService.pop('success', 'Designation', 'Added Succesfully');
                    this.rerender();
                }
            });
        }
    }

    editdesignation = () => {
        this.department = {};
        this.department = this.editForm.value;
        if (this.checkDuplicate(this.department.editdept, 'edit')) {
            this.errorMsg = 'Input contains duplicate values';
        } else {
            this.errorMsg = '';
            this.closeModel();
            this.designationservice.saveDesignation(this.department['editdept']).subscribe((responseData: any) => {
                if (responseData.response === 'success') {
                    this.allcheck_id_count = 0;
                    this.flashMessageService.pop('success', 'Designation', 'Updated Succesfully');
                    this.rerender();
                }
            });
        }
    }

    checkDuplicate = (inputArr, mode = '') => {
        let flag = false;
        inputArr.map((item, key) => {
            const dep_id = item.dep_id;
            const name = item.name;
            inputArr.map((item2, key2) => {
                if (item2.dep_id === dep_id && key2 !== key) {
                    if (item2.name === name) {
                        flag = true;
                        return flag;
                    }
                }
            });

            if (mode === 'edit') {
                this.dept.map((item3) => {
                    if (+item3.dep_id === +dep_id && item3.id !== item.id) {
                        if (item3.name === name) {
                            flag = true;
                            return flag;
                        }
                    }
                });
            } else {
                this.dept.map((item3) => {
                    if (+item3.dep_id === +dep_id) {
                        if (item3.name === name) {
                            flag = true;
                            return flag;
                        }
                    }
                });
            }
        });
        return flag;
    }

    onInputChange = () => {
        this.errorMsg = '';
    }
}



