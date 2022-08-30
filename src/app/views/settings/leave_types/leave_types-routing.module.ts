import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveTypesComponent } from './leave_types.component';
import { LeaveTypesEditComponent } from './leave_types_edit/leave_types_edit.component';

const routes: Routes = [
    {
        path: '',
        component: LeaveTypesComponent,
        data: {
            title: 'Leave Type'
        },
    },
    {
        path: 'create',
        component: LeaveTypesEditComponent,
        data: {
            title: 'Add Leave-type',
            auth: 'LEAVETYPES.ADD'
        }
    },
    {
        path: 'edit-leavetypes/:id',
        component: LeaveTypesEditComponent,
        data: {
            title: 'Edit Leave-type',
            auth: 'LEAVETYPES.EDIT'
        }
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeaveTypesRoutingModule {
}
