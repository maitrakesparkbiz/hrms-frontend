import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { JobsService } from '../../shared/services/jobs.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../shared/services/datatable.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-jobs',
    templateUrl: './jobs.component.html',
    styleUrls: ['./jobs.component.scss']
})

export class JobsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    modalRef: BsModalRef;
    allOpenings: any;
    openingDetail: any;
    search;
    allcheck_id;
    opening_edit;
    allcheck_id_count: any = 0;
    site_url = window.location.host;
    filterForm: FormGroup;

    constructor(private jobsService: JobsService,
        private modalService: BsModalService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private datatableService: DatatableService) {

    }
    ngOnInit() {
        this.filterForm = new FormGroup({
            'status': new FormControl('all')
        });
        this.getAllOpenings();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    // getAllOpenings() {
    //     this.spinner.show();
    //     this.jobsService.getAllOpenings().subscribe(
    //         (res) => {
    //             this.allOpenings = res['data'];
    //             for (let i = 0; i < this.allOpenings.length; i++) {
    //                 this.allOpenings[i].last_date = moment(this.allOpenings[i].last_date.date).format('MMM D Y');
    //                 this.allOpenings[i].posted_date = moment(this.allOpenings[i].posted_date.date).format('MMM D Y');
    //                 if (this.allOpenings[i].posted_as === 'Public' || this.allOpenings[i].posted_as === 'Both') {
    //                     this.allOpenings[i].url =
    //                         'http://' + this.site_url +
    //                         '/#/job/' + this.allOpenings[i].id + '/' + this.allOpenings[i].role.split(' ').join('-');
    //                 }
    //             }
    //             this.spinner.hide();
    //         }
    //     );
    // }

    getAllOpenings = () => {
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
                dataTablesParameters.columns[5].search.value = this.filterForm.get('status').value;
                this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllOpenings').subscribe(resp => {
                    this.allcheck_id = false;
                    this.allcheck_id_count = 0;
                    this.allOpenings = resp.data;
                    for (let i = 0; i < this.allOpenings.length; i++) {
                        if (this.allOpenings[i].posted_as === 'Public' || this.allOpenings[i].posted_as === 'Both') {
                            this.allOpenings[i].url =
                                'http://' + this.site_url +
                                '/job/' + this.allOpenings[i].id + '/' + this.allOpenings[i].role.split(' ').join('-');
                        }
                    }
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
            { name: 'role' },
            { name: 'posted_as' },
            { name: 'posted_date' },
            { name: 'last_date' },
            { name: 'status' }]
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
            for (let i = 0; i < this.allOpenings.length; i++) {
                this.allOpenings[i]['isSelected'] = true;
                this.allcheck_id_count++;
            }
        } else {
            for (let i = 0; i < this.allOpenings.length; i++) {
                this.allOpenings[i]['isSelected'] = false;
            }
        }
    }
    checkone = (id) => {
        this.allcheck_id = false;
        let selectId = '';
        this.allcheck_id_count = 0;
        // let tempCount = 0;
        for (let i = 0; i < this.allOpenings.length; i++) {
            if (+id === +this.allOpenings[i]['id']) {
                this.allOpenings[i]['isSelected'] = !this.allOpenings[i]['isSelected'];
                if (this.allOpenings[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selectId = this.allOpenings[i];
                }
            } else {
                this.allOpenings[i]['isSelected'] = false;
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
            this.getOpeningsById(selectId);
        }
    }

    // checkone(id) {
    //     this.allcheck_id = false;
    //     let selectId = '';
    //     this.allcheck_id_count = 0;
    //     this.openingDetail = [];
    //     setTimeout(() => {
    //         for (let i = 0; i < this.allOpenings.length; i++) {
    //             if (+this.allOpenings[i]['id'] === +id) {
    //                 if (this.allOpenings[i]['isSelected']) {
    //                     this.allcheck_id_count++;
    //                     selectId = this.allOpenings[i];
    //                 }
    //             } else {
    //                 this.allOpenings[i]['isSelected'] = false;
    //             }
    //         }
    //         if (this.allcheck_id_count === 1) {
    //             this.getOpeningsById(selectId);
    //         }
    //     }, 100);
    // }

    getOpeningsById = (selectedRow) => {
        this.openingDetail = selectedRow;
    }

    editOpening = () => {
        this.opening_edit = [];
        this.opening_edit = this.openingDetail;
        this.router.navigate(['/jobs/openings/update-job/' + this.opening_edit['id']]);
    }

    openModel = (template) => {
        this.modalRef = this.modalService.show(template);
    }


    closeModel = () => {
        this.modalRef.hide();
    }
}
