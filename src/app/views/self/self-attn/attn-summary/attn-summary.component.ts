import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { AttandanceService } from '../../../../shared/services/attandance.service';
import { TypeaheadOptions } from 'ngx-bootstrap';
import { StorageManagerService } from '../../../../shared/services/storage-manager.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../../../shared/services/datatable.service';

@Component({
    selector: 'app-attn-summary',
    templateUrl: 'attn-summary.component.html',
    styleUrls: ['./attn-summary.component.scss']
})

export class AttnSummaryComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    public daterange: any = {};
    startDate = moment().startOf('month');
    endDate = moment().endOf('month');
    empData: any = [];
    allAttn: any = [];
    search;
    generalData: any = [];
    searchData: any = {};
    public options: any = {
        locale: { format: 'DD/MM/YYYY' },
        alwaysShowCalendars: false,
        startDate: this.startDate,
        endDate: this.endDate,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    };

    constructor(private attnService: AttandanceService, private datatableService: DatatableService) {
    }


    ngOnInit() {
        this.empData = JSON.parse(StorageManagerService.getUser());
        this.searchData['start_date'] = this.startDate.format();
        this.searchData['end_date'] = this.endDate.format();
        this.getAttendanceByDate();
    }


    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    selectedDate = (value: any, datepicker?: any) => {
        datepicker.start = value.start;
        datepicker.end = value.end;

        this.daterange.start = value.start;
        this.daterange.end = value.end;
        this.daterange.label = value.label;

        this.startDate = value.start;
        this.endDate = value.end;
        this.searchData['start_date'] = this.startDate.format();
        this.searchData['end_date'] = this.endDate.format();
        this.rerender();
    }

    // getAttendanceByDate() {
    //     const data = {};
    //     data['emp_id'] = this.empData.id;
    //     data['start'] = this.startDate.format();
    //     data['end'] = this.endDate.format();
    //     // console.log(data);
    //     this.attnService.getUserAttendanceByDate(data).subscribe(
    //         (res) => {
    //             this.allAttn = res['data'];
    //             this.generalData = res['leave_data'];
    //         }
    //     );
    // }

    getAttendanceByDate = () => {
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
                this.datatableService.getTableDataAttnSelf(dataTablesParameters, this.searchData).subscribe(resp => {
                    this.allAttn = resp.data['data'];
                    this.generalData = resp.data['leave_data'];
                    // this.spinner.hide();
                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: []
                    });
                });
            },
            order: [],
            columns: [{ name: 'date', orderable: false },
            { name: 'entry_time', orderable: false },
            { name: 'exit_time', orderable: false },
            { name: 'break_time', orderable: false },
            { name: 'working_hours', orderable: false },
            { name: 'other_details', orderable: false }]
        };

    }
}
