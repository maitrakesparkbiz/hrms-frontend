import { NgModule } from '@angular/core';


import { LeaveRoutingModule } from './leave-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { LeaveApplicationComponent } from './leave-application/leave-application.component';
import { LeaveComponent } from './leave.component';
import { LeaveRemainingComponent } from './leave-remaining/leave-remaining.component';
import { UnpaidLeaveComponent } from './Unpaid-leave/Unpaid-leave.component';
import { LeaveReportComponent } from './leave-report/leave-report.component';
import { FinalLeavesComponent } from './final-leave-summary/final-leaves.component';
import { LeaveBalanceComponent } from './leave-balance/leave-balance.component';
import { LeaveBalanceEditComponent } from './leave-balance/leave-balance-edit/leave-balance-edit.component';

@NgModule({
    imports: [
        SharedModule,
        LeaveRoutingModule
    ],
    declarations: [
        LeaveApplicationComponent,
        LeaveComponent,
        LeaveRemainingComponent,
        UnpaidLeaveComponent,
        LeaveReportComponent,
        FinalLeavesComponent,
        LeaveBalanceComponent,
        LeaveBalanceEditComponent
    ]
})
export class LeaveModule {
}
