import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HolidayEventsComponent } from './holiday-events.component';
import { HolidayEventsRoutingModule } from './holiday-events-routing.module';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { QuillModule } from 'ngx-quill';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OwlDateTimeFormats, DateTimeAdapter, OWL_DATE_TIME_LOCALE, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';

export const MY_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
    parseInput: 'MM/YYYY',
    fullPickerInput: 'l LT',
    datePickerInput: 'DD/MM/YYYY',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
    imports: [
        SharedModule,
        HolidayEventsRoutingModule,
        CommonModule,
        CalendarModule.forRoot(),
        NgMultiSelectDropDownModule.forRoot(),
        QuillModule
    ],
    providers: [
        { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },

        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS },
    ],
    declarations: [
        HolidayEventsComponent
    ]
})

export class HolidayEventsModule {

}
