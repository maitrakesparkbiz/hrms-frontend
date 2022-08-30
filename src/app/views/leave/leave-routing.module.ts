import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveApplicationComponent } from './leave-application/leave-application.component';
import { LeaveComponent } from './leave.component';
import { LeaveRemainingComponent } from './leave-remaining/leave-remaining.component';
import { UnpaidLeaveComponent } from './Unpaid-leave/Unpaid-leave.component';
import { LeaveReportComponent } from './leave-report/leave-report.component';
import { FinalLeavesComponent } from './final-leave-summary/final-leaves.component';
import { LeaveBalanceComponent } from "./leave-balance/leave-balance.component";
import {LeaveBalanceEditComponent} from "./leave-balance/leave-balance-edit/leave-balance-edit.component";
const routes: Routes = [
    {
        path: 'leave-applications',
        component: LeaveComponent,
        data: {
            title: 'Leave Applications',
            auth: 'LEAVES.LEAVE-APP.VIEW'
        },
    },
    {
        path: 'final-leaves/create',
        component: LeaveApplicationComponent,
        data: {
            title: 'Apply Leave',
            auth: 'LEAVES.FINAL-LEAVES.ADD'
        }
    },
    {
        path: 'final-leaves/edit/:id',
        component: LeaveApplicationComponent,
        data: {
            title: 'Edit Leave'
        }
    }, {
        // path: 'leave-report',
        path: 'today\'s-leaves',
        component: LeaveReportComponent,
        data: {
            title: 'Today\'s leaves',
            auth: 'LEAVES.TODAY-LEAVES.VIEW'
        }
    },
    {
        path: 'final-leaves',
        component: FinalLeavesComponent,
        data: {
            title: 'Final Leave Summary',
            auth: 'LEAVES.FINAL-LEAVES.VIEW'
        }
    },
    {
        path: 'leave-balance',
        component: LeaveBalanceComponent,
        data: {
            title: 'Leave Balance',
            auth: 'LEAVES.LEAVE-BALANCE.VIEW'
        }
    },
    {
        path: 'leave-balance/edit/:id',
        component: LeaveBalanceEditComponent,
        data: {
            title: 'Edit Leave Balance'
        }
    },
    {
        path: 'leave-remaining',
        component: LeaveRemainingComponent,
        data: {
            title: 'Leave Remaining',
            auth: 'LEAVES.LEAVES-REMAINING.VIEW'
        },
    },
    {
        path: 'unpaid-leave',
        component: UnpaidLeaveComponent,
        data: {
            title: 'Unpaid Leave',
            auth: 'LEAVES.UNPAID-LEAVES.VIEW'
        },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeaveRoutingModule {
}
