import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { DatatableService } from '../../../shared/services/datatable.service';
import { TeamService } from '../../../shared/services/team.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AppConstants } from '../../../constants/app.constants';
import { UserService } from '../../../shared/services/user.service';
import { Router } from "@angular/router";


@Component({
    selector: 'app-self-team',
    templateUrl: 'self-team.component.html',
    styleUrls: ['./self-team.component.scss']
})

export class SelfTeamComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    allcheck_id;
    team_edit;
    allcheck_id_count: any = 0;
    allTeams: any = [];
    selectedTeam: any = [];
    IMAGE_URL = AppConstants.IMAGE_URL;
    employee_image = '../../../../assets/img/avatars/profile_image.jpg';
    userAttn: any = [];
    userLeaves: any = [];
    constructor(
        public router: Router,
        private datatableService: DatatableService,
        private teamService: TeamService,
        private userService: UserService) {

    }

    ngOnInit() {
        this.getSelfTeams();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    getSelfTeams = () => {
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getSelfTeamData').subscribe(resp => {
                    this.allcheck_id = false;
                    this.allcheck_id_count = 0;
                    this.allTeams = resp.data;
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
            { name: 'name' }]
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
        let selectId = '';
        this.allcheck_id_count = 0;
        // let tempCount = 0;
        for (let i = 0; i < this.allTeams.length; i++) {
            if (+id === +this.allTeams[i]['id']) {
                this.allTeams[i]['isSelected'] = !this.allTeams[i]['isSelected'];
                if (this.allTeams[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selectId = this.allTeams[i];
                }
            } else {
                this.allTeams[i]['isSelected'] = false;
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
            this.getMemberData(selectId['emp_id']);
        }
    }

    // checkone(id) {
    //     this.allcheck_id = false;
    //     let selectId = [];
    //     this.allcheck_id_count = 0;
    //     setTimeout(() => {
    //         for (let i = 0; i < this.allTeams.length; i++) {
    //             if (+this.allTeams[i]['id'] === +id) {
    //                 if (this.allTeams[i]['isSelected']) {
    //                     this.allcheck_id_count++;
    //                     selectId = this.allTeams[i];
    //                 }
    //             } else {
    //                 this.allTeams[i]['isSelected'] = false;
    //             }
    //         }
    //         if (this.allcheck_id_count === 1) {
    //             this.getMemberData(selectId['emp_id']);
    //         }
    //     }, 100);
    // }

    getMemberData = (emp_id) => {
        this.userService.getMemberData(emp_id).subscribe(
            (res) => {
                this.userAttn = res['attn'];
                this.userLeaves = res['leaves'];
            }
        );
    }

    EditTeam = () => {
        this.team_edit = [];
        this.team_edit = this.allTeams;

        for (let i = 0; i < this.team_edit.length; i++) {
            if (this.team_edit[i]['isSelected']) {
                this.router.navigate(['/self/team/edit/' + this.team_edit[i].emp_id]);
            }
        }
    }
}

