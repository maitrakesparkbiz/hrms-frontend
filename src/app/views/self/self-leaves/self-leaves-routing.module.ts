import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationsComponent } from './applications/applications.component';
import { LeaveRemainingComponent } from './leave-remaining/leave-remaining.component';
import { UnpaidLeavesComponent } from './unpaid-leaves/unpaid-leaves.component';
import { TakenLeavesComponent } from './taken-leaves/taken-leaves.component';

const routes: Routes = [
    {
        path: 'leave-applications',
        component: ApplicationsComponent,
        data: {
            title: 'Leave Application',
            auth: 'SELF-LEAVES.APPLICATIONS.VIEW'
        }
    },
    {
        path: 'leave-remaining',
        component: LeaveRemainingComponent,
        data: {
            title: 'Leave Remaining'
        }
    },
    {
        path: 'unpaid-leave',
        component: UnpaidLeavesComponent,
        data: {
            title: 'Unpaid Leaves',
            auth: 'SELF-LEAVES.UNPAID-LEAVES.VIEW'
        }
    },
    {
        path: 'taken-leaves',
        component: TakenLeavesComponent,
        data: {
            title: 'All Taken Leaves',
            auth: 'SELF-LEAVES.TAKEN-LEAVES.VIEW'
        }
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SelfLeavesRoutingModule {

}
