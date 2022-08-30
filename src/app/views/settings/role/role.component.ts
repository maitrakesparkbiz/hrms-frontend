import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray } from '@angular/forms';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { RoleService } from '../../../shared/services/role.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatatableService } from '../../../shared/services/datatable.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
@Component({
    templateUrl: 'role.component.html',
    styleUrls: ['./role.component.scss']
})

export class RoleComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    public btnstatus = false;
    allcheck_id;
    allcheck_id_count: any = 0;
    dept_edit;
    roledetail: any = [];
    @ViewChild('primaryModel') public primaryModel: ModalDirective;
    data: any = [];
    public dept;
    permissionDetail: any = {};
    modalRef: BsModalRef;
    deleteAllowed = false;
    public addsub = new FormArray([]);
    public editdept = new FormArray([]);

    constructor(
        public router: Router, private modalService: BsModalService,
        public roleservice: RoleService,
        public flashMessageService: FlashMessageService,
        private spinner: NgxSpinnerService,
        private datatableService: DatatableService
    ) {
    }

    ngOnInit() {
        // let addsub = new FormArray([]);
        this.getRoles_Permission();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    getRoles_Permission = () => {
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllRolesDatatable').subscribe(resp => {
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
            { name: 'description' },
            { name: 'employees' }]
        };
    }

    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    // getRoles_Permission() {
    //     this.roleservice.getRole().subscribe((res: any) => {
    //         this.dept = res.data;
    //     });
    // }

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
        this.allcheck_id_count = 0;
        let selectId = '';
        this.roledetail = {};
        for (let i = 0; i < this.dept.length; i++) {
            if (+this.dept[i]['id'] === +id) {
                this.dept[i]['isSelected'] = !this.dept[i]['isSelected'];
                if (this.dept[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selectId = this.dept[i];
                }
            } else {
                this.dept[i]['isSelected'] = false;
            }
        }
        if (this.allcheck_id_count === 1) {
            if (+selectId['employees'] === 0) {
                this.deleteAllowed = true;
            } else {
                this.deleteAllowed = false;
            }
            this.getdetail(selectId['id']);
        }
        // console.log(this.dept);
    }

    getdetail = (id) => {
        this.spinner.show();
        this.roleservice.rolePermissions(id).subscribe(
            (res) => {
                this.roledetail = res;
                this.spinner.hide();
            }
        );
    }

    capitalizeString = (value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    closeModel = () => {
        this.modalRef.hide();
    }
    deleteModel = (template) =>{
        this.modalRef = this.modalService.show(template);
    }
    EditRole = () => {
        this.dept_edit = [];
        this.dept_edit = this.dept;
        for (let i = 0; i < this.dept.length; i++) {
            if (this.dept_edit[i]['isSelected']) {
                this.router.navigate(['/settings/role/edit-role/' + this.dept_edit[i].id]);
            }
        }
    }
    deleteRecord = () => {
        this.dept_edit = this.dept;
        this.closeModel();
        this.roleservice.deleteRole(this.dept_edit).subscribe((responseData: any) => {
            if (responseData.response === 'success') {
                this.roledetail = [];
                this.allcheck_id_count = 0;
                this.flashMessageService.pop('error', 'Role Deleted Succesfully', 'Deleted Succesfully');
                this.rerender();
            }
        });
    }
}



