import { Component, ViewEncapsulation, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import {
  startOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addHours
} from 'date-fns';

import { CalendarEvent, CalendarEventAction } from 'angular-calendar'; // import should be from `angular-calendar` in your app
import { HolidayService } from '../../shared/services/holiday.service';
import { UserService } from '../../shared/services/user.service';
import { LocationService } from '../../shared/services/location.service';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AppConstants } from '../../constants/app.constants';
import { FlashMessageService } from '../../shared/services/flash-message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PermissionService } from '../../shared/services/permission.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};


@Component({
  templateUrl: 'holiday-events.component.html',
  styleUrls: ['./holiday-events.component.scss'],
  // encapsulation: ViewEncapsulation.None
})

export class HolidayEventsComponent implements OnInit {
  modalRef: BsModalRef;
  current_year = (new Date()).getFullYear();
  view: any = 'month';
  batch_opt: any = [];
  year_opt: any = [];
  selectedBatchData: any = [];
  workingDayArray: any = [];
  viewDate: Date = new Date();
  selectedYear = (new Date()).getFullYear();
  holidayData: any = [];
  EventForm: FormGroup;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  IMAGE_URL;
  editEventArray: any = [];
  editStatus = false;
  allUsers: any = [];
  edit_id: any;
  afterChangeStatus = true;
  employee_image = '../../../assets/img/avatars/profile_image.jpg';
  listingView: Boolean = false;
  listingData: any = [];
  UserData: any = [];
  eventAddAllowed: Boolean = true;
  @ViewChild('batch') batch: ElementRef;

  events: CalendarEvent[] = [
    //     {
    //     start: subDays(startOfDay(new Date()), 1),
    //     end: addDays(new Date(), 2),
    //     title: 'A 2 day event',
    //     color: colors.red,
    //     actions: this.actions
    // }, {
    //     start: startOfDay(new Date()),
    //     title: 'An event with no end date',
    //     color: colors.yellow,
    //     actions: this.actions
    // }, {
    //     start: subDays(endOfMonth(new Date()), 3),
    //     end: addDays(endOfMonth(new Date()), 3),
    //     title: 'A long event that spans 2 months',
    //     color: colors.blue
    // }
  ];

  actions: CalendarEventAction[] = [
    // {
    //     label: '<i class='fa fa-fw fa-pencil'></i>',
    //     onClick: ({ event }: { event: CalendarEvent }): void => {
    //         console.log('Edit event', event);
    //     }
    // }, {
    //     label: '<i class='fa fa-fw fa-times'></i>',
    //     onClick: ({ event }: { event: CalendarEvent }): void => {
    //         console.log('in');
    //         this.events = this.events.filter(iEvent => iEvent !== event);
    //     }
    // }
  ];

  activeDayIsOpen: Boolean = true;

  constructor(private holidayService: HolidayService,
    private locationService: LocationService,
    private modalService: BsModalService,
    private _fb: FormBuilder,
    private userservice: UserService,
    public datepipe: DatePipe,
    private msgService: FlashMessageService,
    private spinner: NgxSpinnerService,
    private perService: PermissionService) {
  }

  ngOnInit() {
    this.IMAGE_URL = AppConstants.IMAGE_URL;
    this.eventAddAllowed = this.perService.hasPermission('HOLIDAY-EVENTS.ADD');
    this.EventForm = this._fb.group({
      'event_name': ['', Validators.required],
      'emp_id': [],
      'description': [],
      'start_date': ['', Validators.required],
      'end_date': ['', Validators.required]
    });

    this.allUsers = this.userservice.all_users;
    if (this.allUsers.length === 0) {
      this.getSetAllUsers();
    } else {
      Object.keys(this.allUsers).forEach(key => {
        this.dropdownList.push({
          item_id: this.allUsers[key]['id'],
          item_text: (this.allUsers[key]['firstname'] + ' ' + this.allUsers[key]['lastname'])
        });
      });
    }
    // this.userservice.getAllUsers().subscribe(
    //   (res) => {
    //     this.allUsers = res.data;
    //     Object.keys(this.allUsers).forEach(element => {
    //       this.dropdownList.push({
    //         item_id: this.allUsers[element]['id'],
    //         item_text: (this.allUsers[element]['firstname'] + ' ' + this.allUsers[element]['lastname'])
    //       });
    //     });
    //   }
    // );
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    let year_count = this.current_year;
    this.year_opt.push(year_count);
    for (let i = 1; i <= 4; i++) {
      year_count += 1;
      this.year_opt.push(year_count);
    }
    this.getAllLocationOpt();
  }
    getSetAllUsers = async () => {
    this.allUsers = await this.userservice.getSetAllUsers().toPromise();
    Object.keys(this.allUsers).forEach(key => {
      this.dropdownList.push({
        item_id: this.allUsers[key]['id'],
        item_text: (this.allUsers[key]['firstname'] + ' ' + this.allUsers[key]['lastname'])
      });
    });
  }
  getAllLocationOpt = async () => {
    // this.spinner.show();
    this.batch_opt = await this.locationService.getAllLocationOpt().toPromise();
    this.holidayData = await this.holidayService.getHolidayData(this.selectedYear).toPromise();
    // this.spinner.hide();
    if (this.batch_opt.length > 0) {
      this.onSelectBatch(this.batch_opt[0]['id']);
    } else {
      this.onYearSelect(this.selectedYear.toString());
    }
  }

