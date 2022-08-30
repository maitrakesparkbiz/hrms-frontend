import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlashMessageService } from '../../shared/services/flash-message.service';
import { LeaveapplicationService } from '../../shared/services/leaveapplication.service';
import { AppConstants } from '../../constants/app.constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExpenseService } from '../../shared/services/expense.service';
import { DashboardService } from '../../shared/services/dashboard.service';
import * as moment from 'moment';
@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  recentLeaves: any = [];
  recentLeaveslLen = 0;
  todayLeavesLen = 0;
  todayLeaves: any = [];
  increments: any = [];
  probationEmp: any = [];
  claims: any = [];
  IMAGE_URL;
  employee_image;
  actionId;
  activeEmpCount;
  modalRef: BsModalRef;
  rejectForm: FormGroup;
  pendingCount;
  job_cardData: any = [];
  birthDays: any = new Array();
  currentMonth = moment().format('MMMM');
  currentYear = moment().format('YYYY');
  today_birthday=[];
  month_birthday=[];
  // changedData: any = [];
  constructor(private dashboardService: DashboardService,
    private leaveAppService: LeaveapplicationService,
    private modalService: BsModalService,
    private expenseService: ExpenseService) {
  }

  ngOnInit() {
    // this.changedData['recentLeaves'] = [];
    // this.changedData['todayLeaves'] = [];
    this.IMAGE_URL = AppConstants.IMAGE_URL;
    this.employee_image = '../../../../assets/img/avatars/profile_image.jpg';

    this.rejectForm = new FormGroup({
      'reject_reason': new FormControl('', [Validators.required])
    });

    this.getLeaveData();
    this.getUpcomingBdays();
    this.getAppreciations();
  }

  getUpcomingBdays = () => {
    this.dashboardService.getUpcomingBdays().subscribe((res) => {
      this.birthDays = res['birthdays'];
      for (const bday of this.birthDays) {
        if (moment(bday.date_of_birth.date).format('DD-MM') === moment().format('DD-MM')) {
          bday.isToday = true;
          this.today_birthday.push(bday);
        } else {
          bday.isToday = false;
          this.month_birthday.push(bday);
        }
      }

    });
  }

  getAppreciations = () => {
    this.dashboardService.getCurrentMonthIncrementEmp().subscribe(
      (res) => {
        this.increments = res['increments'];
        this.activeEmpCount = res['active_emp']['active_count'];
        this.probationEmp = res['on_probation'];
        this.job_cardData = res['jobs'];
      }
    );
  }

  getLeaveData = () => {
    this.dashboardService.getLeaveDataDashboard().subscribe(res => {
      this.recentLeaves = res['recent_leaves'];
      this.recentLeaveslLen = 0;
      for (const leave of this.recentLeaves) {
        if (leave[0].status === 'Pending') {
          this.recentLeaveslLen++;
        }
      }
      this.todayLeaves = res['today_leaves'];

      this.todayLeavesLen = 0;
      for (const leave of this.todayLeaves) {
        if (!leave[0]['final_approve']) {
          this.todayLeavesLen++;
        }
      }
      this.dashboardService.pendingLeaves.next({ 'count': this.recentLeaveslLen });
      this.dashboardService.todayLeaves.next({ 'count': this.todayLeavesLen });
    });
  }

  openModal = (id, template) => {
    this.actionId = id;
    this.modalRef = this.modalService.show(template);
  }

  openFinalLeaveModal(id, template) {
    this.actionId = id;
    this.modalRef = this.modalService.show(template);
  }

  closeModel = () => {
    this.modalRef.hide();
    this.rejectForm.reset();
  }

  onApprove = () => {
    this.closeModel();
    // temp
    this.leaveAppService.updateAcceptStatus(this.actionId).subscribe(res => {
      if (res === 'Updated Successfully') {
        this.updateLeaveArray();
      }
    });
  }

  onReject = () => {
    if (this.rejectForm.valid) {
      const data = {};
      data['id'] = this.actionId;
      data['reject_reason'] = this.rejectForm.get('reject_reason').value;
      this.closeModel();
      this.leaveAppService.updateRejectStatus(data).subscribe(res => {
        if (res === 'Updated Successfully') {
          this.updateLeaveArray();
        }
      });
    }
  }

  onFinalApprove = () => {
    let editLeave = [];
    for (const leave of this.todayLeaves) {
      if (+leave[0]['id'] === +this.actionId) {
        editLeave = leave[0];
      }
    }
    this.closeModel();
    this.leaveAppService.finalApproveLeave(editLeave).subscribe(
      (res) => {
        if (res === 'success') {
          for (const leave of this.todayLeaves) {
            if (+leave[0]['id'] === +this.actionId) {
              leave['isFinal'] = true;
              leave[0]['final_approve'] = true;
              this.todayLeavesLen--;
            }
          }
          this.dashboardService.todayLeaves.next({ 'count': this.todayLeavesLen });
          this.dashboardService.updatedData.next();
        }
      }
    );
  }

  updateLeaveArray = () => {
    // Object.keys(this.recentLeaves).forEach(index => {
    //   if (this.recentLeaves[index]) {
    //     if (+this.recentLeaves[index][0]['id'] === +this.actionId) {
    //       this.changedData['recentLeaves'].push(this.recentLeaves[index]);
    //       this.recentLeaves.splice(index, 1);
    //     }
    //   }
    // });


    // Object.keys(this.todayLeaves).forEach(index => {
    //   if (this.todayLeaves[index]) {
    //     if (+this.todayLeaves[index][0]['id'] === +this.actionId) {
    //       this.todayLeaves[index]['isFinal'] = true;
    //       this.changedData['todayLeaves'].push(this.todayLeaves[index]);
    //       this.todayLeaves.splice(index, 1);
    //     }
    //   }
    // });

    this.getLeaveData();

    // this.leaveAppService.getPendingLeavesCount().subscribe(
    //   (res) => {
    //     this.pendingCount = res['count'];
    //     this.dashboardService.pendingLeaves.next({ 'count': this.pendingCount });
    //   }
    // );
    this.dashboardService.updatedData.next();
  }
}
