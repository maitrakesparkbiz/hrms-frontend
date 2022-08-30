import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { SelfDashboardComponent } from './self-dashboard.component';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { SelfDashboardCalenderComponent } from './self-dashboard-calender/self-dashboard-calender.component';
import { CalendarModule } from 'angular-calendar';

const routes: Routes = [
    {
        path: '',
        component: SelfDashboardComponent,
        data: {
            title: 'Dashboard'
        }
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        CalendarModule.forRoot(),
    ],
    declarations: [
        SelfDashboardComponent,
        SelfDashboardCalenderComponent
    ],
    exports: [
        RouterModule
    ]
})


export class SelfDashboardModule {

}
