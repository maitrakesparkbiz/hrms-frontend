import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild, TemplateRef} from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { AppConstants } from "../../../constants/app.constants";
import { Router } from "@angular/router";
import { DatatableService } from "../../../shared/services/datatable.service";
import { TeamService } from "../../../shared/services/team.service";
import { UserService } from "../../../shared/services/user.service";
import { EmailTemplateService } from "../../../shared/services/email-template.service";
import { FlashMessageService } from "../../../shared/services/flash-message.service";

@Component({
    templateUrl: './letter-template.component.html',
    styleUrls: ['./letter-template.component.scss']
})

export class LetterTemplateComponent implements OnInit, AfterViewInit, OnDestroy {
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
    modalRef: BsModalRef;
    userLeaves: any = [];
    appreciation_edit;
    constructor(
        public router: Router,
        private flashMessageService: FlashMessageService,
        private datatableService: DatatableService,
        private teamService: TeamService,
        private modalService: BsModalService,
        private templateService: EmailTemplateService,
        private userService: UserService) {

    }

    ngOnInit() {
        this.getLetterTemplate();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }


    getLetterTemplate = () => {
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
                this.datatableService.getLetterTemplate(dataTablesParameters, 'datatable/getAllEmailTemplateDataTable').subscribe(resp => {
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
            columns: [
                { name: 'id', orderable: false },
                { name: 'template_name' }]
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
        let tempCount = 0;
        for (let i = 0; i < this.allTeams.length; i++) {
            if (+id === +this.allTeams[i]['id']) {
                this.allTeams[i]['isSelected'] = !this.allTeams[i]['isSelected'];
                if (this.allTeams[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selectId = this.allTeams[i];
                }
            } else {
                this.allTeams[i]['isSelected'] = false;
            }
            if (this.allTeams[i]['isSelected']) {
                tempCount++;
            }
        }
        if (tempCount === this.allTeams.length) {
            this.allcheck_id = true;
        }

    }


    EditTemplate = () => {
        this.appreciation_edit = [];
        this.appreciation_edit = this.allTeams;
        for (let i = 0; i < this.allTeams.length; i++) {
            if (this.appreciation_edit[i]['isSelected']) {
                this.router.navigate(['/letters/template/update/' + this.appreciation_edit[i].id]);
            }
        }
    }
    deleteExpense = () => {
        this.appreciation_edit = [];
        this.appreciation_edit = this.allTeams;
        this.closeModel();
        this.templateService.deleteTemplate(this.appreciation_edit).subscribe((responseData: any) => {
            if (responseData.response === 'success') {
                this.allcheck_id_count = 0;
                this.flashMessageService.pop('error', 'Template Deleted', 'Deleted Succesfully');
                this.rerender();
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