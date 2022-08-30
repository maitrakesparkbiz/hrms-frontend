import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import * as moment from 'moment';
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {DatatableService} from "../../../../shared/services/datatable.service";

@Component({
  selector: 'app-self-team-add',
  templateUrl: './self-team-add.component.html',
  styleUrls: ['./self-team-add.component.scss']
})
export class SelfTeamAddComponent implements OnInit  {

  // @ViewChild(DataTableDirective)
  // dtElement: DataTableDirective;
  // dtOptions: DataTables.Settings = {};
  // dtTrigger: Subject<any> = new Subject();

  id;

  public daterange: any = {};
  startDate = moment().startOf('month');
  endDate = moment().endOf('month');

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
  constructor(public router:Router,
              private datatableService: DatatableService,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
        (res) => {
          if (res.id) {
            this.id = res.id;
          }
        }
    );
    this.searchData['start_date'] = this.startDate.format();
    this.searchData['end_date'] = this.endDate.format();
    this.getTeamByDate();
  }
  // ngAfterViewInit(): void {
  //   this.dtTrigger.next();
  // }
  //
  // ngOnDestroy(): void {
  //   this.dtTrigger.unsubscribe();
  // }
  onBack = () => {
    this.router.navigate(['/self/team']);
  }
  // rerender(): void {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.destroy();
  //     this.dtTrigger.next();
  //   });
  // }
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
    this.getTeamByDate();
    // this.rerender();
  }

  getTeamByDate = () => {

    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   lengthMenu: [5, 10, 25, 50],
    //   serverSide: true,
    //   processing: true,
    //   language: {
    //     searchPlaceholder: 'Search...',
    //     search: ''
    //   },
    //   ajax: (dataTablesParameters: any, callback) => {
    this.datatableService.getTableDataTeamSelf('', this.searchData, this.id).subscribe(resp => {
      // console.log(resp);
      this.allAttn = resp.data['data'];
      this.generalData = resp.data['leave_data'];
      // console.log(this.generalData);
      // this.spinner.hide();
      //   callback({
      //     recordsTotal: resp.recordsTotal,
      //     recordsFiltered: resp.recordsFiltered,
      //     data: []
      //   });
      // });
    });
  }
    //   order: [],
    //   columns: [{ name: 'date', orderable: false },
    //     { name: 'entry_time', orderable: false },
    //     { name: 'exit_time', orderable: false },
    //     { name: 'break_time', orderable: false },
    //     { name: 'working_hours', orderable: false }]
    // };



}