  onSelectBatch = (value) => {
    this.editStatus = false;
    this.events = [];
    this.selectedBatchData = [];
    for (let i = 0; i < this.batch_opt.length; i++) {
      if (+this.batch_opt[i]['id'] === +value) {
        this.selectedBatchData = this.batch_opt[i];
      }
    }
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    let selected_batch_days = [];
    this.workingDayArray = [];
    if (this.selectedBatchData['working_days']) {
      selected_batch_days = this.selectedBatchData['working_days'].split(',');
    }
    Object.keys(days).forEach(element => {
      if (selected_batch_days.indexOf(days[element]) > -1) {
        this.workingDayArray.push(element);
      }
    });
    // this.selectedBatchData['working_days'] = this.workingDayArray;
    this.selectedBatchData['work_days'] = this.workingDayArray;

    this.markHoliday(this.selectedBatchData, this.holidayData);
  }

  onYearSelect = (value) => {
    this.editStatus = false;
    this.events = [];
    this.selectedYear = value;
    this.viewDate = new Date(value);
    this.holidayService.getHolidayData(value).subscribe(
      (res) => {
        this.holidayData = res;
        this.markHoliday(this.selectedBatchData, this.holidayData);
      }
    );
  }

  markHoliday = (value: any, holidayData) => {
    this.listingData = [];
    const tempSat: any[] = [];
    const thisYear = this.selectedYear;
    const months = Array.apply(0, Array(12)).map(function (_, i) { return moment().year(thisYear).month(i).format('MM'); });
    if (holidayData.length > 0) {
      for (const day of holidayData) {
        if (day['is_company_event']) {
          this.events.push({
            start: new Date(day['start_date']['date']),
            end: new Date(day['end_date']['date']),
            title: day['event_name'],
            cssClass: 'year-events',
            id: day['id']
          });
        } else {
          this.events.push({
            start: new Date(day['start_date']['date']),
            end: new Date(day['end_date']['date']),
            title: day['event_name'],
            cssClass: 'year-festival',
            id: day['id']
          });
        }
        this.listingData.push(day);
      }
    }

    if (Object.keys(value).length!==0) {
      for (const month of months) {
        const selected = moment().year(thisYear).month(+month - 1);
        const newSat = selected.startOf('month').day('Saturday');
        const newMonth = newSat.month();
        let count = 0;
        if (+value['alt_sat'] === 1) {
          while (newMonth === newSat.month()) {
            if (count % 2 === 0) {
              this.events.push({
                start: startOfDay(newSat._date),
                end: startOfDay(newSat._date),
                title: 'Saturday',
                color: colors.red,
                cssClass: 'custom-holiday'
              });
            }
            newSat.add(7, 'd');
            count++;
          }
        } else {
          if (!value['work_days'].includes('6')) {
            while (newMonth === newSat.month()) {
              // console.log(newSat._date);
              this.events.push({
                start: startOfDay(newSat._date),
                end: startOfDay(newSat._date),
                title: 'Saturday',
                color: colors.red,
                cssClass: 'custom-holiday'
              });
              newSat.add(7, 'd');
            }
          }
        }
      }
    }
    const sunday = moment().year(thisYear).month(0).date(1).day(0);
    const end = moment().year(thisYear).month(12).date(31).day(0);
    while (sunday.isBefore(end)) {
      if (sunday.year() === moment().year(thisYear).year()) {
        this.events.push({
          start: startOfDay(sunday._date),
          end: startOfDay(sunday._date),
          title: 'Sunday',
          cssClass: 'custom-holiday',
          color: colors.red,
          // actions: this.actions
        });
      }
      sunday.add(7, 'days');
    }
  }

  checkone = (id) => {
    let allcheck_id_count = 0;
    for (let i = 0; i < this.listingData.length; i++) {
      if (+this.listingData[i]['id'] === +id) {
        this.listingData[i]['isSelected'] = !this.listingData[i]['isSelected'];
        if (this.listingData[i]['isSelected']) {
          allcheck_id_count++;
        }
      } else {
        this.listingData[i]['isSelected'] = false;
      }
    }
    if (allcheck_id_count === 1) {
      this.editYearEvent(id);
    } else {
      this.editStatus = false;
    }
  }

  increment = (): void => {
    const addFn: any = {
      day: addDays,
      week: addWeeks,
      month: addMonths
    }[this.view];
    this.viewDate = addFn(this.viewDate, 1);
  }

