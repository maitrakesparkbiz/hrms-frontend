import { NgModule } from '@angular/core';
import { SelfCalendarComponent } from './self-calendar.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { CalendarModule } from 'angular-calendar';
import { CommonModule } from '@angular/common';

const routes: Routes = [
    {
        path: '',
        component: SelfCalendarComponent,
        data: {
            title: 'Calendar'
        }
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        CalendarModule.forRoot(),
        CommonModule
    ],
    declarations: [SelfCalendarComponent],
    exports: [RouterModule]
})

export class SelfCalendarModule {

}
