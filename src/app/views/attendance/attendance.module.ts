import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance.component';
import { SummaryComponent } from './summary/summary.component';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { ManageComponent } from './manage/manage.component';
import { AddAttnComponent } from './add-attendance/add-attn.component';
import {ReportComponent} from "./report/report.component";

@NgModule({
    imports: [
        SharedModule,
        AttendanceRoutingModule,
        CommonModule,
        CalendarModule.forRoot(),
    ],
    declarations: [
        AttendanceComponent,
        SummaryComponent,
        ManageComponent,
        AddAttnComponent
        // ,ReportComponent
    ]
})

export class AttendanceModule {

}
