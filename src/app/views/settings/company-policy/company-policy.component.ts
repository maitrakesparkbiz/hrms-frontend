import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { FlashMessageService } from "../../../shared/services/flash-message.service";
import { DatatableService } from "../../../shared/services/datatable.service";
import { AppConstants } from "../../../constants/app.constants";
import { CompanyPolicyService } from "../../../shared/services/company-policy.service";


@Component({
    templateUrl: './company-policy.component.html',
    styleUrls: ['./company-policy.component.scss']
})

export class CompanyPolicyComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    FILE_URL = AppConstants.FILE_URL;
    search;
    allcheck_id;
    allcheck_id_count = 0;
    policyData: any = [];
    modalRef: BsModalRef;
    selectedPolicy: any = [];
    constructor(
        private router: Router,
        private modalService: BsModalService,
        private msgService: FlashMessageService,
        private datatableService: DatatableService,
        private cpService: CompanyPolicyService) {
    }

    ngOnInit() {
        this.getAllPolicy();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    getAllPolicy = () => {
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllCompanyPolicyDatatable').subscribe(resp => {
                    this.allcheck_id = false;
                    this.allcheck_id_count = 0;
                    this.policyData = resp.data;
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
            { name: 'policy_doc' },
            { name: 'created_at' },
            { name: 'status', orderable: false, searchable: false }]
        };
    }

    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    checkone = (id) => {
        this.allcheck_id = false;
        this.selectedPolicy = [];
        this.allcheck_id_count = 0;
        for (let i = 0; i < this.policyData.length; i++) {
            if (+this.policyData[i]['id'] === +id) {
                this.policyData[i]['isSelected'] = !this.policyData[i]['isSelected'];
                if (this.policyData[i]['isSelected']) {
                    this.allcheck_id_count++;
                    this.selectedPolicy = this.policyData[i];
                }
            } else {
                this.policyData[i]['isSelected'] = false;
            }
        }
    }

    addPolicy = () => {
        this.router.navigate(['settings/company-policy/add']);
    }

    editPolicy = () => {
        this.router.navigate(['settings/company-policy/edit/' + this.selectedPolicy['id']]);
    }

    openModel = (template) => {
        this.modalRef = this.modalService.show(template);
    }

    deleteCompanyPolicy = () => {
        this.closeModel();
        this.cpService.deletePolicy(this.selectedPolicy['id']).subscribe(
            (res) => {
                if (res == "success") {
                    this.msgService.pop("error", 'Policy Deleted', 'Policy Deleted Successfully');
                    this.rerender();
                }
            }
        )
    }

    closeModel = () => {
        this.selectedPolicy = [];
        this.modalRef.hide();
    }
}