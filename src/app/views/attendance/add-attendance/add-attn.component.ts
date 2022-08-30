import { Component, OnInit } from '@angular/core';
import { AttandanceService } from '../../../shared/services/attandance.service';
import { BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { DatePipe } from '@angular/common';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { ConfirmPasswordValidation } from '../../../validators/confirm-password.validator';
import { UniqueemailValidator } from '../../../validators/uniqueemail.validator';

@Component({
  selector: 'app-add-attn',
  templateUrl: 'add-attn.component.html',
  styleUrls: ['./add-attn.component.scss']
})

export class AddAttnComponent implements OnInit {
  attnForm: FormGroup;
  breaks: FormArray;
  comments: FormArray;
  check_in_id;
  emp_id;
  selected_date;
  check_in_data;
  user_data: any = [];
  remove_breaks_arr: any = [];
  day: any;
  month: any;
  year: any;
  emp_name: any;
  constructor(private attendanceService: AttandanceService,
    private _fb: FormBuilder,
    public datepipe: DatePipe,
    private msgService: FlashMessageService,
    private spinner: NgxSpinnerService,
    public router: Router,
    public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe((data) => {
      if (data.id_date) {
        const res = data.id_date.split('&');
        this.emp_id = res[0];
        this.selected_date = atob(res[1]);
      } else {
        const res = data.check_in_id_date.split('&');
        this.check_in_id = res[0];
        this.selected_date = atob(res[1]);
      }
    });
    this.emp_name = this.attendanceService.choosedEmp;
    const newDate = moment(this.selected_date, 'DD/MM/YYYY');
    this.day = newDate.format('D');
    this.month = newDate.month();
    this.year = newDate.format('Y');
    this.attendanceService.choosedDate = this.selected_date;
    this.user_data = JSON.parse(StorageManagerService.getUser());
    this.attnForm = this._fb.group({
      'emp_id': [this.emp_id],
      'check_in_id': [this.check_in_id],
      'check_in_time': [],
      'check_out_time': [],
      'check_out_emp_id': [],
      'breaks': this._fb.array([]),
      'comments': this._fb.array([])
    });
    this.breaks = this.attnForm.get('breaks') as FormArray;
    if (this.check_in_id) {
      this.attendanceService.getCheckInDataById(this.check_in_id).subscribe(
        (res) => {
          this.check_in_data = res;
          this.attnForm.get('emp_id').setValue(this.check_in_data.emp_id);
          this.attnForm.get('check_in_time').setValue(moment(this.check_in_data.check_in_time.date));
          if (this.check_in_data.check_out_time) {
            this.attnForm.get('check_out_time').setValue(moment(this.check_in_data.check_out_time.date));
          }
          if (this.check_in_data.breaks.length > 0) {
            for (const row of this.check_in_data.breaks) {
              this.breaks.push(this._fb.group({
                'id': [row.id],
                'break_in_time': [row.break_in_time ? moment(row.break_in_time.date) : ''],
                'break_out_time': [row.break_out_time ? moment(row.break_out_time.date) : '']
              }));
            }
          } else {
            // this.breaks.push(this.createBreaksArr());
          }
          if (this.check_in_data.comments.length > 0) {
            this.comments = this.attnForm.get('comments') as FormArray;
            for (const row of this.check_in_data.comments) {
              this.comments.push(this._fb.group({
                'id': [row.id],
                'comment_text': [row.comment_text],
                'response_text': [row.response_text]
              }));
            }
          }
        }
      );
    } else {
      // this.breaks.push(this.createBreaksArr());
    }
  }

  createBreaksArr = (): FormGroup => {
    return this._fb.group({
      'id': [],
      'break_in_time': [''],
      'break_out_time': ['']
    });
  }

  createCommentsArr = (): FormGroup => {
    return this._fb.group({
      'id': [],
      'comment_text': [],
      'response_text': []
    });
  }

  addBreaks = () => {
    this.breaks = this.attnForm.get('breaks') as FormArray;
    this.breaks.push(this.createBreaksArr());
  }

  removeBreaks = (index, id) => {
    this.breaks.removeAt(index);
    if (id !== null) {
      this.remove_breaks_arr.push(id);
    }
  }

  saveAttn = () => {
    if (this.attnForm.valid) {
      let postData: any = [];
      postData = this.attnForm.value;

      if (postData.check_in_time) {
        postData.check_in_time = moment(postData.check_in_time).set({ 'D': this.day, 'M': this.month, 'y': this.year }).format();
      }
      if (postData.check_out_time) {
        postData.check_out_time = moment(postData.check_out_time).set({ 'D': this.day, 'M': this.month, 'y': this.year }).format();
        if (this.check_in_data) {
          // update mode
          if (!this.check_in_data.check_out_time) {
            postData.check_out_emp_id = this.user_data.id;
          } else {
            if (moment(this.check_in_data.check_out_time.date).format() !== moment(postData.check_out_time).format()) {
              postData.check_out_emp_id = this.user_data.id;
            }
          }
        } else {
          // insert mode
          postData.check_out_emp_id = this.user_data.id;
        }
      }

      for (let i = 0; i < postData.breaks.length; i++) {
        if (postData.breaks[i].break_in_time) {
          postData.breaks[i].break_in_time = moment(postData.breaks[i].break_in_time).
            set({ 'D': this.day, 'M': this.month, 'y': this.year }).format();
        }
        if (postData.breaks[i].break_out_time) {
          postData.breaks[i].break_out_time = moment(postData.breaks[i].break_out_time).
            set({ 'D': this.day, 'M': this.month, 'y': this.year }).format();
        }
      }
      postData['remove_break_ids'] = this.remove_breaks_arr;
      this.spinner.show();
      this.attendanceService.updateAttendance(postData).subscribe(
        (res) => {
          if (res === 'updated') {
            this.msgService.pop('success', 'Updated', 'Attendance Updated');
          } else if (res === 'inserted') {
            this.msgService.pop('success', 'Added', 'Attendance Added');
          } else {
            this.msgService.pop('danger', 'Error', 'Error occured');
          }
          this.spinner.hide();
          this.navigateToManage();
        }
      );
    }
  }

  checkBreaksError = () => {
    let check_in = this.attnForm.get('check_in_time').value;
    let check_out = this.attnForm.get('check_out_time').value;
    this.attnForm.get('check_in_time').setErrors(null);
    this.attnForm.get('check_out_time').setErrors(null);
    if (check_in) {
      check_in = moment(check_in, 'h:mma').set({ 'D': this.day, 'M': this.month, 'y': this.year, second: 0, millisecond: 0 });
    }

    if (check_out) {
      check_out = moment(check_out, 'h:mma').set({ 'D': this.day, 'M': this.month, 'y': this.year, second: 0, millisecond: 0 });
      if (!check_in) {
        this.attnForm.get('check_in_time').setErrors({ 'err': true });
      } else {
        if (check_in.isAfter(check_out)) {
          this.attnForm.get('check_out_time').setErrors({ 'err': true });
        }
      }
    }

    let i = 0;
    for (const brk of this.breaks.controls) {
      let break_in: any = '';
      let break_out: any = '';
      if (brk['controls']['break_in_time'].value) {
        this.breaks.controls[i]['controls']['break_in_time'].setErrors(null);
        break_in = moment(brk['controls']['break_in_time'].value, 'h:mma').set(
          { 'D': this.day, 'M': this.month, 'y': this.year, second: 0, millisecond: 0 });
      }
      if (brk['controls']['break_out_time'].value) {
        this.breaks.controls[i]['controls']['break_out_time'].setErrors(null);
        break_out = moment(brk['controls']['break_out_time'].value, 'h:mma').set(
          { 'D': this.day, 'M': this.month, 'y': this.year, second: 0, millisecond: 0 });
      }

      if (check_in) {
        if (break_in && break_in.isBefore(check_in)) {
          this.breaks.controls[i]['controls']['break_in_time'].setErrors({ 'err': true });
        }

        if (break_out && break_out.isBefore(check_in)) {
          this.breaks.controls[i]['controls']['break_out_time'].setErrors({ 'err': true });
        }
      }
      if (check_out) {
        if (break_in) {
          if (!break_out) {
            this.breaks.controls[i]['controls']['break_out_time'].setErrors({ 'err': true });
          }
        }
        if (break_in && break_in.isAfter(check_out)) {
          this.breaks.controls[i]['controls']['break_in_time'].setErrors({ 'err': true });
        }
        if (break_out && break_out.isAfter(check_out)) {
          this.breaks.controls[i]['controls']['break_out_time'].setErrors({ 'err': true });
        }
      }

      if (break_in && break_out) {
        if (break_out.isBefore(break_in)) {
          this.breaks.controls[i]['controls']['break_out_time'].setErrors({ 'err': true });
        }
      }

      if (break_out && !break_in) {
        this.breaks.controls[i]['controls']['break_in_time'].setErrors({ 'err': true });
      }
      i++;
    }
  }


  navigateToManage = () => {
    this.router.navigate(['/attendance/manage']);
  }
}
