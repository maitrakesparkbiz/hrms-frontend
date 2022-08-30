import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { AppConstants } from "../../../../constants/app.constants";
import { DatatableService } from "../../../../shared/services/datatable.service";
import { CompanyProjectService } from "../../../../shared/services/company-project.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { PusherService } from "../../../../shared/services/pusher.sevice";
import { FlashMessageService } from "../../../../shared/services/flash-message.service";

@Component({
    selector: 'app-ba-tl-projects',
    templateUrl: './ba-tl-projects.component.html',
    styleUrls: ['./ba-tl-projects.component.scss']
})

export class BaTlProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    allcheck_id_count = 0;
    allProjects: any = [];
    projectDetails: any = [];
    jrBAs: any = [];
    FILE_URL = AppConstants.FILE_URL;
    IMAGE_URL = AppConstants.IMAGE_URL;
    modalRef: BsModalRef;
    actionType = '';
    promptMsg = '';
    employee_image = '../../../../assets/img/avatars/profile_image.jpg';

    constructor(private datatableService: DatatableService,
        private companyProjectService: CompanyProjectService,
        private modalService: BsModalService,
        private pusherService: PusherService,
        private msgService: FlashMessageService) {
    }

    ngOnInit() {
        this.getAllProjects();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    getAllProjects = () => {
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllProjectsDatatableBaTl').subscribe(resp => {
                    this.allcheck_id_count = 0;
                    this.allProjects = resp.data;
                    this.allProjects.forEach(row => {
                        if (row['project_doc']) {
                            row['project_doc'] = row['project_doc'].split(',');
                        } else {
                            row['project_doc'] = [];
                        }
                    });
                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: []
                    });
                });
            },
            order: [],
            columns: [{ name: 'id', orderable: false },
            { name: 'project_name' },
            { name: 'created_at' },
            { name: 'firstname' },
            { name: 'est_time' },
            { name: 'flag', orderable: false }]
        };
    }

    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    checkone = (id) => {
        let selectId: any = '';
        this.allcheck_id_count = 0;
        this.projectDetails = [];
        for (let i = 0; i < this.allProjects.length; i++) {
            if (+this.allProjects[i]['id'] === +id) {
                this.allProjects[i]['isSelected'] = !this.allProjects[i]['isSelected'];
                if (this.allProjects[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selectId = this.allProjects[i];
                }
            } else {
                this.allProjects[i]['isSelected'] = false;
            }
        }
        if (this.allcheck_id_count === 1) {
            this.projectDetails = selectId;
            // console.log(this.projectDetails);
            this.getProjectDataBaTl(selectId['id']);
        }
    }

    getProjectDataBaTl = (id) => {
        this.companyProjectService.getProjectDataBaTl(id).subscribe(
            (res) => {
                this.jrBAs = res;
            }
        )
    }

    openModel = (template, eventName) => {
        this.actionType = eventName;
        if (eventName == 'project_started') {
            this.promptMsg = 'Are you sure you want to start this project?';
        } else if (eventName == 'project_closed') {
            this.promptMsg = 'Are you sure you want to close this project?';
        } else {
            this.promptMsg = 'Are you sure you want to reopen this project?';
        }
        this.modalRef = this.modalService.show(template);
    }

    closeModel = () => {
        this.modalRef.hide();
    }

    projectAction = () => {
        this.closeModel();
        this.companyProjectService.projectAction(this.actionType, this.projectDetails.id).subscribe(
            (res: any) => {
                if (res.status == 'success') {
                    this.msgService.pop('success', this.actionType, this.actionType + ' Successfully');
                    if (res.data) {
                        this.rerender();
                        this.sendNotifications(res.data);
                    }
                }
            }
        )
    }

    sendNotifications = (data) => {
        this.pusherService.sendNotifications(data).subscribe((res) => {
            if (res !== 'success') {
                this.msgService.pop('danger', 'Error', 'Error Occured While Sending Notification');
            }
        });
    }
}
