import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceComponent } from './attendance.component';
import { SummaryComponent } from './summary/summary.component';
import { ManageComponent } from './manage/manage.component';
import { AddAttnComponent } from './add-attendance/add-attn.component';
import {ReportComponent} from "./report/report.component";

const routes: Routes = [
    {
        path: '',
        component: AttendanceComponent,
        data: {
            title: 'Attendance'
        },
    },
    {
        path: 'summary',
        component: SummaryComponent,
        data: {
            title: 'Summary',
            auth: 'ATTENDANCE.SUMMARY.VIEW'
        }
    },
    {
        path: 'manage',
        component: ManageComponent,
        data: {
            title: 'Manage',
            auth: 'ATTENDANCE.MANAGE.VIEW'
        }
    },
    // {
    //     path: 'report',
    //     component: ReportComponent,
    //     data: {
    //         title: 'Report',
    //         auth: 'ATTENDANCE.REPORT.VIEW'
    //     }
    // },
    {
        path: 'new-attendance/:id_date',
        component: AddAttnComponent,
        data: {
            title: 'Mark Attendance',
            auth: 'ATTENDANCE.MANAGE.VIEW'
        }
    },
    {
        path: 'mark-attendance/:check_in_id_date',
        component: AddAttnComponent,
        data: {
            title: 'Mark Attendance',
            auth: 'ATTENDANCE.MANAGE.EDIT'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AttendanceRoutingModule {
}
