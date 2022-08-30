import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AppConstants } from '../../../../constants/app.constants';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatatableService } from '../../../../shared/services/datatable.service';
import { ProjectCommentsService } from '../../../../shared/services/project-comments.service';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';


@Component({
    selector: 'app-project-ba-approved',
    templateUrl: './project-ba-approved.component.html',
    styleUrls: ['./project-ba-approved.component.scss']
})

export class ProjectBaApprovedComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    allcheck_id_count = 0;
    allProjects: any = [];
    projectDetails: any = [];
    FILE_URL = AppConstants.FILE_URL;
    IMAGE_URL = AppConstants.IMAGE_URL;
    employee_image = '../../../../assets/img/avatars/profile_image.jpg';
    commentForm: FormGroup;
    userId: any = [];
    allComments: any = [];

    constructor(private datatableService: DatatableService) {

    }

    ngOnInit() {
        const userData = JSON.parse(StorageManagerService.getUser());
        this.userId = userData.id;
        this.getAllProjects();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    getAllProjects() {
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
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllApprovedProjectsBaDataTable').subscribe(resp => {
                    this.allcheck_id_count = 0;
                    this.allProjects = resp.data;
                    this.allProjects.forEach(row => {
                        if (row['project_doc']) {
                            row['project_doc'] = row['project_doc'].split(',');
                        } else {
                            row['project_doc'] = [];
                        }
                    });
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
            { name: 'project_name' },
            { name: 'created_at' },
            { name: 'est_time' },
            { name: 'flag', orderable: false },
            { name: 'jr_ba_status', orderable: false }]
        };
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    checkone(id) {
        let selectId: any = '';
        this.allcheck_id_count = 0;
        this.projectDetails = [];
        this.allComments = [];
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
        }
    }
}
