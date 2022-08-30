import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { DatatableService } from '../../../shared/services/datatable.service';
import { TeamService } from '../../../shared/services/team.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AppConstants } from '../../../constants/app.constants';
import { UserService } from '../../../shared/services/user.service';
import { Router } from "@angular/router";


@Component({
    selector: 'app-self-company-policy',
    templateUrl: 'self-company-policy.component.html',
    styleUrls: ['./self-company-policy.component.scss']
})

export class SelfCompanyPolicyComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    allcheck_id;
    team_edit;
    allcheck_id_count: any = 0;
    allTeams: any = [];
    userAttn: any = [];
    userLeaves: any = [];

    FILE_URL = AppConstants.FILE_URL;

    selectedPolicy: any = [];
    policyData: any = [];
    policyDetails;
    constructor(
        public router: Router,
        private datatableService: DatatableService,
        private teamService: TeamService,
        private userService: UserService) {

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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllCompanyPolicySelfDatatable').subscribe(resp => {
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
            { name: 'created_at' },
            { name: 'policy_doc', orderable: false }]
        };
    }

    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }


    checkboxHeader = (evt: Event) => {
        this.allcheck_id_count = 0;
        if (this.allcheck_id !== true) {
            for (let i = 0; i < this.allTeams.length; i++) {
                this.allTeams[i]['isSelected'] = true;
                this.allcheck_id_count++;
            }
        } else {
            for (let i = 0; i < this.allTeams.length; i++) {
                this.allTeams[i]['isSelected'] = false;
            }
        }
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
        if (this.allcheck_id_count === 1) {
            this.getPolicyById(this.selectedPolicy);
        }
    }
    getPolicyById = (expense) => {
        this.policyDetails = expense;
    }
}

