import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LeaveapplicationService} from "../../../../shared/services/leaveapplication.service";
import {FlashMessageService} from "../../../../shared/services/flash-message.service";

@Component({
  selector: 'app-leave-balance-edit',
  templateUrl: './leave-balance-edit.component.html',
  styleUrls: ['./leave-balance-edit.component.scss']
})
export class LeaveBalanceEditComponent implements OnInit {
    leaveBalanceForm: FormGroup;
    id;
    leave_balance : any [];
    leave_data: any = [];
  constructor(private router:Router,
              private route:ActivatedRoute,
              private leave_balance_service :LeaveapplicationService,
              private flashMessageService: FlashMessageService) { }

  ngOnInit() {
      this.route.params.subscribe(params => {

          this.id = +params['id']; // (+) converts string 'id' to a number

      });
        this.getLeaveBalanceRecord();
      this.leaveBalanceForm = new FormGroup({
          'cl': new FormControl(null, [Validators.required]),
          'pl': new FormControl(null,[Validators.required]),
          'sl': new FormControl(null,[ Validators.required]),
          'id': new FormControl(this.id),
      });

  }
    getLeaveBalanceRecord = () => {
        this.leave_balance_service.getLeaveBalance(this.id).subscribe((res:any) => {
            this.leave_data = res['emp_id'];
            if(res) {
                this.leaveBalanceForm.get('cl').setValue(res['cl']);
                this.leaveBalanceForm.get('pl').setValue(res['pl']);
                this.leaveBalanceForm.get('sl').setValue(res['sl']);
            }

        });
    }

  cancel = () => {
      this.router.navigate(['/leave/leave-balance']);
  }
    SaveLeaveBalance = () => {
        if (this.leaveBalanceForm.valid) {
            this.leave_balance = this.leaveBalanceForm.value;
            this.leave_balance_service.SaveLeaveBalance(this.leave_balance).subscribe(res => {
                if (res === 'Leave Balance Updated SuccesFully') {
                    // this.closeModel();
                    this.flashMessageService.pop('success', 'Leave Balance Updated SuccesFully', 'Leave Updated');
                    this.cancel();
                }
            });
        }
    }

}
