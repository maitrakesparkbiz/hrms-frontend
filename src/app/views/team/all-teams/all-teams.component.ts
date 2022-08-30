import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { DatatableService } from '../../../shared/services/datatable.service';
import { AppConstants } from '../../../constants/app.constants';
import { TeamService } from '../../../shared/services/team.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';

@Component({
    selector: 'app-all-teams',
    templateUrl: 'all-teams.component.html',
    styleUrls: ['./all-teams.component.scss']
})

export class AllTeamsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    allcheck_id;
    allcheck_id_count: any = 0;
    modalRef: BsModalRef;
    allTeams: any = [];
    selectedTeam: any = [];
    selectedRow: any = [];
    IMAGE_URL = AppConstants.IMAGE_URL;
    employee_image = '../../../../assets/img/avatars/profile_image.jpg';
    constructor(private modalService: BsModalService,
        private router: Router,
        private datatableService: DatatableService,
        private teamService: TeamService,
        private msgService: FlashMessageService) {

    }

    ngOnInit() {
        this.getAllTeams();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    getAllTeams = () => {
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllTeams').subscribe(resp => {
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
            { name: 'leader' },
            { name: 'members' }]
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
        for (let i = 0; i < this.allTeams.length; i++) {
            if (+this.allTeams[i]['id'] === +id) {
                this.allTeams[i]['isSelected'] = !this.allTeams[i]['isSelected'];
                if (this.allTeams[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selectId = this.allTeams[i];
                    this.selectedRow = this.allTeams[i];
                }
            } else {
                this.allTeams[i]['isSelected'] = false;
            }
        }
        if (this.allcheck_id_count === 1) {
            this.getTeamData(selectId['id']);
        }
    }

    openModel = (template) => {
        this.modalRef = this.modalService.show(template);
    }

    getTeamData = (id) => {
        this.selectedTeam = [];
        this.teamService.getTeamById(id).subscribe(
            (res) => {
                this.selectedTeam = res;
            }
        );
    }

    closeModel = () => {
        this.modalRef.hide();
    }

    deleteTeam = () => {
        this.closeModel();
        this.teamService.deleteTeam(this.selectedTeam.id).subscribe(
            (res) => {
                if (res === 'success') {
                    this.allcheck_id_count = 0;
                    this.rerender();
                    this.msgService.pop('error', 'Team Deleted', 'Team Deleted Successfully');
                }
            }
        );
    }
}
