import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { AwardService } from '../../../shared/services/award.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../../shared/services/datatable.service';
@Component({
    templateUrl: 'award.component.html',
    styleUrls: ['./award.component.scss']

})
export class AwardComponent implements OnInit, AfterViewInit, OnDestroy {
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
    selected_assigned_emp = 0;
    public addsub = new FormArray([]);
    public editdept = new FormArray([]);

    constructor(
        public router: Router, private modalService: BsModalService, public awardservice: AwardService,
        public flashMessageService: FlashMessageService,
        private spinner: NgxSpinnerService,
        private datatableService: DatatableService
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
        this.getAwards();
    }


    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    // getAwards() {
    //     this.spinner.show();
    //     this.awardservice.getAwards().subscribe((res: any) => {
    //         this.dept = res.data;
    //         this.spinner.hide();
    //     });
    // }

    getAwards = () => {
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllAwardDatatable').subscribe(resp => {
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
            { name: 'assigned_awards' },
            { name: 'status' }]
        };
    }

    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    EditAward = () => {
        this.allcheck_id_count = 0;
        this.dept_edit = [];
        this.dept_edit = this.dept;
        for (let i = 0; i < this.dept.length; i++) {
            if (this.dept_edit[i]['isSelected']) {
                this.router.navigate(['/settings/award/edit-award/' + this.dept_edit[i].id]);
            }
        }
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
        this.allcheck_id_count = 0;
        let tempCount = 0;
        // setTimeout(() => {
        for (let i = 0; i < this.dept.length; i++) {
            if (+id === +this.dept[i]['id']) {
                this.dept[i]['isSelected'] = !this.dept[i]['isSelected'];
                if (this.dept[i]['isSelected']) {
                    this.allcheck_id_count++;
                    this.selected_assigned_emp = this.dept[i];
                }
            }else {
                if (this.dept[i]['isSelected']) {
                    this.selected_assigned_emp = this.dept[i];
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
    //     this.allcheck_id_count = 0;
    //     for (let i = 0; i < this.dept.length; i++) {
    //         if (this.dept[i]['id'] === id) {
    //             if (!this.dept[i]['isSelected']) {
    //                 this.allcheck_id_count++;
    //                 this.selected_assigned_emp = +this.dept[i]['assigned_awards'];
    //             }
    //         } else {
    //             this.dept[i]['isSelected'] = false;
    //         }
    //     }
    // }


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
    deleteaward = () => {
        this.allcheck_id_count = 0;
        this.dept_edit = this.dept;
        this.closeModel();
        this.awardservice.deleteAward(this.dept_edit).subscribe((responseData: any) => {
            if (responseData.response === 'success') {
                this.flashMessageService.pop('error', 'Award Deleted Succesfully', 'Deleted Succesfully');
                this.rerender();
            }
        });
    }
}



