import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DashboardExpenseComponent } from './dashboard-expense/dashboard-expense.component';
import { DashboardAttendanceComponent } from './dashboard-attendance/dashboard-attendance.component';
import { DashboardCalenderComponent } from './dashboard-calender/dashboard-calender.component';
import { CalendarModule } from 'angular-calendar';
import { ChartsModule } from 'ng2-charts';
import { DashboardExpenseReportComponent } from './dashboard-expense-report/dashboard-expense-report.component';

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule,
    CalendarModule.forRoot(),
    ChartsModule
  ],
  declarations: [
    DashboardComponent,
    DashboardExpenseComponent,
    DashboardAttendanceComponent,
    DashboardCalenderComponent,
    DashboardExpenseReportComponent
  ]
})
export class DashboardModule {
}
