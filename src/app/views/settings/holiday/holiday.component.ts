import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { HolidayService } from '../../../shared/services/holiday.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DatatableService } from '../../../shared/services/datatable.service';

@Component({
    templateUrl: 'holiday.component.html',
    styleUrls: ['./holiday.component.scss']
})

export class HolidayComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();


    current_year = (new Date()).getFullYear();
    year_opt = [];
    search;
    allcheck_id;
    allcheck_id_count = 0;
    selected_opt = this.current_year;
    holiday_data;
    holiday_status;
    modalRef: BsModalRef;
    constructor(private _fb: FormBuilder,
        private holidayService: HolidayService,
        private router: Router,
        private modalService: BsModalService,
        private spinner: NgxSpinnerService,
        private msgService: FlashMessageService,
        private datatableService: DatatableService) {
    }

    ngOnInit() {
        let year_count = this.current_year;
        this.year_opt.push(year_count);
        for (let i = 1; i <= 4; i++) {
            year_count += 1;
            this.year_opt.push(year_count);
        }
        this.selected_opt = this.current_year;
        this.getHolidayData();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    getHolidayData = () => {
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
                this.datatableService.getHolidaysDatatable(dataTablesParameters, this.selected_opt).subscribe(resp => {
                    this.allcheck_id = false;
                    this.allcheck_id_count = 0;
                    this.holiday_data = resp.data;
                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: []
                    });
                });
            },
            order: [],
            columns: [{ name: 'id', orderable: false },
            { name: 'event_name' },
            { name: 'start_date' }]
        };
    }

    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    onYearSelect = (year) => {
        this.selected_opt = year;
        this.rerender();
    }

    checkboxHeader = (evt: Event) => {
        this.allcheck_id_count = 0;
        if (this.allcheck_id !== true) {
            for (let i = 0; i < this.holiday_data.length; i++) {
                this.holiday_data[i]['isSelected'] = true;
                this.allcheck_id_count++;
            }
        } else {
            for (let i = 0; i < this.holiday_data.length; i++) {
                this.holiday_data[i]['isSelected'] = false;
            }
        }
    }

    checkone = (id) => {
        this.allcheck_id = false;
        let selectId = '';
        let selected = [];
        this.allcheck_id_count = 0;
        let tempCount = 0;
        for (let i = 0; i < this.holiday_data.length; i++) {
            if (+id === +this.holiday_data[i]['id']) {
                this.holiday_data[i]['isSelected'] = !this.holiday_data[i]['isSelected'];
                if (this.holiday_data[i]['isSelected']) {
                    this.allcheck_id_count++;
                    selected = this.holiday_data[i];
                }
            } else {
                if (this.holiday_data[i]['isSelected']) {
                    selected = this.holiday_data[i];
                    this.allcheck_id_count++;
                }
            }
            if (this.holiday_data[i]['isSelected']) {
                tempCount++;
            }
        }
        if (tempCount === this.holiday_data.length) {
            this.allcheck_id = true;
        }
    }

    addHoliday = () => {
        this.router.navigate(['settings/holiday/add/' + this.selected_opt]);
    }
    editHoliday = () => {
        for (let i = 0; i < this.holiday_data.length; i++) {
            if (this.holiday_data[i]['isSelected']) {
                this.router.navigate(['settings/holiday/edit/' + this.holiday_data[i]['id']]);
            }
        }
    }

    openModel = (template) => {
        this.modalRef = this.modalService.show(template);
    }

    deleteHolidays = () => {
        this.spinner.show();
        this.holidayService.deleteHolidays(this.holiday_data).subscribe((res) => {
            if (res === 'deleted') {
                this.closeModel();
                this.allcheck_id_count = 0;
                this.allcheck_id = false;
                this.msgService.pop('error', 'Holiday Deleted', 'Deleted Succesfully');
                this.rerender();
                this.spinner.hide();
            }
        });
    }

    closeModel = () => {
        this.modalRef.hide();
    }
}
