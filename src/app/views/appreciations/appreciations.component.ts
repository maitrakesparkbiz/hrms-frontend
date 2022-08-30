import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserService } from '../../shared/services/user.service';
import { LeaveTypeService } from '../../shared/services/leave_type.service';
import { FlashMessageService } from '../../shared/services/flash-message.service';
import { LeaveapplicationService } from '../../shared/services/leaveapplication.service';
import { AppConstants } from '../../constants/app.constants';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup } from '@angular/forms';
import { AppreciationService } from '../../shared/services/appreciation.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../shared/services/datatable.service';


@Component({
    selector: 'app-appreciation',
    templateUrl: './appreciations.component.html',
    styleUrls: ['./appreciations.component.scss']
})
export class AppreciationsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    modalRef: BsModalRef;
    AllLeaves;
    rejectForm: FormGroup;
    search;
    allcheck_id;
    appreciation;
    appreciation_edit;
    allcheck_id_count: any = 0;
    IMAGE_URL;
    appreciationdetail;
    employee_image;

    constructor(
        public router: Router,
        public userservice: UserService,
        public leavetypeservice: LeaveTypeService,
        private spinner: NgxSpinnerService,
        public appreciationservice: AppreciationService,
        private flashMessageService: FlashMessageService,
        private modalService: BsModalService,
        private datatableService: DatatableService) {
    }

    ngOnInit() {
        this.IMAGE_URL = AppConstants.IMAGE_URL;
        this.employee_image = '../../../assets/img/avatars/profile_image.jpg';
        this.getAppreciation();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    // getAppreciation() {
    //     this.spinner.show();
    //     this.appreciationservice.getAllappreciation().subscribe(res => {
    //         this.appreciation = res['data'];
    //         for (let i = 0; i < this.appreciation.length; i++) {
    //             if (this.appreciation[i]['date']) {
    //                 this.appreciation[i].date = moment(this.appreciation[i].date.date).format('MMM D Y');
    //             }
    //             if (this.appreciation[i]['emp_id']) {
    //                 this.appreciation[i]['profile_image'] = this.appreciation[i]['emp_id']['profile_image'];
    //             }
    //             if (this.appreciation[i]['emp_id']) {
    //                 this.appreciation[i]['emp_id'] = this.appreciation[i]['emp_id']['firstname'] + ' '
    //                     + this.appreciation[i]['emp_id']['lastname'];
    //             }
    //             if (this.appreciation[i]['award_id']) {
    //                 this.appreciation[i]['award_id'] = this.appreciation[i]['award_id']['name'];
    //             }

    //         }
    //         this.spinner.hide();
    //     });
    // }

    getAppreciation = () => {
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllAppreciationDatatable').subscribe(resp => {
                    this.allcheck_id = false;
                    this.allcheck_id_count = 0;
                    this.appreciation = resp.data;
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
            { name: 'firstname' },
            { name: 'date' }]
        };
    }


    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }


    checkboxHeader = (evt: Event = null) => {
        this.allcheck_id_count = 0;
        if (this.allcheck_id !== true) {
            for (let i = 0; i < this.appreciation.length; i++) {
                this.appreciation[i]['isSelected'] = true;
                this.allcheck_id_count++;
            }
        } else {
            for (let i = 0; i < this.appreciation.length; i++) {
                this.appreciation[i]['isSelected'] = false;
            }
        }
    }

    // checkone(id) {
    //     this.allcheck_id = false;
    //     let selectId = '';
    //     this.allcheck_id_count = 0;
    //     this.appreciationdetail = [];
    //     setTimeout(() => {
    //         for (let i = 0; i < this.appreciation.length; i++) {
    //             if (this.appreciation[i]['isSelected']) {
    //                 this.allcheck_id_count++;
    //                 selectId = this.appreciation[i];
    //             }
    //         }
    //         if (this.allcheck_id_count === 1) {
    //             this.getAppreciationDetail(selectId);
    //         }
    //     }, 100);
    // }

    checkone = (id) => {
        this.allcheck_id = false;
        let selectId = '';
        this.allcheck_id_count = 0;
        let tempCount = 0;
        this.appreciationdetail = [];
        for (let i = 0; i < this.appreciation.length; i++) {
            if (+id === +this.appreciation[i]['id']) {
                this.appreciation[i]['isSelected'] = !this.appreciation[i]['isSelected'];
                if (this.appreciation[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selectId = this.appreciation[i];
                }
            } else {
                if (this.appreciation[i]['isSelected']) {
                    selectId = this.appreciation[i];
                    this.allcheck_id_count++;
                }
            }
            if (this.appreciation[i]['isSelected']) {
                tempCount++;
            }
        }
        if (tempCount === this.appreciation.length) {
            this.allcheck_id = true;
        }
        if (this.allcheck_id_count === 1) {
            this.getAppreciationDetail(selectId);
        }
    }

    getAppreciationDetail = (appreciationdetail) => {
        this.appreciationdetail = appreciationdetail;
        if (this.appreciationdetail[0]['prize']) {
            this.appreciationdetail['prize'] = this.appreciationdetail[0]['prize'].split(',');
        }
    }

    EditAppreciation = () => {
        this.appreciation_edit = [];
        this.appreciation_edit = this.appreciation;
        for (let i = 0; i < this.appreciation.length; i++) {
            if (this.appreciation_edit[i]['isSelected']) {
                this.router.navigate(['/appreciation/edit/' + this.appreciation_edit[i].id]);
            }
        }
    }

    DeleteAppreciation = () => {
        this.appreciation_edit = [];
        this.appreciation_edit = this.appreciation;
        this.appreciationservice.deleteAppreciation(this.appreciation_edit).subscribe(res => {
            if (res === 'Deleted Successfully') {
                this.rerender();
                this.closeModel();
                this.flashMessageService.pop('error', 'Appreciation Deleted SuccesFully', 'Delete Appreciation');
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