  decrement = (): void => {
    const subFn: any = {
      day: subDays,
      week: subWeeks,
      month: subMonths
    }[this.view];
    this.viewDate = subFn(this.viewDate, 1);
  }

  resetHolidayCheckBox = () => {
    for (const dayEvent of this.listingData) {
      if ('isSelected' in dayEvent) {
        delete dayEvent['isSelected'];
      }
    }
  }

  today = (): void => {
    this.viewDate = new Date();
  }

  dayClicked = ({ date, events }: { date: Date, events: CalendarEvent[] }, template: TemplateRef<any>): void => {
    this.EventForm.reset();
    this.edit_id = null;
    this.EventForm.get('start_date').setValue(moment(date).format());
    this.EventForm.get('end_date').setValue(moment(date).format());
    this.selectedItems = [];
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  editModal = (template: TemplateRef<any>, isDelete = false) => {
    if (!isDelete) {
      this.selectedItems = [];
      this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
      this.EventForm.get('description').setValue(this.editEventArray['description']);
      this.EventForm.get('event_name').setValue(this.editEventArray['event_name']);
      this.EventForm.get('start_date').setValue(moment(this.editEventArray['start_date'].date).format());
      this.EventForm.get('end_date').setValue(moment(this.editEventArray['end_date'].date).format());
      if (this.editEventArray.assoc_emp !== null) {
        Object.keys(this.editEventArray.assoc_emp).forEach(element => {
          this.selectedItems.push({
            item_id: this.editEventArray.assoc_emp[element]['id'],
            item_text: (this.editEventArray.assoc_emp[element]['firstname'] + ' '
              + this.editEventArray.assoc_emp[element]['lastname'])
          });
        });
      }
    } else {
      this.modalRef = this.modalService.show(template);
    }
  }

  closeModel = () => {
    this.EventForm.reset();
    this.modalRef.hide();
  }

  SaveEvent = () => {
    if (this.EventForm.valid) {
      const post_data = this.EventForm.value;
      if (this.edit_id) {
        post_data['edit_id'] = this.edit_id;
      }
      post_data['is_company_event'] = 1;
      post_data['year'] = this.selectedYear;
      post_data['start_date'] = this.datepipe.transform(post_data['start_date'], 'dd-MM-yyyy');
      post_data['end_date'] = this.datepipe.transform(post_data['end_date'], 'dd-MM-yyyy');
      this.closeModel();
      this.holidayService.saveHoliday(post_data).subscribe(
        (res) => {
          if (res === 'created') {
            this.editEventArray = [];
            this.editStatus = false;
            this.getAllLocationOpt();
            this.msgService.pop('success', 'Event Added', 'Event added successfully');
          }
          if (res === 'updated') {
            this.editEventArray = [];
            this.getAllLocationOpt();
            this.editStatus = false;
            this.msgService.pop('success', 'Event Updated', 'Event Updated successfully');
          }
        }
      );
    }
  }

  editYearEvent = (id) => {
    this.edit_id = id;
    this.editEventArray = {};
    Object.keys(this.holidayData).forEach(index => {
      if (+this.holidayData[index]['id'] === +id) {
        this.editEventArray = this.holidayData[index];
        this.editStatus = true;
      }
    });
    // this.editEventArray['start_date_formatted'] =
    //     this.datepipe.transform(this.editEventArray['start_date']['date'], 'MMMM dd, yyyy h:MM a');
    // this.editEventArray['end_date_formatted'] =
    //     this.datepipe.transform(this.editEventArray['end_date']['date'], 'MMMM dd, yyyy h:MM a');
    const arr = [];
    if (this.editEventArray.assoc_emp_id !== null) {
      Object.keys(this.editEventArray.assoc_emp_id).forEach(element => {
        Object.keys(this.allUsers).forEach(row => {
          if (+this.editEventArray.assoc_emp_id[element].id === +this.allUsers[row].id) {
            arr.push(this.allUsers[row]);
          }
        });
      });
    }

    this.editEventArray['assoc_emp'] = arr;
  }

  editOtherHoliday = (days: any) => {
    this.editEventArray = {};
    this.editStatus = true;
    this.editEventArray['start_date'] = new Date(days['start']);
    this.editEventArray['end_date'] = new Date(days['end']);
    this.editEventArray['event_name'] = days['title'];
  }

  removeEvent = () => {
    this.closeModel();
    this.holidayService.deleteEvent(this.edit_id).subscribe(
      (res) => {
        if (res === 'deleted') {
          this.editEventArray = [];
          this.editStatus = false;
          this.getAllLocationOpt();
          this.msgService.pop('error', 'Event Deleted', 'Event Deleted Successfully');
        }
      }
    );
  }

  toggleView = (flag = false) => {
    if (flag) {
      this.listingView = true;
    } else {
      this.listingView = false;
    }
    this.editStatus = false;
    this.resetHolidayCheckBox();
  }
}
