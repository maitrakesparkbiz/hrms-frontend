import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';
import { AttandanceService } from '../../../shared/services/attandance.service';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserService } from '../../../shared/services/user.service';
import { AppConstants } from '../../../constants/app.constants';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { PusherService } from '../../../shared/services/pusher.sevice';
@Component({
  selector: 'app-self-dashboard',
  templateUrl: 'self-dashboard.component.html',
  styleUrls: ['./self-dashboard.component.scss']
})

export class SelfDashboardComponent implements OnInit {
  modalRef: BsModalRef;
  cmtForm: FormGroup;
  empData: any = [];
  submitted = false;
  checkin = true;
  breakout = true;
  both = true;
  end = true;
  msg = '';
  listings: any = [];
  comments: any = [];
  birthDays: any = [];
  holidays: any = [];
  current_ip = '';
  hour: any;
  min: any;
  sec: any;
  type: any;
  event: any = '';
  IMAGE_URL;
  employee_image;
  staffing_error = null;
  batch_hours = null;
  currentYear = moment().format('YYYY');

  today_birthday=[];
  month_birthday=[];
  constructor(private _fb: FormBuilder,
    private attandanceService: AttandanceService,
    private msgService: FlashMessageService,
    private modalService: BsModalService,
    private dashboardService: DashboardService,
    private pusherService: PusherService) {
  }
  ngOnInit() {
    this.cmtForm = this._fb.group({
      'comment_text': ['', Validators.required]
    });
    this.IMAGE_URL = AppConstants.IMAGE_URL;
    this.employee_image = '../../../../assets/img/avatars/profile_image.jpg';
    this.empData = JSON.parse(StorageManagerService.getUser());
    this.checkCurrentStatus();
    this.generateListings();
    this.getUpcomingBdays();
    this.startTime();
  }


  checkTime = (i) => {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  startTime = () => {
    const today = new Date();
    this.hour = today.getHours();
    this.min = today.getMinutes();
    this.sec = today.getSeconds();
    if (this.hour >= 12) {
      if (this.hour !== 12) {
        this.hour = this.hour - 12;
      }
      this.type = 'PM';
    } else {
      this.type = 'AM';
    }
    // add a zero in front of numbers<10
    this.min = this.checkTime(this.min);
    this.sec = this.checkTime(this.sec);
    setTimeout(() => {
      this.repeat();
    }, 500);
  }

  repeat = () => {
    this.startTime();
  }

  getUpcomingBdays = () => {
    this.dashboardService.getUpcomingBdays().subscribe((res) => {
      this.birthDays = res['birthdays'];
      for (const bday of this.birthDays) {
        if (moment(bday.date_of_birth.date).format('DD-MM') === moment().format('DD-MM')) {
          bday.isToday = true;
          this.today_birthday.push(bday)
        } else {
          bday.isToday = false;
          this.month_birthday.push(bday);
        }
      }
      this.holidays = res['holidays'];
    });
  }

  checkCurrentStatus = () => {
    this.attandanceService.checkCurrentStatus().subscribe(
      (res) => {
        const status = res['status'];
        if (res['less_staffing']) {
          this.staffing_error = res['less_staffing'];
        }
        if (res['hours']) {
          this.batch_hours = res['hours'];
        }
        if (status === 'checkin') {
          this.checkin = false;
        } else if (status === 'breakout') {
          this.breakout = false;
        } else if (status === 'both') {
          this.both = false;
        } else if (status === 'no_checkout') {
          this.end = false;
          this.msg = 'You forgot checkout yesterday, contact your hr first.';
        } else {
          this.end = false;
          this.msg = 'thanks for your presence.';
        }
      }
    );
  }

  generateListings = () => {
    this.attandanceService.generateListings().subscribe(
      (res) => {
        if (res) {
          if (res['listings'] !== null) {
            this.listings = res['listings'];
            Object.keys(this.listings).forEach(index => {
              // this.listings[index][0] = moment(this.listings[index][0]['date']).format('LLL');
              // this.listings[index][0] = moment(this.listings[index][0]['date']).format('MMM Do, YYYY hh:mm A');
              this.listings[index][0] = moment(this.listings[index][0]['date']).format('hh:mm A | DD-MM-YYYY');
            });
          }
          if (res['comments'] !== null) {
            this.comments = res['comments'];
          }
          if (res['ip'] !== null) {
            this.current_ip = res['ip'];
          }
        }
      }
    );
  }

  onBtnClick = (event) => {
    const data = {};
    data['event'] = event;
    if (event !== 'check_in') {
      this.closeModel();
    }
    data['emp_id'] = this.empData.id;
    this.checkin = true;
    this.breakout = true;
    this.both = true;
    this.end = true;
    this.attandanceService.presentEvent(data).subscribe(
      (res) => {
        // this.checkin = true;
        // this.breakout = true;
        // this.both = true;
        // this.end = true;
        if (res === 'checkin') {
          this.checkin = false;
        } else if (res === 'breakout') {
          this.breakout = false;
        } else if (res === 'both') {
          this.both = false;
        } else if (res === 'no_checkout') {
          this.end = false;
          this.msg = 'You forgot checkout yesterday, contact your hr first.';
        } else if (res === 'end') {
          this.end = false;
          this.msg = 'Thanks for your presence';
        } else {
          this.msgService.pop('danger', 'Error', 'error occured');
        }
        this.generateListings();
      }
    );
  }

  onSubmit = () => {
    this.submitted = true;
    if (this.cmtForm.valid) {
      const data = {};
      data['emp_id'] = this.empData.id;
      data['comment_text'] = this.cmtForm.get('comment_text').value.trim();
      if (data['comment_text'] !== '') {
        this.attandanceService.saveComment(data).subscribe(
          (res) => {
            if (res === 'error') {
              this.msgService.pop('danger', 'Error', 'error occured');
            }
            this.generateListings();
            this.cmtForm.reset();
            this.submitted = false;
          }
        );
      }
    }
  }

  openModal = (template, event) => {
    this.event = event;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  closeModel = () => {
    this.modalRef.hide();
  }
}
